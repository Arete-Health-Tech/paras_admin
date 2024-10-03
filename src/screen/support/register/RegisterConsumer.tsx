import { PersonAddAlt1Outlined } from '@mui/icons-material';
import {
  Box,
  Stack,
  TextField,
  Button,
  FormHelperText,
  Typography,
  Avatar,
  ThemeProvider,
  Theme,
  createTheme,
  outlinedInputClasses,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { AnyAaaaRecord } from 'dns';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, apiClient } from '../../../api/apiClient';
import { getConsumerByUhid } from '../../../api/consumer/consumer';
import {
  getConsumerTicketsHandler,
  registerConsumerHandler
} from '../../../api/consumer/consumerHandler';
import useEventStore from '../../../store/eventStore';
import { database } from '../../../utils/firebase';
import { toast, ToastContainer } from 'react-toastify';
import Styles from './RegisterConsumer.module.css';
import UserAddIcon from '../../../assets/user-add.svg';
import BackArrow from '../../../assets/arrow-leftBlue.svg';
import InfoIcon from '../../../assets/Info.svg';
import useConsumerStore from '../../../store/consumerStore';
import SearchIconActive from '../../../assets/SearchIconActive.svg';

const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#D4DBE5',
            '--TextField-brandBorderHoverColor': '#B2BAC2',
            '--TextField-brandBorderFocusedColor': '#0566FF',
            fontSize: '12px',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'none',
            fontSize: '14px'
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)'
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: 'none'
            },
            '&::after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)'
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)'
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: 'none',
              fontSize: '14px'
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)'
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      }
    }
  });

const fieldCss = {
  style: {
    fontSize: '14px',
    color: 'rgba(128, 128, 128, 0.744)',
    fontFamily: `"Outfit",sans-serif`
  }
};
const fieldInputCss = {
  style: {
    fontSize: '14px',
    color: '#080F1A',
    fontFamily: `"Outfit",sans-serif`
  }
};

const materilaFieldCss = {
  fontSize: '14px',
  color: 'rgba(128, 128, 128, 0.744)',
  fontFamily: `"Outfit",sans-serif`
};
const materilaInputFieldCss = {
  fontSize: '14px',
  color: '#080F1A',
  fontFamily: `"Outfit",sans-serif`
};

const RegisterConsumer = () => {
  const outerTheme = useTheme();
  const initialConsumerFields = {
    firstName: '',
    lastName: '',
    email: null,
    phone: '',
    uid: '',
    age: '',
    gender: ''
  };

  const defaultValidations = { message: '', value: false };

  const initialValidationsFields = {
    firstName: defaultValidations,
    lastName: defaultValidations,
    email: defaultValidations,
    phone: defaultValidations,
    uid: defaultValidations,
    age: defaultValidations,
    gender: defaultValidations
  };
  const [consumer, setConsumer] = useState(initialConsumerFields);
  const [consumerId, setConsumerId] = useState('');
  const [validations, setValidations] = useState(initialValidationsFields);
  const [existingData, setExistingData] = useState(false);
  const { setSnacks } = useEventStore();
  const { setRegisterUhid } = useConsumerStore();
  const navigate = useNavigate();
  let existingBIData = false;

  sessionStorage.removeItem('consumerData');

  const validationsChecker = () => {
    const firstNameValid = consumer.firstName.trim() !== '';
    const phoneValid = consumer.phone.length === 10;
    // const uidValid = /^[a-zA-Z0-9]$/.test(consumer.uid.trim());
    const uidValid = /^[a-zA-Z0-9]+$/.test(consumer.uid.trim());

    setValidations((prev) => ({
      ...prev,
      firstName: firstNameValid
        ? defaultValidations
        : { message: 'Please enter correct first name', value: true },
      phone: phoneValid
        ? defaultValidations
        : { message: 'Please enter correct phone number', value: true },
      uid: uidValid
        ? defaultValidations
        : { message: 'Please enter correct UHID', value: true }
    }));

    return firstNameValid && phoneValid && uidValid;
  };

  const updateConsumerState = (field: string, value: any) => {
    setConsumer((prev: any) => {
      prev[field] = value;
      return { ...prev };
    });
  };

  // const updateConsumerId = (field: string, value: any) => {
  //   setConsumerId((prev: any) => {
  //     prev[field] = value;
  //     return { ...prev, consumer };
  //   });
  // };

  const registerConsumer = async () => {
    const check = validationsChecker();
    const isValid = validationsChecker();
    if (!isValid) {
      setSnacks('Please fill in all required fields correctly!', 'error');
      return; // Exit early if validations fail
    }
    if (check === true) {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - +consumer.age);

      // const email = consumer.email
      //   ? consumer.email.match(
      //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      //     ) === null
      //   : true;
      const consumerPayload: any = consumer;

      // consumerPayload.email = email ? null : consumer.email;

      consumerPayload.lastName = consumer.lastName ? consumer.lastName : null;

      consumerPayload.gender = consumer.gender ? consumer.gender : null;

      consumerPayload.dob = consumer.age ? dob : null;

      const data = await registerConsumerHandler(consumerPayload);
      if (data) {
        setConsumerId(data._id);
        setExistingData(true);
      } else {
        setConsumerId('');
      }
      setConsumer({ ...initialConsumerFields });

      setSnacks('Patient Registered Successfully!', 'success');
      console.log(data.uid, 'uid');
      setRegisterUhid(data.uid);
      navigate(`/consumer/${data._id}`);
    }
    // if (check === true) {
    //   const dob = new Date();
    //   dob.setFullYear(dob.getFullYear() - +consumer.age);
    //   // const email = consumer.email
    //   //   ? consumer.email.match(
    //   //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //   //     ) === null
    //   //   : true;
    //   const consumerPayload: any = consumer;
    //   // consumerPayload.email = email ? null : consumer.email;
    //   consumerPayload.lastName = consumer.lastName ? consumer.lastName : null;
    //   consumerPayload.gender = consumer.gender ? consumer.gender : null;
    //   consumerPayload.dob = consumer.age ? dob : null;
    //   await registerConsumerHandler(consumerPayload);
    //   setConsumer({ ...initialConsumerFields });
    //   setSnacks('Patient Registered Successfully!', 'success');
    //   navigate('/');
    // }
  };

  const nextConsumer = () => {
    navigate(`/consumer/${consumerId}`);
  };

  const calculateAge = (dob) => {
    console.log(dob, 'dob');
    if (!dob) {
      return '';
    }

    const birthDate = new Date(dob);

    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid date format');
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const fetchConsumerDataByUhid = async () => {
    // try {
    //   const response = await apiClient.get('/consumer/UhidData?', {
    //     params: { search: consumer.uid }
    //   });
    //   if (response.data) {
    //     updateConsumerState(
    //       'firstName',
    //       response.data[0].PatientName.split(' ')[0]
    //     );
    //     updateConsumerState(
    //       'lastName',
    //       response.data[0].PatientName.split(' ')[1]
    //     );
    //     let mobile;
    //     if (response.data[0].MobileNo.startsWith('0')) {
    //       mobile = response.data[0].MobileNo.substring(1);
    //       updateConsumerState('phone', mobile);
    //     } else {
    //       updateConsumerState('phone', response.data[0].MobileNo);
    //     }

    //     updateConsumerState('age', calculateAge(response.data[0].DOB));
    //     updateConsumerState(
    //       'gender',
    //       response.data[0].Gender === 'Female'
    //         ? 'F'
    //         : response.data[0].Gender === 'Male'
    //         ? 'M'
    //         : 'O'
    //     );
    //     setConsumerId(response.data[0].PatientId);
    //     // existingBIData = true;
    //     setExistingData(true);
    //   }
    // } catch (error) {
    //   console.log('gfggf');
    //   toast.error('Data not found');
    // }

    try {
      const response = await apiClient.get('/consumer/findConsumer?', {
        params: { search: consumer.uid }
      });
      if (response.status == 200) {
        updateConsumerState('firstName', response.data.firstName);
        updateConsumerState('lastName', response.data.lastName);
        const phoneWithoutCountryCode = response.data.phone.replace(/^91/, '');
        updateConsumerState('phone', phoneWithoutCountryCode);
        // updateConsumerState('phone', response.data.phone);
        updateConsumerState('age', calculateAge(response.data.dob));
        updateConsumerState('gender', response.data.gender);
        setConsumerId(response.data._id);
        if (response.data._id) {
          await getConsumerTicketsHandler(response.data._id);
        }
        setExistingData(true);
      }
    } catch (error) {
      if (!existingBIData) {
        updateConsumerState('firstName', '');
        updateConsumerState('lastName', '');
        updateConsumerState('phone', '');
        updateConsumerState('age', '');
        updateConsumerState('gender', '');
        setConsumerId('');
        toast.error('No Patient is Register in this UHID');
        setExistingData(false);
      }
    }
  };

  useEffect(() => {
    updateConsumerState('firstName', '');
    updateConsumerState('lastName', '');
    updateConsumerState('phone', '');
    updateConsumerState('age', '');
    updateConsumerState('gender', '');
    setConsumerId('');
    setExistingData(false);
  }, [consumer.uid]);

  return (
    <Box>
      {/* <BackHeader title="Register" /> */}
      {/* <Stack
        direction="row"
        spacing={2}
        borderRadius="0rem 0rem 1rem 1rem"
        p={1}
        bgcolor="primary.main"
        height={'15vh'}
        mb={2}
      >
        <Avatar>
          <PersonAddAlt1Outlined />
        </Avatar>
        <Stack>
          <Typography color="white" variant="h6">
            Patient Registration
          </Typography>
          <Typography variant="body2" color="lightgray" sx={{ pb: 2 }}>
            Register Patient here for further tasks on the registered patient
          </Typography>
        </Stack>
      </Stack> */}

      <Stack className={Styles.consumer_title}>
        <Stack
          className={Styles.back_arrow}
          onClick={() => {
            navigate('/');
          }}
        >
          <img src={BackArrow} alt="back" />
        </Stack>
        <Stack display={'flex'} flexDirection={'row'} gap={'16px'}>
          <Stack className={Styles.title_Icon}>
            <img src={UserAddIcon} alt="AddIcon" />
          </Stack>
          <Stack className={Styles.title_Content}>Patient Registration</Stack>
        </Stack>
      </Stack>

      <Box
        height="80%"
        p={2}
        display="flex"
        gap="24px"
        flexDirection="column"
        sx={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 190px)'
        }}
      >
        <Stack className={Styles.consumer_info}>
          <Stack className={Styles.consumer_info_icon}>
            <img src={InfoIcon} />
          </Stack>
          <Stack className={Styles.consumer_info_content}>
            Register patient here for further tasks on the registered patient
          </Stack>
        </Stack>
        {/* <TextField>{uhidData}</TextField> */}
        <Stack display={'flex'} flexDirection={'column'} gap={'24px'}>
          <Stack
            display={'flex'}
            flexDirection={'row'}
            gap={'6px'}
            width={'100%'}
          >
            <Stack width={'100%'}>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  value={consumer.uid}
                  onChange={(e) => updateConsumerState('uid', e.target.value)}
                  // fullWidth
                  size="medium"
                  type="text"
                  placeholder="33XXX"
                  label="UHID"
                  // onBlur={fetchConsumerDataByUhid}
                  error={validations.uid.value}
                  helperText={validations.uid.message}
                  InputLabelProps={fieldCss}
                  InputProps={{
                    ...fieldInputCss,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={fetchConsumerDataByUhid}>
                          <img src={SearchIconActive} alt="search" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  // inputProps={{ maxLength: 13, pattern: "\\d{0,12}" }}
                  // disabled={existingBIData ? false : true}
                />
              </ThemeProvider>
            </Stack>
          </Stack>

          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              value={consumer.firstName}
              onChange={(e) => updateConsumerState('firstName', e.target.value)}
              fullWidth
              size="medium"
              type="text"
              placeholder="Jhon"
              label="First Name"
              error={validations.firstName.value}
              helperText={validations.firstName.message}
              disabled={existingData ? true : false}
              InputLabelProps={fieldCss}
              InputProps={fieldInputCss}
            />
          </ThemeProvider>

          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              value={consumer.lastName}
              onChange={(e) => updateConsumerState('lastName', e.target.value)}
              fullWidth
              size="medium"
              type="text"
              placeholder="Doe"
              label="Last Name (optional)"
              error={validations.lastName.value}
              // disabled={consumer.uid ? false : true}
              helperText={validations.lastName.message}
              disabled={existingData ? true : false}
              InputLabelProps={fieldCss}
              InputProps={fieldInputCss}
            />
          </ThemeProvider>
          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              value={consumer.phone}
              onChange={(e) => updateConsumerState('phone', e.target.value)}
              fullWidth
              type="tel"
              size="medium"
              placeholder="8979XXXXXX"
              label="Phone Number"
              error={validations.phone.value}
              // disabled={consumer.uid ? false : true}
              helperText={validations.phone.message}
              disabled={existingData ? true : false}
              InputLabelProps={fieldCss}
              InputProps={fieldInputCss}
            />
          </ThemeProvider>

          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              value={consumer.age}
              onChange={(e) => updateConsumerState('age', e.target.value)}
              fullWidth
              size="medium"
              type="number"
              placeholder="32"
              label="Age  (optional)"
              error={validations.age.value}
              // disabled={consumer.uid ? false : true}
              helperText={validations.age.message}
              disabled={existingData ? true : false}
              InputLabelProps={fieldCss}
              InputProps={fieldInputCss}
            />
          </ThemeProvider>
          {/* <Box>
            <Typography sx={{ my: 1 }} color="CaptionText">
              Gender (optional)
            </Typography>
            <Stack flexDirection="row" alignItems="center">
              {[
                { label: 'Male', value: 'M' },
                { label: 'Female', value: 'F' },
                { label: 'Other', value: 'O' }
              ].map((item) => {
                return (
                  <Button
                    size="medium"
                    sx={{ mr: 1 }}
                    variant={
                      item.value === consumer.gender ? 'contained' : 'outlined'
                    }
                    // disabled={consumer.uid ? false : true}
                    onClick={() => updateConsumerState('gender', item.value)}
                    disabled={existingData ? true : false}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
            <FormHelperText error={validations.gender.value}>
              {validations.gender.message}
            </FormHelperText>
          </Box> */}

          <FormControl fullWidth size="medium">
            <InputLabel id="Gender" sx={materilaFieldCss}>
              Gender
            </InputLabel>
            <Select
              labelId="Gender"
              id="Gender"
              value={consumer.gender}
              label="Gender"
              sx={{
                ...materilaInputFieldCss,
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0566ff'
                }
              }}
              onChange={(event) =>
                updateConsumerState('gender', event.target.value)
              }
              disabled={existingData ? true : false}
            >
              <MenuItem value={'M'} sx={materilaInputFieldCss}>
                Male
              </MenuItem>
              <MenuItem value={'F'} sx={materilaInputFieldCss}>
                Female
              </MenuItem>
              <MenuItem value={'O'} sx={materilaInputFieldCss}>
                Other
              </MenuItem>
              <MenuItem value={''} sx={materilaInputFieldCss}>
                Clear
              </MenuItem>
            </Select>
          </FormControl>

          {/* {existingData ? (
          <Button size="large" onClick={nextConsumer} variant="contained">
            Next
          </Button>
        ) : (
          <Button size="large" onClick={registerConsumer} variant="contained">
            Next
          </Button>
        )} */}
        </Stack>
         
      </Box>
      <Box px={2} className={Styles.Next_btn_layout}>
        <Stack
          className={Styles.Next_btn}
          onClick={existingData ? nextConsumer : registerConsumer}
        >
          Next
        </Stack>
      </Box>
    </Box>
  );
};

export default RegisterConsumer;
