import { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import DeveloperForm from './components/DeveloperForm';
import DeveloperList from './components/DeveloperList';
import SearchFilter from './components/SearchFilter';
import ToastContainer from './components/ToastContainer';
import { addDeveloper, getDevelopers, updateDeveloper, deleteDeveloper } from './lib/api';
import type { ToastMessage } from './components/Toast';
import type { Developer, NewDeveloper } from './lib/api';

function App() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);

  useEffect(() => {
    loadDevelopers();
  }, []);

  useEffect(() => {
    filterDevelopers();
  }, [developers, searchTerm, roleFilter]);

  const loadDevelopers = async () => {
    setIsLoading(true);
    const { data, error } = await getDevelopers();

    if (error) {
      showToast('error', 'Failed to load developers');
    } else if (data) {
      setDevelopers(data);
    }

    setIsLoading(false);
  };

  const filterDevelopers = () => {
    let filtered = [...developers];

    if (roleFilter) {
      filtered = filtered.filter((dev) => dev.role === roleFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (dev) =>
          dev.name.toLowerCase().includes(term) ||
          dev.tech_stack.toLowerCase().includes(term)
      );
    }

    setFilteredDevelopers(filtered);
  };

  const handleAddDeveloper = async (developer: NewDeveloper) => {
    setIsSubmitting(true);
    const { data, error } = await addDeveloper(developer);

    if (error) {
      showToast('error', `Failed to add developer: ${error}`);
    } else if (data) {
      setDevelopers((prev) => [data, ...prev]);
      showToast('success', 'Developer added successfully!');
    }

    setIsSubmitting(false);
  };

  const handleEditDeveloper = (developer: Developer) => {
    setEditingDeveloper(developer);
  };

  const handleUpdateDeveloper = async (developer: NewDeveloper) => {
    if (!editingDeveloper) return;

    setIsSubmitting(true);
    const { data, error } = await updateDeveloper(editingDeveloper.id, developer);

    if (error) {
      showToast('error', `Failed to update developer: ${error}`);
    } else if (data) {
      setDevelopers(prev => prev.map(dev => dev.id === editingDeveloper.id ? data : dev));
      setEditingDeveloper(null);
      showToast('success', 'Developer updated successfully!');
    }
    setIsSubmitting(false);
  };

  const handleDeleteDeveloper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this developer?')) {
      return;
    }

    const { error } = await deleteDeveloper(id);

    if (error) {
      showToast('error', `Failed to delete developer: ${error}`);
    } else {
      setDevelopers(prev => prev.filter(dev => dev.id !== id));
      showToast('success', 'Developer deleted successfully!');
    }
  };

  const handleCancelEdit = () => {
    setEditingDeveloper(null);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer toasts={toasts} onClose={closeToast} />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code2 className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Developer Directory</h1>
          </div>
          <p className="text-gray-600">
            Manage and explore our talented developer community
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <DeveloperForm 
            onSubmit={editingDeveloper ? handleUpdateDeveloper : handleAddDeveloper}
            isSubmitting={isSubmitting}
            initialData={editingDeveloper}
            onCancel={editingDeveloper ? handleCancelEdit : undefined}
          />

          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
          />

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading developers...</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                Showing {filteredDevelopers.length} of {developers.length} developers
              </div>
              <DeveloperList 
                developers={filteredDevelopers} 
                onEdit={handleEditDeveloper}
                onDelete={handleDeleteDeveloper}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;