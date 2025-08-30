import React, { useState } from 'react';
import { Plus, FolderOpen, Trash2, Calendar } from 'lucide-react';
import { Project } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

export const ProjectManager: React.FC = () => {
  const { setCurrentProject } = useAppContext();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);

  const createNewProject = () => {
    if (!projectName.trim()) return;

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectName,
      description: projectDescription,
      elements: [],
      generatedCode: {
        html: '',
        css: '',
        js: '',
        react: ''
      },
      backendSchema: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSavedProjects([...savedProjects, newProject]);
    setCurrentProject(newProject);
    setShowCreateProject(false);
    setProjectName('');
    setProjectDescription('');
  };

  const loadProject = (project: Project) => {
    setCurrentProject(project);
  };

  return (
    <div className="bg-gray-900 text-white p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={() => setShowCreateProject(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {showCreateProject && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-4">Create New Project</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Project description (optional)"
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex space-x-2">
              <button
                onClick={createNewProject}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateProject(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {savedProjects.map(project => (
          <div
            key={project.id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => loadProject(project)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium mb-1">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                )}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{project.createdAt.toLocaleDateString()}</span>
                  </span>
                  <span>{project.elements.length} elements</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSavedProjects(savedProjects.filter(p => p.id !== project.id));
                }}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {savedProjects.length === 0 && !showCreateProject && (
          <div className="text-center text-gray-400 py-8">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No projects yet. Create your first project to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};