import { useState, useEffect } from 'react';

// A basic useAuth hook for demonstration purposes
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an async authentication check
    const token = localStorage.getItem('auth_token');

    // In a real application, you'd fetch user details using the token
    if (token) {
      // Dummy user object
      setUser({ name: 'John Doe', email: 'john@example.com' });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  return { user, loading };
};

export default useAuth; 