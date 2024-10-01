import { ArrowBack } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  title: string;
};

const BackHeader = ({ title }: Props) => {
  const navigate = useNavigate();
  return (
    <Stack
      position="sticky"
      top="0"
      zIndex={10}
      height={55}
      direction="row"
      bgcolor="primary.main"
      p={2}
    >
      <Typography color="white">
        <ArrowBack
          onClick={() => navigate(-1)}
          color="inherit"
          sx={{ marginRight: 1 }}
        />
      </Typography>
      <Typography variant="subtitle1" fontWeight={500} color="white">
        {title}
      </Typography>
    </Stack>
  );
};

export default BackHeader;
