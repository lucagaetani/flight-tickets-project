import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigateTo = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(document.cookie);

    if (token) {
      fetch('http://localhost:3000/user/login', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUser(data.user))
        .catch((error) => console.error('Error fetching user:', error));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleLogin = () => {
    navigateTo('/login');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Booking Flight Tickets
          </Typography>
            {user ? (
              <>
                <Typography variant="body1" component="div">
                  Hey, {user.name}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={handleLogin}>Login</Button>
            )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
