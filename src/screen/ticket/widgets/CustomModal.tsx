import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Modal,
  outlinedInputClasses,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField
} from '@mui/material';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  // createNoteActivityHandler,
  createNotesHandler,
  createTimerHandler,
  getTicketHandler
} from '../../../api/ticket/ticketHandler';
import { useNavigate, useParams } from 'react-router-dom';
import { iNote, iTicket, iTimer } from '../../../types/store/ticket';
import { Call } from '@mui/icons-material';
import CallButtonIcon from '../../../assets/Call button variations.svg';
import ClickedCallButtonIcon from '../../../assets/Call button Clicked.svg';
import MaximizeIcon from '../../../assets/maximize-4.svg';
import add_icon from '../../../assets/add_icon.svg';
import CloseModalIcon1 from '../../../assets/Group 48095853.svg';
import '../singleTicket.css';

import useTicketStore from '../../../store/ticketStore';
import LeadDetail from '../SingleTicketSideBar/LeadDetail/LeadDetail';
import ReactQuill from 'react-quill';
import {
  callAgent,
  createPhoneData,
  createSecondOpinion
} from '../../../api/ticket/ticket';
import { toast } from 'react-toastify';
import {
  createTheme,
  ThemeProvider,
  Theme,
  useTheme
} from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: 'red'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0566FF'
          }
        }
      }
    }
  }
});

const CustomModal = () => {
  const label = { inputProps: { 'aria-label': 'Size switch demo' } };
  const [currentTicket, setCurrentTicket] = React.useState<iTicket>();
  const { ticketID } = useParams();
  const {
    tickets,
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    reminders,
    pageNumber,
    searchByName,
    setIsModalOpenCall,
    setAgentLogin,
    setDownloadDisable,
    clearToChangeTicket,
    setClearToChangeTicket
  } = useTicketStore();
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const timerRef = useRef<NodeJS.Timer | null>(null);
  const [stoppedTimer, setStoppedTimer] = useState<number | null>(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [chipOpen, setChipOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [note, setNote] = useState('');
  const [secondOpinion, setSecondOpinion] = useState({
    type: '',
    hospital: '',
    doctor: '',
    additionalInfo: ''
  });

  const [challengeSelected, setChallengeSelected] = useState<string[]>([]);
  // const [ucid, setUCID] = useState('');
  const [formData, setFormData] = useState<iTimer>({
    select: '',
    stoppedTimer: 0
  });

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

  useEffect(() => {
    const fetchTicket = tickets.find((element) => ticketID === element._id);
    if (fetchTicket) {
      setCurrentTicket(fetchTicket);
    }
  }, [ticketID, tickets]);

  useEffect(() => {
    if (currentTicket) {
      setIsVisible(true);
      setSecondOpinion((prev) => ({
        type: currentTicket.opinion[0]?.type || '',
        hospital: currentTicket.opinion[0]?.hospital || '',
        doctor: currentTicket.opinion[0]?.doctor || '',
        additionalInfo: currentTicket.opinion[0]?.additionalInfo || ''
      }));
      setChallengeSelected(currentTicket.opinion[0]?.challengeSelected || null);
      // setIsVisible(true);
    }
  }, [tickets, currentTicket, ticketID]);
  // console.log({currentTicket})
  const startTimer = async () => {
    // const returnedData = await callAgent(currentTicket?.consumer[0]?.phone);
    // // const returnedData = await callAgent(currentTicket?.consumer[0]?.phone)
    // if (returnedData.status == 'Agent is not available') {
    //   toast.error('Agent is not loggedIn');
    //   setAgentLogin(true);
    // } else if (
    //   returnedData.status == 'queued successfully' ||
    //   returnedData.status == 'Customer Number is in DND'
    // ) {
    //   if (timerRef.current !== null) {
    //     clearInterval(timerRef.current);
    //   }
    //   timerRef.current = setInterval(() => {
    //     setTimer((prevTimer) => prevTimer + 1);
    //   }, 1000);
    //   setUCID(returnedData.ucid);
    //   setChipOpen(true);
    //   setDialogOpen(true);
    // } else {
    //   toast.error(returnedData.status);
    //   setAgentLogin(true);
    // }
    setChipOpen(true);
    setDialogOpen(true);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    setShowForm(true);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    setStoppedTimer(timer);
    setShowForm(true);
  };

  useEffect(() => {
    if (showForm && stoppedTimer !== null) {
      setFormData({
        select: '',
        stoppedTimer: stoppedTimer
      });
      // handleFormSubmit();
    }
  }, [showForm]);

  //   const handleFormSubmit = async () => {
  //     setDownloadDisable(true);
  //     console.log(stoppedTimer,"stoppedTimer")
  //     try {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         stoppedTimer: stoppedTimer
  //       }));
  //       const sachin: any = ticketID;

  //       //This function is for handle the time
  //       const result = await createTimerHandler(formData, sachin);

  //       //This if condition is for checking the notes which is inside the calling drawer
  //       if (note !== '<p><br></p>' && note !== '') {
  //         const data: iNote = {
  //           text: note,
  //           ticket: sachin,
  //           // ucid: ucid,
  //           stoppedTimer: timer
  //         };
  //         const notesForActivity = {
  //           ticket: ticketID!,
  //           notes: note
  //         };
  //         await createNotesHandler(data, formData.select);
  //         await createNoteActivityHandler(notesForActivity);
  //         setNote('');
  //       }
  //       // This is for second opinion start
  //       const opinion = {
  //         ...secondOpinion,
  //         challengeSelected,
  //         ticketid: ticketID
  //       };

  //       await createSecondOpinion(opinion);
  //       // This is for second opinion end
  //       // This is for creating phone data recording properly start

  //       const phoneData = {
  //         totalTime: timer,
  //         // ucid: ucid,
  //         ticket: ticketID
  //       };
  //       // await createPhoneData(phoneData);
  //       console.log("111111")
  //       // This is for creating phone data recording properly end

  //       //This if condition is for checking that what disposition we have selected
  //       if (formData.select === 'Rescheduled Call') {
  //         setIsModalOpenCall(true);
  //       }
  //       console.log("222222")
  //       if (
  //         ['Awaiting test results', 'Awaiting TPA approvals', 'Under MM'].some(
  //           (status) => challengeSelected.includes(status)
  //         )
  //       ) {
  //         setIsModalOpenCall(true);
  //       }
  // console.log("333333");

  //       // on submit button click after 1 second the ticket data will call
  //       (async () => {
  //         await getTicketHandler(searchByName, pageNumber, 'false', newFilter);
  //       })();

  //       // Check if result is truthy (not undefined or null)

  //       if (result !== undefined && result !== null) {
  //         setFormData({ select: '' });
  //         setDialogOpen(false);

  //         // Temporary
  //         // handleCloseModal();
  //         // ====

  //         setShowForm(false);
  //         setTimer(0);
  //         setChipOpen(false);
  //         setSecondOpinion({
  //           type: '',
  //           hospital: '',
  //           doctor: '',
  //           additionalInfo: ''
  //         });
  //         setIsVisible(false);
  //         setChallengeSelected([]);
  //       }

  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setDownloadDisable(false);
  //     setClearToChangeTicket(true);
  //   };

  const handleFormSubmit = async () => {
    setDownloadDisable(true);
    try {
      setFormData((prevData) => ({
        ...prevData,
        stoppedTimer: stoppedTimer
      }));
      const sachin: any = ticketID;

      //This function is for handle the time
      const result = await createTimerHandler(formData, sachin);

      //This if condition is for checking the notes which is inside the calling drawer
      if (note !== '<p><br></p>' && note !== '') {
        const data: iNote = {
          text: note,
          ticket: sachin,
          stoppedTimer: stoppedTimer
          // ucid: ucid
        };
        await createNotesHandler(data, formData.select);
        setNote('');
      }
      // This is for second opinion start
      const opinion = {
        ...secondOpinion,
        challengeSelected,
        ticketid: ticketID
      };

      await createSecondOpinion(opinion);

      // on submit button click after 1 second the ticket data will call

      await getTicketHandler(searchByName, pageNumber, 'false', filterTickets);

      // This is for second opinion end
      // This is for creating phone data recording properly start
      // const phoneData = {
      //   totalTime: timer,
      //   // ucid: ucid,
      //   ticket: ticketID
      // }
      // await createPhoneData(phoneData)
      // This is for creating phone data recording properly end

      // Check if result is truthy (not undefined or null)
      if (result !== undefined && result !== null) {
        setFormData({ select: '' });
        setDialogOpen(false);
        setShowForm(false);
        setTimer(0);
        setStoppedTimer(null);
        setChipOpen(false);
        // setSecondOpinion({
        //   type: '',
        //   hospital: '',
        //   doctor: '',
        //   additionalInfo: ''
        // })
        setChallengeSelected([]);
        setClearToChangeTicket(true);
      }

      //This if condition is for checking that what disposition we have selected
      if (formData.select === 'Rescheduled Call') {
        setIsModalOpenCall(true);
      }
      // if (formData.select === "DND" || formData.select === "DNP") {
      //   navigate(NAVIGATE_TO_TICKET);
      // }
      setDownloadDisable(false);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (showForm && stoppedTimer !== null) {
  //     setFormData({
  //       select: '',
  //       stoppedTimer: stoppedTimer
  //     });
  //   }
  // }, [showForm]);

  const handleButtonClick = (buttonName) => {
    setFormData((prevData) => ({
      ...prevData,
      select: buttonName,
      stoppedTimer: stoppedTimer
    }));
  };

  const handleClose = () => {
    // setChipOpen(false);
    setShowForm(false);
    setClearToChangeTicket(true);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    setTimer(0);
    setNote('');
    setFormData({
      select: '',
      stoppedTimer: 0
    });
    setChipOpen(false);
  };

  const isButtonClicked = (buttonName) => formData.select === buttonName;

  const challenges = [
    'Awaiting test results',
    'Awaiting TPA approvals',
    'Bad experience',
    'Under MM',
    'Not happy with Doctor',
    'Financial constraints',
    // 'Estimate Pending',
    'Reschedule Call',
    'Date set for surgery',
    // 'CM Fund',
    // 'Ayushman release',
    // 'Upgrade Offered',
    // 'DNP - Last Call',
    // 'CGHS',
    // 'Discount Offered',
    'No decision yet',
    // 'Number not available',
    // 'Under Chemo',
    'Date not given for surgery',
    'Query with doctor'

  ];
  const handleChallenge = (challenges) => {
    if (challengeSelected?.includes(challenges)) {
      const filteredData = challengeSelected?.filter(
        (challenge) => challenge !== challenges
      );
      setChallengeSelected(filteredData);
    } else {
      setChallengeSelected((prevChallenges) => [challenges]);
    }
  };

  // temporary code

  // const [openModal, setOpenModal] = useState(false);
  // const handleOpenModal = () => {
  //   startTimer();
  //   setOpenModal(true);
  // };
  // const handleCloseModal = () => {
  //   stopTimer();
  //   setOpenModal(false);
  // };
  // useEffect(() => {
  //   setClearToChangeTicket(note !== '' ? false : true);
  // }, [note]);

  return (
    <div>
      {chipOpen == true ? (
        <Stack className="Clicked-call" display="flex" flexDirection="row">
          <span
            className="Clicked-call-icon"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <img src={ClickedCallButtonIcon} alt="" />
          </span>
          <span className="Clicked-call-text">Calling</span>
          <span
            className="maximize-icon"
            onClick={() => {
              setShowForm(true);
              // temporary
              // handleOpenModal();
            }}
          >
            <img src={MaximizeIcon} alt="" />
          </span>
        </Stack>
      ) : (
        <Stack
          className="Callbutton"
          onClick={() => {
            startTimer();
            // temporary
            // handleOpenModal();
          }}
        >
          <img src={CallButtonIcon} alt="" />
        </Stack>
      )}

      {/* <IconButton
        sx={{
          bgcolor: chipOpen ? 'red' : 'green',
          color: 'white'
        }}
        onClick={chipOpen ? stopTimer : startTimer}
      >
        <Call sx={{ fontSize: '1.5rem' }} />
      </IconButton>

      {chipOpen && (
        <Chip
          label={`Timer: ${timer} seconds`}
          // onDelete={stopTimer}
          color="primary"
          variant="filled"
          sx={{
            fontSize: '.7rem' // Adjust the font size as needed
          }}
        />
      )} */}

      <Dialog
        // open={showForm}
        open={false}
        onClose={() => {}}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
      >
        <DialogTitle id="form-dialog-title">Calling Timer </DialogTitle>
        <DialogContent>
          {/* Render your other form fields here */}
          <Button
            variant={isButtonClicked('DND') ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleButtonClick('DND')}
            sx={{ minWidth: '140px', marginRight: '8px' }}
          >
            DND
          </Button>
          <Button
            variant={
              isButtonClicked('Rescheduled Call') ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => handleButtonClick('Rescheduled Call')}
            sx={{ minWidth: '140px', marginRight: '8px' }}
          >
            Rescheduled Call
          </Button>
          <Button
            variant={
              isButtonClicked('Call Completed') ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => handleButtonClick('Call Completed')}
            sx={{ minWidth: '140px' }}
          >
            Call Completed
          </Button>
          <Button
            variant={
              isButtonClicked('DND - No. Blocked') ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => handleButtonClick('DND - No. Blocked')}
            sx={{ minWidth: '140px' }}
          >
           DND - No. Blocked
          </Button>
          
        </DialogContent>
        <DialogActions>
          <Button
            onClick={stopTimer}
            disabled={!formData.select}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Modal
        open={showForm}
        onClose={() => { }}
        style={{ height: '100%' }}
        aria-labelledby="modal-modal-title"
      > */}
      <Drawer
        PaperProps={{ sx: { zIndex: 1000 } }}
        sx={{
          display: { xs: 'none', sm: 'block' },

          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 1100,
            borderTopLeftRadius: '15px',
            borderBottomLeftRadius: '15px'
          }
        }}
        anchor="right"
        open={showForm} //showForm
        // open={openModal} //showForm
        aria-labelledby="modal-modal-title"
      >
        <Box className="Calling-modal-container">
          {/* <Stack className="modal-close" onClick={handleClose}>
            <img src={CloseModalIcon} />
          </Stack> */}
          <Box
            sx={{
              width: '65%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#F6F7F9'
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              display="flex"
              alignItems="center"
              sx={{
                borderBottom: '1px solid #D4DBE5',
                padding: '20px 15px',
                position: 'sticky',
                top: 0
              }}
            >
              <Stack
                className="call-modal-title"
                sx={{ fontSize: '18px !important' }}
              >
                Call with {currentTicket?.consumer[0]?.firstName}{' '}
                {currentTicket?.consumer[0]?.lastName}
              </Stack>
            </Stack>
            <Box className="customModalFirstSection">
              <Stack p={2}>
                <Stack
                  sx={{
                    borderRadius: '1rem',
                    backgroundColor: '#FFF',
                    paddingLeft: 2
                  }}
                  p={1}
                >
                  <Stack
                    className="reminder-modal-title"
                    sx={{ fontSize: '14px !important', fontWeight: 500 }}
                  >
                    Disposition
                  </Stack>
                  <Stack className="calling-btn">
                    {localStorage.getItem('ticketType') !== 'Follow-Up' && (
                      <button
                        className="call-Button"
                        style={{
                          backgroundColor: isButtonClicked('DNP')
                            ? '#DAE8FF'
                            : '#F6F7F9'
                        }}
                        onClick={() => handleButtonClick('DNP')}
                      >
                        DNP
                      </button>
                    )}
                    <button
                      className="call-Button"
                      style={{
                        backgroundColor: isButtonClicked('DND')
                          ? '#DAE8FF'
                          : '#F6F7F9'
                      }}
                      onClick={() => handleButtonClick('DND')}
                    >
                      DND
                    </button>
                    {localStorage.getItem('ticketType') !== 'Follow-Up' && (
                      <button
                        className="call-Button"
                        style={{
                          backgroundColor: isButtonClicked('Rescheduled Call')
                            ? '#DAE8FF'
                            : '#F6F7F9'
                        }}
                        onClick={() => handleButtonClick('Rescheduled Call')}
                      >
                        Reschedule Call
                      </button>
                    )}

                    <button
                      style={{
                        backgroundColor: isButtonClicked('Call Completed')
                          ? '#DAE8FF'
                          : '#F6F7F9'
                      }}
                      onClick={() => handleButtonClick('Call Completed')}
                      className="call-Button"
                    >
                      {' '}
                      Call Complete
                    </button>
                    <button
                      style={{
                        backgroundColor: isButtonClicked('DND - No. Blocked')
                          ? '#DAE8FF'
                          : '#F6F7F9'
                      }}
                      onClick={() => handleButtonClick('DND - No. Blocked')}
                      className="call-Button"
                    >
                      {' '}
                      DND - No. Blocked
                    </button>
                    {/* <button
                      style={{
                        backgroundColor: isButtonClicked('Call Not Connected')
                          ? '#DAE8FF'
                          : '#F6F7F9'
                      }}
                      onClick={() => handleButtonClick('Call Not Connected')}
                      className="call-Button"
                    >
                      {' '}
                      Call Not Connected
                    </button> */}
                  </Stack>
                </Stack>
              </Stack>

              <Stack p={2}>
                <Stack
                  sx={{
                    borderRadius: '1rem',
                    backgroundColor: '#FFF',
                    paddingLeft: 2
                  }}
                  p={1}
                >
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Stack
                      className="reminder-modal-title"
                      sx={{ fontSize: '14px !important', fontWeight: 500 }}
                    >
                      Second Opinion
                    </Stack>
                    <Stack>
                      <Switch
                        {...label}
                        defaultChecked
                        size="small"
                        checked={isVisible}
                        onChange={() => setIsVisible(!isVisible)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#0566FF' // Active color for the thumb
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                            {
                              backgroundColor: '#0566FF' // Active color for the track
                            }
                        }}
                      />
                    </Stack>
                  </Box>
                  {isVisible && (
                    <Stack className="calling-btn">
                      <Box sx={{ width: '100%' }}>
                        <RadioGroup row name="consultationStatus">
                          <FormControlLabel
                            value="considering"
                            control={
                              <Radio
                                checked={
                                  secondOpinion.type ===
                                  'Considering Consultation'
                                }
                                sx={{
                                  // color: '#0566FF', // Default color for the radio
                                  '&.Mui-checked': {
                                    color: '#0566FF' // Active color when checked
                                  }
                                }}
                              />
                            }
                            label="Considering Consultation"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontFamily: '"Outfit", sans-serif', // Target the label inside FormControlLabel
                                color: '#333' // Optional: Add text color
                              }
                            }}
                            onClick={() =>
                              setSecondOpinion((prevState) => ({
                                ...prevState,
                                type: 'Considering Consultation'
                              }))
                            }
                          />
                          <FormControlLabel
                            value="consulted"
                            control={
                              <Radio
                                checked={secondOpinion.type === 'consulted'}
                                sx={{
                                  // color: '#0566FF', // Default color for the radio
                                  '&.Mui-checked': {
                                    color: '#0566FF' // Active color when checked
                                  }
                                }}
                              />
                            }
                            label="Consulted"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontFamily: '"Outfit", sans-serif', // Target the label inside FormControlLabel
                                color: '#333' // Optional: Add text color
                              }
                            }}
                            onClick={() =>
                              setSecondOpinion((prevState) => ({
                                ...prevState,
                                type: 'consulted'
                              }))
                            }
                          />
                          <FormControlLabel
                            value="we are second opinion"
                            control={
                              <Radio
                                checked={
                                  secondOpinion.type === 'we are second opinion'
                                }
                                sx={{
                                  // color: '#0566FF', // Default color for the radio
                                  '&.Mui-checked': {
                                    color: '#0566FF' // Active color when checked
                                  }
                                }}
                              />
                            }
                            label="we are second opinion"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontFamily: '"Outfit", sans-serif', // Target the label inside FormControlLabel
                                color: '#333' // Optional: Add text color
                              }
                            }}
                            onClick={() =>
                              setSecondOpinion((prevState) => ({
                                ...prevState,
                                type: 'we are second opinion'
                              }))
                            }
                          />
                        </RadioGroup>

                        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                          <TextField
                            required
                            label="Hospital"
                            fullWidth
                            // InputLabelProps={{ shrink: true }}
                            size="small"
                            value={secondOpinion.hospital}
                            onChange={(e) =>
                              setSecondOpinion((prevState) => ({
                                ...prevState,
                                hospital: e.target.value
                              }))
                            }
                            // InputLabelProps={{
                            //   style: {
                            //     fontSize: '13px',
                            //     color: 'grey',

                            //     fontFamily: `"Outfit",sans-serif`
                            //   }
                            // }}
                            // InputProps={{
                            //   style: {
                            //     fontSize: '12px',
                            //     padding: '2px 0',

                            //     color: 'var(--Text-Black, #080F1A)',
                            //     fontFamily: `"Outfit",sans-serif`
                            //   }
                            // }}
                            // sx={{
                            //   color: '#0566FF',
                            //   '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                            //     {
                            //       borderColor: '#0566FF'
                            //     }
                            // }}
                          />

                          <TextField
                            required
                            label="Doctor Name"
                            fullWidth
                            // InputLabelProps={{ shrink: true }}
                            size="small"
                            value={secondOpinion.doctor}
                            onChange={(e) =>
                              setSecondOpinion((prevState) => ({
                                ...prevState,
                                doctor: e.target.value
                              }))
                            }
                            // InputLabelProps={{
                            //   style: {
                            //     fontSize: '13px',
                            //     color: 'grey',

                            //     fontFamily: `"Outfit",sans-serif`
                            //   }
                            // }}
                            // InputProps={{
                            //   style: {
                            //     padding: '2px 0',
                            //     fontSize: '12px',
                            //     color: 'var(--Text-Black, #080F1A)',
                            //     fontFamily: `"Outfit",sans-serif`
                            //   }
                            // }}
                            // sx={{
                            //   color: '#0566FF',
                            //   '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                            //     {
                            //       borderColor: '#0566FF'
                            //     }
                            // }}
                          />
                        </Box>

                        <Box sx={{ marginTop: 2 }}>
                          <TextField
                            multiline
                            rows={6}
                            label="Additional Information"
                            fullWidth
                            // InputLabelProps={{ shrink: true }}
                            size="small"
                            value={secondOpinion.additionalInfo}
                            onChange={(e) =>
                              setSecondOpinion((prevState) => ({
                                ...prevState,
                                additionalInfo: e.target.value
                              }))
                            }
                            // InputLabelProps={{
                            //   style: {
                            //     fontSize: '13px',
                            //     color: 'grey',

                            //     fontFamily: `"Outfit",sans-serif`
                            //   }
                            // }}
                            // InputProps={{
                            //   style: {
                            //     padding: '2px 0',
                            //     fontSize: '12px',
                            //     color: 'var(--Text-Black, #080F1A)',
                            //     fontFamily: `"Outfit",sans-serif`
                            //   }
                            // }}
                            // sx={{
                            //   color: '#0566FF',
                            //   '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                            //     {
                            //       borderColor: '#0566FF'
                            //     }
                            // }}
                          />
                        </Box>
                      </Box>
                    </Stack>
                  )}
                </Stack>
              </Stack>

              <Stack p={2}>
                <Stack
                  sx={{
                    borderRadius: '1rem',
                    backgroundColor: '#FFF',
                    paddingLeft: 2
                  }}
                  p={1}
                >
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Stack
                      className="reminder-modal-title"
                      sx={{ fontSize: '14px !important', fontWeight: 500 }}
                    >
                      Conversion challenges
                    </Stack>
                  </Box>
                  <Stack className="calling-btn">
                    <Box width={'100%'}>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {challenges.map((challenge, index) => (
                          <Chip
                            key={index}
                            label={challenge}
                            onDelete={() => handleChallenge(challenge)}
                            deleteIcon={
                              challengeSelected &&
                              challengeSelected?.includes(challenge) ? (
                                <div
                                  style={{
                                    backgroundColor: 'white',
                                    padding: '5px',
                                    borderRadius: '50%'
                                  }}
                                >
                                  <img src={CloseModalIcon1} alt="" />
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: 'white',
                                    padding: '5px',
                                    borderRadius: '50%'
                                  }}
                                >
                                  <img src={add_icon} alt="" />
                                </div>
                              )
                            }
                            style={{
                              backgroundColor:
                                challengeSelected &&
                                challengeSelected.includes(challenge)
                                  ? '#DAE8FF'
                                  : '#F6F7F9',
                              fontSize: '0.875rem',
                              color: '#000',
                              fontFamily: 'Outfit,san-serif',
                              fontWeight: 400
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>

              <Stack p={2}>
                <Stack
                  sx={{
                    borderRadius: '1rem',
                    backgroundColor: '#FFF',
                    paddingLeft: 2
                  }}
                  p={1}
                >
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Stack
                      className="reminder-modal-title"
                      sx={{ fontSize: '14px !important', fontWeight: 500 }}
                    >
                      Add Notes
                    </Stack>
                  </Box>
                  <Stack className="Note_section">
                    <ReactQuill
                      theme="snow"
                      value={note}
                      onChange={(content) => {
                        setNote(content);
                      }}
                      // className='noteBox'
                      style={{ height: '20vh', width: '100%' }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Box>
            <Box className="submit-call-response">
              <Stack className="Timer">{timer}</Stack>
              <Stack
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                gap={'10px'}
              >
                <button
                  className="reminder-cancel-btn"
                  onClick={() => {
                    // setShowForm(false);
                    handleClose();
                    // temporary
                    // handleCloseModal();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="submit-call-Btn"
                  onClick={handleFormSubmit}
                  disabled={!formData.select}
                  style={{
                    backgroundColor: !formData.select ? '#F6F7F9' : '#0566FF',
                    color: !formData.select ? '#647491' : '#FFF'
                  }}
                >
                  Submit
                </button>
              </Stack>
            </Box>
          </Box>
          <Box
            width="35%"
            sx={{
              borderLeft: '1px solid #D4DBE5',
              padding: ' var(--24px, 15px) 0 var(--24px, 15px) 0'
            }}
          >
            <LeadDetail isLeadDetail={false} />
          </Box>
        </Box>
      </Drawer>

      {/* </Modal> */}
    </div>
  );
};

export default CustomModal;
