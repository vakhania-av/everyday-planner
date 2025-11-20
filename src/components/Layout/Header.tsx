import { AppBar, Avatar, Button, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MouseEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import { useAuthStore, useUiStore } from "../../hooks/useStores";
import ThemeToggle from "./ThemeToggle";

const Header = observer(() => {
  const { currentUser, loggingOut, logout } = useAuthStore();
  const { addToast } = useUiStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (evt: MouseEvent<HTMLButtonElement>) => setAnchorEl(evt.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
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
      <Button
        color="inherit"
        component={Link}
        to="/dashboard"
      >
        Dashboard
      </Button>
      <Button
        color="inherit"
        onClick={handleMenuOpen}
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        disabled={loggingOut}
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          {currentUser.name?.charAt(0).toUpperCase()}
        </Avatar>
        {currentUser.name}
        {loggingOut && ' (Logging out...)'}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleSettings}>Settings</MenuItem>
        <MenuItem onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? 'Logging out...' : 'Logout'}
        </MenuItem>
      </Menu>
    </>
  ) : (
    <>
      <Button color="inherit" component={Link} to="/login">Login</Button>
      <Button color="inherit" component={Link} to="/register">Register</Button>
    </>
  );

  return (
    <AppBar
      position="static"
      sx={{
        transition: 'all 0.3s ease',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            EveryDay Planner
          </Button>
        </Typography>
        <ThemeToggle />
        {menu}
      </Toolbar>
    </AppBar>
  );
});

export default Header;
