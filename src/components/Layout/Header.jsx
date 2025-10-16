import { AppBar, Avatar, Button, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { resetLoggedOut, setLoggedOut } from "../../api/notifications";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (evt) => setAnchorEl(evt.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      setLoggedOut();
      handleMenuClose();
      navigate('/', { replace: true });
      await logout();
      addToast('You have been logged out successfully', 'info', 2000);
    } catch (err) {
      console.error('Logout error: ', err);
      addToast('Failed to log out', 'error');
    } finally {
      resetLoggedOut();
    }
  };

  const menu = currentUser ? (
    <>
      <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
      <Button color="inherit" onClick={handleMenuOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32 }}>
          {currentUser.name?.charAt(0).toUpperCase()}
        </Avatar>
        {currentUser.name}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  ) : (
    <>
      <Button color="inherit" component={Link} to="/login">Login</Button>
      <Button color="inherit" component={Link} to="/register">Register</Button>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">EveryDay Planner</Button>
        </Typography>
        {menu}
      </Toolbar>
    </AppBar>
  );
}
