import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

type Props = {
  isOpen: boolean;
};

const Loader = (props: Props) => {
  return (
    <Backdrop
      open={props.isOpen}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
