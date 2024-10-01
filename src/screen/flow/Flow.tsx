import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

type Props = {};

const Flow = (props: Props) => {
  return (
    <Box minHeight="90vh">
      <Outlet />
    </Box>
  );
};

export default Flow;
