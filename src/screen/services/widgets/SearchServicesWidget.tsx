import { Close, CopyAllOutlined, Search } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Tooltip,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { iService } from '../../../types/store/service';
import { searchService } from '../../../api/service/service';
import useCopyToClipboard from '../../../hooks/useCopyToClipboard';

type Props = {};

const SearchServicesWidget = (props: Props) => {
  const [search, setSearch] = useState('');
  const [isSnackBarOpen, setIsSnackBarOpen] = React.useState(false);
  const [services, setServices] = useState<iService[]>();
  const [value, copy] = useCopyToClipboard();

  const handleClick = () => {
    setIsSnackBarOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsSnackBarOpen(false);
  };

  useEffect(() => {
    (async function () {
      if (search.length >= 3) {
        await searchServiceHandler();
      }
    })();
  }, [search]);

  const searchServiceHandler = async () => {
    const res = await searchService(search);
    setServices(res);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box position="relative">
      <Box>
        <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Search Service
          </InputLabel>
          <OutlinedInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="outlined-adornment-password"
            endAdornment={
              <InputAdornment position="end">
                <Stack direction="row" spacing={1}>
                  {search.length > 0 && (
                    <IconButton edge="end" onClick={() => setSearch('')}>
                      <Close />
                    </IconButton>
                  )}

                  <IconButton edge="end" onClick={searchServiceHandler}>
                    <Search />
                  </IconButton>
                </Stack>
              </InputAdornment>
            }
            label="Search Services"
          />
        </FormControl>
      </Box>
      {search.length > 0 && (
        <Box
          sx={{
            overflowY: 'scroll',
            '&::-webkit-scrollbar ': {
              display: 'none'
            }
          }}
          zIndex={3}
          bgcolor="white"
          width="51ch"
          position="absolute"
          maxHeight={'40vh'}
          right={0}
          p={1}
          border={0.3}
          borderColor="lightgray"
        >
          {services
            ? services.length > 0
              ? services.map((service, index) => (
                  <Stack
                    bgcolor={index % 2 === 0 ? '#f9f5f7' : 'white'}
                    key={service._id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body1" textTransform="capitalize">
                      {service.name}
                    </Typography>
                    <Tooltip title="Copy Id">
                      <IconButton
                        onClick={() => {
                          copy(service._id!);
                          handleClick();
                        }}
                      >
                        <CopyAllOutlined />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))
              : 'No result Found'
            : 'Loading...'}
        </Box>
      )}
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Service Object Id Copied"
        action={action}
      />
    </Box>
  );
};

export default SearchServicesWidget;
