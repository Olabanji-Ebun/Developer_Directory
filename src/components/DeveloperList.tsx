import { Users, Code, Briefcase, Calendar, Edit, Trash2 } from 'lucide-react';
import type { Developer } from '../lib/api';

interface DeveloperListProps {
  developers: Developer[];
  onEdit: (developer: Developer) => void;
  onDelete: (id: string) => void;
}

export default function DeveloperList({ developers, onEdit, onDelete }: DeveloperListProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Frontend':
        return 'bg-blue-100 text-blue-800';
      case 'Backend':
        return 'bg-green-100 text-green-800';
      case 'Full-Stack':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (developers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Developers Yet</h3>
        <p className="text-gray-500">Add your first developer to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {developers.map((dev) => (
        <div
          key={dev.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{dev.name}</h3>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                  dev.role
                )}`}
              >
                {dev.role}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Code className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tech Stack</p>
                <div className="flex flex-wrap gap-1">
                  {dev.tech_stack.split(',').map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Experience</p>
                <p className="text-sm text-gray-800">
                  {dev.experience} {dev.experience === 1 ? 'year' : 'years'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Added {formatDate(dev.created_at)}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => onEdit(dev)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(dev.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}