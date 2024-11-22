import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  profile: Record<string, any>;
  created_at: string;
}

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/user/${username}`);
        setProfile(response.data);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            <span className="text-sm text-gray-600">
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Contact</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>

          {Object.entries(profile.profile).length > 0 && (
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Profile Information</h2>
              <div className="space-y-2">
                {Object.entries(profile.profile).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-medium text-gray-700 w-1/3 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
