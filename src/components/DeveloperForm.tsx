import { useState, useEffect } from 'react';
import { UserPlus, Save, X } from 'lucide-react';
import type { NewDeveloper, Developer } from '../lib/api';

interface DeveloperFormProps {
  onSubmit: (developer: NewDeveloper) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Developer | null;
  onCancel?: () => void;
}

export default function DeveloperForm({ 
  onSubmit, 
  isSubmitting, 
  initialData,
  onCancel 
}: DeveloperFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    role: 'Frontend' | 'Backend' | 'Full-Stack';
    tech_stack: string;
    experience: number | '';
  }>({
    name: '',
    role: 'Frontend',
    tech_stack: '',
    experience: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        role: initialData.role,
        tech_stack: initialData.tech_stack,
        experience: initialData.experience,
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.tech_stack.trim()) {
      newErrors.tech_stack = 'Tech stack is required';
    }

    const experienceValue = formData.experience === '' ? 0 : formData.experience;
    if (experienceValue < 0) {
      newErrors.experience = 'Experience must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert empty experience to 0 before submitting
    const submitData: NewDeveloper = {
      ...formData,
      experience: formData.experience === '' ? 0 : formData.experience,
    };

    await onSubmit(submitData);

    // Only reset form if we're not editing
    if (!initialData) {
      setFormData({
        name: '',
        role: 'Frontend',
        tech_stack: '',
        experience: '',
      });
    }
    setErrors({});
  };

  const handleChange = (field: keyof typeof formData, value: string | number | '') => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Developer' : 'Add New Developer'}
          </h2>
        </div>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter developer name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value as 'Frontend' | 'Backend' | 'Full-Stack')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Full-Stack">Full-Stack</option>
          </select>
        </div>

        <div>
          <label htmlFor="tech_stack" className="block text-sm font-medium text-gray-700 mb-2">
            Tech Stack * <span className="text-gray-500 text-xs">(comma-separated)</span>
          </label>
          <input
            id="tech_stack"
            type="text"
            value={formData.tech_stack}
            onChange={(e) => handleChange('tech_stack', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.tech_stack ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., React, TypeScript, Node.js"
          />
          {errors.tech_stack && <p className="mt-1 text-sm text-red-600">{errors.tech_stack}</p>}
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Experience (years) *
          </label>
          <input
            id="experience"
            type="number"
            min="0"
            value={formData.experience}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string, otherwise parse as integer
              const parsedValue = value === '' ? '' : parseInt(value) || 0;
              handleChange('experience', parsedValue);
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.experience ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Years of experience"
          />
          {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
        </div>
      </div>

      {/* Fixed button section with proper spacing */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {initialData ? (
            <>
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Updating...' : 'Update Developer'}
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              {isSubmitting ? 'Adding...' : 'Add Developer'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}