import useEventStore from '../store/eventStore';
import { Alert, Snackbar } from '@mui/material';

type iSnack = {
  message: string;
  id: number;
  type: 'error' | 'success';
};

const Toast = () => {
  const { snacks, removeSnack } = useEventStore();
  const ApiSnack = ({ snack }: { snack: iSnack }) => {
    return (
      <Snackbar
        autoHideDuration={3000}
        onClose={() => removeSnack(snack.id)}
        open={true}
      >
        <Alert onClose={() => removeSnack(snack.id)} severity={snack.type}>
          {snack.message}
        </Alert>
      </Snackbar>
    );
  };

  return (
    <>
      {snacks.map((item) => {
        return <ApiSnack snack={item} key={item.id} />;
      })}
    </>
  );
};

export default Toast;
