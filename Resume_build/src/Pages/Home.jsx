import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      fetchEmployees();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_BACKEND_URL}` + '/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        }
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch employees",
        variant: "destructive",
      });
      if (error.message === 'Unauthorized: Please log in again') {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
      
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader>
              <CardTitle>{employee.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: {employee.email}</p>
              <p>Resumes: {employee.resumes.length}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
