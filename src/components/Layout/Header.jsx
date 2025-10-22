import { AppBar, Avatar, Button, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useAuthStore, useUiStore } from "../../hooks/useStores";

const Header = observer(() => {
  const { currentUser, loggingOut, logout } = useAuthStore();
  const { addToast } = useUiStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (evt) => setAnchorEl(evt.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      navigate('/', { replace: true });
      await logout();
      addToast('You have been logged out successfully', 'info', 2000);
    } catch (err) {
      console.error('Logout error: ', err);
      addToast('Failed to log out', 'error');
    }
  };

  const menu = currentUser ? (
    <>
      <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
      <Button color="inherit" onClick={handleMenuOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1 }} disabled={loggingOut}>
        <Avatar sx={{ width: 32, height: 32 }}>
          {currentUser.name?.charAt(0).toUpperCase()}
        </Avatar>
        {currentUser.name}
        {loggingOut && '(Logging out...)'}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout} disabled={loggingOut}>{loggingOut ? 'Logging out...' : 'Logout'}</MenuItem>
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
});

export default Header;
