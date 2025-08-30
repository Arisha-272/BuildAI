import React, { useState } from 'react';
import { Plus, Trash2, Database, Table, Key, Type } from 'lucide-react';
import { DatabaseTable, DatabaseField } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

export const SchemaBuilder: React.FC = () => {
  const { currentProject, setCurrentProject } = useAppContext();
  const [tables, setTables] = useState<DatabaseTable[]>(currentProject?.backendSchema || []);
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);

  const fieldTypes = [
    { value: 'string', label: 'Text', icon: Type },
    { value: 'number', label: 'Number', icon: Type },
    { value: 'boolean', label: 'Boolean', icon: Type },
    { value: 'date', label: 'Date', icon: Type },
    { value: 'email', label: 'Email', icon: Type },
    { value: 'password', label: 'Password', icon: Key }
  ];

  const addTable = () => {
    const newTable: DatabaseTable = {
      id: `table-${Date.now()}`,
      name: 'new_table',
      fields: [
        {
          id: `field-${Date.now()}`,
          name: 'id',
          type: 'string',
          required: true,
          unique: true
        }
      ]
    };

    const updatedTables = [...tables, newTable];
    setTables(updatedTables);
    setSelectedTable(newTable);
    updateProjectSchema(updatedTables);
  };

  const addField = (tableId: string) => {
    const newField: DatabaseField = {
      id: `field-${Date.now()}`,
      name: 'new_field',
      type: 'string',
      required: false
    };

    const updatedTables = tables.map(table => 
      table.id === tableId 
        ? { ...table, fields: [...table.fields, newField] }
        : table
    );

    setTables(updatedTables);
    updateProjectSchema(updatedTables);
  };

  const updateField = (tableId: string, fieldId: string, updates: Partial<DatabaseField>) => {
    const updatedTables = tables.map(table => 
      table.id === tableId 
        ? {
            ...table,
            fields: table.fields.map(field => 
              field.id === fieldId ? { ...field, ...updates } : field
            )
          }
        : table
    );

    setTables(updatedTables);
    updateProjectSchema(updatedTables);
  };

  const deleteField = (tableId: string, fieldId: string) => {
    const updatedTables = tables.map(table => 
      table.id === tableId 
        ? { ...table, fields: table.fields.filter(field => field.id !== fieldId) }
        : table
    );

    setTables(updatedTables);
    updateProjectSchema(updatedTables);
  };

  const deleteTable = (tableId: string) => {
    const updatedTables = tables.filter(table => table.id !== tableId);
    setTables(updatedTables);
    if (selectedTable?.id === tableId) {
      setSelectedTable(null);
    }
    updateProjectSchema(updatedTables);
  };

  const updateProjectSchema = (updatedTables: DatabaseTable[]) => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        backendSchema: updatedTables
      });
    }
  };

  return (
    <div className="bg-gray-900 text-white h-full flex">
      {/* Tables List */}
      <div className="w-64 border-r border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Tables</span>
          </h3>
          <button
            onClick={addTable}
            className="p-1 bg-green-600 rounded hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {tables.map(table => (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedTable?.id === table.id 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Table className="w-4 h-4" />
                  <span className="text-sm font-medium">{table.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable(table.id);
                  }}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {table.fields.length} fields
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Editor */}
      <div className="flex-1 p-4">
        {selectedTable ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <input
                type="text"
                value={selectedTable.name}
                onChange={(e) => {
                  const updatedTables = tables.map(table => 
                    table.id === selectedTable.id 
                      ? { ...table, name: e.target.value }
                      : table
                  );
                  setTables(updatedTables);
                  setSelectedTable({ ...selectedTable, name: e.target.value });
                  updateProjectSchema(updatedTables);
                }}
                className="text-xl font-semibold bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none"
              />
              <button
                onClick={() => addField(selectedTable.id)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Field</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedTable.fields.map(field => (
                <div key={field.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => updateField(selectedTable.id, field.id, { name: e.target.value })}
                      placeholder="Field name"
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => updateField(selectedTable.id, field.id, { type: e.target.value as any })}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteField(selectedTable.id, field.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(selectedTable.id, field.id, { required: e.target.checked })}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Required</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.unique || false}
                        onChange={(e) => updateField(selectedTable.id, field.id, { unique: e.target.checked })}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Unique</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Database Schema Builder</h3>
              <p className="text-sm">Create a new table or select an existing one to start building your database schema</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};