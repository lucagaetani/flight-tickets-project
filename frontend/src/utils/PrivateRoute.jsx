import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const PrivateRoute = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const requestOptions = {
            method: "GET",
            credentials: "include",
        };
        const response = await fetch('http://localhost:3000/auth', requestOptions);
        const res = await response.json();

        if (res.success) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    })();

  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return authenticated ? <Outlet /> : navigateTo("/login");
}

export default PrivateRoute;
