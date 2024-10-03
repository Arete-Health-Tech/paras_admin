import {
  Search,
  PersonAddOutlined,
  HomeOutlined,
  QuestionAnswerOutlined,
  Style
} from '@mui/icons-material';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper
} from '@mui/material';
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from './../../assets/Home.svg';
import HomeIconActive from './../../assets/HomeActive.svg';
import RxIcon from './../../assets/RxIcon.svg';
import RxIconActive from './../../assets/RxIconActive.svg';
import SearchIcon from './../../assets/SearchIcon.svg';
import SearchIconActive from './../../assets/SearchIconActive.svg';
import { consumers } from 'stream';
import Styles from './SupportTabs.module.css';
type Props = {};

const SupportTabs = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Outlet />
      {location.pathname.includes('consumer') ||
        location.pathname.includes('register') ||
        (location.pathname.includes('/') && (
          <Paper
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 5,
              // paddingTop: "10px 14px",
              height: '10vh',
              borderTop: '1px solid #D4DBE5'
            }}
          >
            <BottomNavigation
              value={value}
              onChange={handleChange}
              style={{
                position: 'absolute',
                bottom: 10,
                width: '100vw',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                fontFamily: 'Outfit,sans-serif'
              }}
            >
              <Box className={Styles.tabs_layout}>
                <BottomNavigationAction
                  onClick={() => navigate('/')}
                  // label="Home"
                  value="home"
                  icon={
                    location.pathname === '/' ? (
                      <img src={HomeIconActive} />
                    ) : (
                      <img src={HomeIcon} />
                    )
                  }
                  sx={{
                    color: location.pathname === '/' ? '#0566FF' : 'inherit',
                    '& .Mui-selected': {
                      color: location.pathname === '/' ? '#0566FF' : 'inherit'
                    }
                  }}
                />
                <Box
                  sx={{
                    color: location.pathname === '/' ? '#0566FF' : '#647491',
                    fontSize: location.pathname === '/' ? '16px' : '12px'
                  }}
                >
                  Home
                </Box>
              </Box>
              <Box className={Styles.tabs_layout}>
                <BottomNavigationAction
                  onClick={() => navigate('/register')}
                  // label="Create Rx"
                  value="register"
                  icon={
                    location.pathname.includes('register') ? (
                      <img src={RxIconActive} />
                    ) : (
                      <img src={RxIcon} />
                    )
                  }
                  sx={{
                    color:
                      location.pathname === '/register' ? '#0566FF' : 'inherit',
                    '& .Mui-selected': {
                      color:
                        location.pathname === '/register'
                          ? '#0566FF'
                          : 'inherit'
                    }
                  }}
                />
                <Box
                  sx={{
                    color:
                      location.pathname === '/register' ? '#0566FF' : '#647491',
                    fontSize:
                      location.pathname === '/register' ? '16px' : '12px'
                  }}
                >
                  Create Rx
                </Box>
              </Box>
              <Box className={Styles.tabs_layout}>
                <BottomNavigationAction
                  onClick={() => navigate('/search')}
                  // label="Search"
                  value="search"
                  icon={
                    location.pathname.includes('/search') ? (
                      <img src={SearchIconActive} />
                    ) : (
                      <img src={SearchIcon} />
                    )
                  }
                  sx={{
                    color:
                      location.pathname === '/search' ? '#0566FF' : 'inherit',
                    '& .Mui-selected': {
                      color:
                        location.pathname === '/search' ? '#0566FF' : 'inherit'
                    }
                  }}
                />
                <Box
                  sx={{
                    color:
                      location.pathname === '/search' ? '#0566FF' : '#647491',
                    fontSize: location.pathname === '/search' ? '16px' : '12px'
                  }}
                >
                  Search
                </Box>
              </Box>
              {/* <BottomNavigationAction
            onClick={() => navigate('/query')}
            label="Query"
            value="query"
            icon={<QuestionAnswerOutlined />}
          /> */}
            </BottomNavigation>
          </Paper>
        ))}
    </Box>
  );
};

export default SupportTabs;
