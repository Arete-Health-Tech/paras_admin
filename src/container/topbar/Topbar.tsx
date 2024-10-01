import {
  AppBar,
  Avatar,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useState } from 'react';

interface Props {
  drawerWidth: number;
}

const Topbar = ({ drawerWidth }: Props) => {
  return (
    <Box>
      {/* <AppBar
        position="sticky"
        sx={{
          background: 'white',
          width: '100%',
          p: 1,
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Box
              display="flex"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <MenuOpenIcon fontSize="large" color="success" />
              <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                <InputLabel>Select Facility</InputLabel>
                <Select label="Select Facility">
                  <MenuItem value={10}>Paras Gurugram</MenuItem>
                  <MenuItem value={20}>Paras Delhi</MenuItem>
                  <MenuItem value={30}>Paras Patna</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              display="flex"
              width="100%"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Box marginX={5}>
                <NotificationsNoneIcon color="success" fontSize="large" />
              </Box>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Akhil Bisht" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar> */}
    </Box>
  );
};

export default Topbar;
