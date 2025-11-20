import { observer } from "mobx-react-lite";
import { Alert, Snackbar } from "@mui/material";
import { useUiStore } from "../../hooks/useStores";

const ToastContainer = observer(() => {
  const { toastQueue, removeToast } = useUiStore();

  const handleClose = (id: string) => removeToast(id);

  return (
    <>
      {toastQueue?.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            bottom: `${index * 70 + 20}px` // Смещаем тосты друг над другом
          }}>
          <Alert
            severity={toast.severity}
            onClose={() => handleClose(toast.id)}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
});

export default ToastContainer;
