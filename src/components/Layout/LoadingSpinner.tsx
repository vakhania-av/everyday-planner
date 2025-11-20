import { Box, CircularProgress, Typography } from "@mui/material";

interface ILoadingSpinnerProps {
  message: string;
}

export default function LoadingSpinner({ message = 'Загрузка...' }: ILoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{ mb: 2, color: 'primary.main' }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        {message}
      </Typography>
    </Box>
  );
}
