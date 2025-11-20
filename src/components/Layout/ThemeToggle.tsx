import {
  Box,
  FormControlLabel,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Typography
} from "@mui/material";
import { Computer, DarkMode, LightMode } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useThemeStore } from "../../hooks/useStores";
import type { ThemeType } from "@/types/theme";

const ThemeToggle = observer(() => {
  const { currentTheme, systemPreference, setTheme, setSystemPreference } = useThemeStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (evt: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(evt.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (theme: ThemeType) => {
    setTheme(theme);
    handleMenuClose();
  };

  const handleSystemToggle = (evt: ChangeEvent<HTMLInputElement>) => {
    setSystemPreference(evt.target.checked);
  };

  const getCurrentThemeIcon = () => {
    if (systemPreference) {
      return <Computer />;
    }

    return currentTheme === 'dark' ? <DarkMode /> : <LightMode />;
  };

  const getCurrentThemeText = () => {
    if (systemPreference) {
      return 'System';
    }

    return currentTheme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleMenuOpen}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: 'rotate(15deg)'
          }
        }}
      >
        {getCurrentThemeIcon()}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 200
            }
          }
        }}
      >
        <MenuItem
          onClick={() => handleThemeChange('light')}
          selected={!systemPreference && currentTheme === 'light'}
        >
          <ListItemIcon>
            <LightMode fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Light">Light</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleThemeChange('dark')}
          selected={!systemPreference && currentTheme === 'dark'}
        >
          <ListItemIcon>
            <DarkMode fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dark">Dark</ListItemText>
        </MenuItem>

        <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
          <FormControlLabel
            control={
              <Switch
                checked={systemPreference}
                onChange={handleSystemToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Computer fontSize="small" />
                <Typography variant="body2">System</Typography>
              </Box>
            }
            labelPlacement="end"
          />
        </Box>

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Current: {getCurrentThemeText()}
          </Typography>
        </Box>

      </Menu>
    </>
  );
});

export default ThemeToggle;
