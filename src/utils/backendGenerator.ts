import { DatabaseTable } from '../types';

export const generateBackendCode = (tables: DatabaseTable[]) => {
  const apiRoutes = generateAPIRoutes(tables);
  const databaseSchema = generateDatabaseSchema(tables);
  const authFlow = generateAuthenticationFlow();

  return {
    apiRoutes,
    databaseSchema,
    authFlow,
    packageJson: generatePackageJson(),
    serverCode: generateServerCode(tables)
  };
};

const generateAPIRoutes = (tables: DatabaseTable[]): string => {
  const routes = tables.map(table => {
    const tableName = table.name;
    const modelName = capitalizeFirst(tableName);

    return `
// ${modelName} Routes
router.get('/${tableName}', async (req, res) => {
  try {
    const items = await ${modelName}.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/${tableName}/:id', async (req, res) => {
  try {
    const item = await ${modelName}.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: '${modelName} not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/${tableName}', async (req, res) => {
  try {
    const item = await ${modelName}.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/${tableName}/:id', async (req, res) => {
  try {
    const [updated] = await ${modelName}.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const item = await ${modelName}.findByPk(req.params.id);
      res.json(item);
    } else {
      res.status(404).json({ error: '${modelName} not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/${tableName}/:id', async (req, res) => {
  try {
    const deleted = await ${modelName}.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: '${modelName} not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`;
  }).join('\n');

  return `const express = require('express');
const router = express.Router();
${tables.map(table => `const ${capitalizeFirst(table.name)} = require('../models/${capitalizeFirst(table.name)}');`).join('\n')}

${routes}

module.exports = router;`;
};

const generateDatabaseSchema = (tables: DatabaseTable[]): string => {
  const models = tables.map(table => {
    const fields = table.fields.map(field => {
      const sequelizeType = getSequelizeType(field.type);
      const constraints = [];
      
      if (field.required) constraints.push('allowNull: false');
      if (field.unique) constraints.push('unique: true');
      if (field.defaultValue) constraints.push(`defaultValue: '${field.defaultValue}'`);

      return `    ${field.name}: {
      type: DataTypes.${sequelizeType},${constraints.length > 0 ? '\n      ' + constraints.join(',\n      ') : ''}
    }`;
    }).join(',\n');

    return `const ${capitalizeFirst(table.name)} = sequelize.define('${capitalizeFirst(table.name)}', {
${fields}
  }, {
    tableName: '${table.name}',
    timestamps: true
  });`;
  }).join('\n\n');

  return `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

${models}

module.exports = {
${tables.map(table => `  ${capitalizeFirst(table.name)}`).join(',\n')}
};`;
};

const generateAuthenticationFlow = (): string => {
  return `const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    const token = generateToken(user.id);
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { authMiddleware, register, login };`;
};

const generatePackageJson = (): string => {
  return `{
  "name": "generated-backend",
  "version": "1.0.0",
  "description": "Auto-generated backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "sequelize-cli db:migrate",
    "seed": "sequelize-cli db:seed:all"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.32.1",
    "pg": "^8.11.0",
    "pg-hstore": "^2.3.4",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "sequelize-cli": "^6.6.1"
  }
}`;
};

const generateServerCode = (tables: DatabaseTable[]): string => {
  return `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
${tables.map(table => `app.use('/api/${table.name}', require('./routes/${table.name}'));`).join('\n')}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;`;
};

const getSequelizeType = (fieldType: string): string => {
  switch (fieldType) {
    case 'string':
    case 'email':
    case 'password':
      return 'STRING';
    case 'number':
      return 'INTEGER';
    case 'boolean':
      return 'BOOLEAN';
    case 'date':
      return 'DATE';
    default:
      return 'STRING';
  }
};

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};