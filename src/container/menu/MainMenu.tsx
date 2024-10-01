import {
  Apartment,
  ConfirmationNumber,
  LocalHospital
} from '@mui/icons-material';
import {
  Drawer,
  ListItemIcon,
  MenuItem,
  MenuList,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

const MainMenu = (props: Props) => {

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth
      }}
    >
      <MenuList>
        {[
          {
            name: 'Department',
            icon: <Apartment />,
            link: '/department'
          },
          {
            name: 'Doctor',
            icon: <LocalHospital />,
            link: '/department/doctor'
          },
          { name: 'Ticket', icon: <ConfirmationNumber />, link: '/ticket' }
        ].map((item) => {
          return (
            <Link to={item.link}>
              <MenuItem>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <Typography>{item.name}</Typography>
              </MenuItem>
            </Link>
          );
        })}
      </MenuList>
    </Drawer>
  );
};

export default MainMenu;
