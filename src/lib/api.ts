// Local type definitions - no more supabase dependency
export interface Developer {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Full-Stack';
  tech_stack: string;
  experience: number;
  created_at: string;
}

export type NewDeveloper = Omit<Developer, 'id' | 'created_at'>;

// Use Render URL in production, localhost in development
const API_URL = import.meta.env.PROD 
  ? 'https://developer-directory-backend-gnna.onrender.com'
  : 'http://localhost:3001';

export async function addDeveloper(developer: NewDeveloper): Promise<{ data: Developer | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/developers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(developer),
      // Remove the created_at from here - your backend now adds it automatically
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { data: null, error: errorData.error || 'Failed to add developer' };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to add developer',
    };
  }
}

export async function getDevelopers(): Promise<{ data: Developer[] | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/developers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { data: null, error: 'Failed to fetch developers' };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch developers',
    };
  }
}

export async function updateDeveloper(id: string, developer: Partial<Developer>): Promise<{ data: Developer | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/developers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(developer),
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text if it fails
      try {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to update developer' };
      } catch {
        const errorText = await response.text();
        return { data: null, error: `Failed to update developer: ${errorText}` };
      }
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update developer',
    };
  }
}

export async function deleteDeveloper(id: string): Promise<{ error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/developers/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // Try to parse error as JSON, fallback to text if it fails
      try {
        const errorData = await response.json();
        return { error: errorData.error || 'Failed to delete developer' };
      } catch {
        const errorText = await response.text();
        return { error: `Failed to delete developer: ${errorText}` };
      }
    }

    return { error: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to delete developer',
    };
  }
}