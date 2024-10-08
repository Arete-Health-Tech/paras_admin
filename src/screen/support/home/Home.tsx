import { Forum, PersonAdd } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Modal,
  Tab,
  Tabs,
  Typography,
  Badge,
  InputAdornment
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../../store/userStore';
import Logout from '../../login/Logout';
import register from '../../../assets/images/addPatient.png';
import Styles from './Home.module.css';
import SearchIcon from '@mui/icons-material/Search';
import UserAddIcon from '../../../assets/user-add.svg';
import ArrowDownIcon from '../../../assets/ArrowDown.svg';
import CalenderIcon from '../../../assets/calendar.svg';
import CloseModalIcon from '../../../assets/Group 48095853.svg';
import DocumentDownload from '../../../assets/document-download.svg';
import SearchDefault from '../../../assets/Amico Medical Prescription (1) 1.svg';
import { useEffect, useRef, useState } from 'react';
import { iTicket } from '../../../types/store/ticket';
import { apiClient } from '../../../api/apiClient';
import { getRepresntativesHandler } from '../../../api/representive/representativeHandler';
import FileSaver from 'file-saver';
import useReprentativeStore from '../../../store/representative';
import useConsumerStore from '../../../store/consumerStore';
import useServiceStore from '../../../store/serviceStore';
import { getDepartmentsHandler } from '../../../api/department/departmentHandler';
import { getDoctorsHandler } from '../../../api/doctor/doctorHandler';
import { AxiosError } from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px'
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const inputStyles = {
  backgroundColor: 'white',
  width: '100%',
  borderRadius: '5px',
  outline: 'none',
  padding: '12px'
};

const Home = () => {
  const { doctors, departments } = useServiceStore();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isSelectDate, setIsSelectDate] = useState(false);
  const [isFilterApply, setIsFilterApply] = useState(false);
  const [dateRange, setDateRange] = useState<string[]>(['', '']);
  const dateRef = useRef<HTMLDivElement | null>(null);
  const [historyTicket, setHistoryTicket] = useState<iTicket[]>([]);
  const [dateArray, setDateArray] = useState<string[]>([]);
  const { representative } = useReprentativeStore();
  const { consumerHistory } = useConsumerStore();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [value, setValue] = useState(0);
  const handleClose = () => setOpen(false);
  const consumerId = user?._id;

  const handleClickOutside = (event: MouseEvent) => {
    const isClickOutsideDate =
      dateRef.current && !dateRef.current.contains(event.target as Node);
    if (isClickOutsideDate) {
      setIsSelectDate(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetching Doctors and Department..........
  useEffect(() => {
    (async function () {
      await getDepartmentsHandler();
      await getDoctorsHandler();
    })();
  }, []);
  const fetchDoctorName = (id: any) => {
    if (!id) return 'Unknown Doctor';
    const specificDoctor = doctors?.find((doc) => doc._id === id);
    let doctorName = (specificDoctor?.name ?? 'Unknown Doctor')
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const titleIndex = doctorName.indexOf('Dr.');
    if (titleIndex !== -1 && titleIndex + 3 < doctorName.length) {
      const title = doctorName.slice(0, titleIndex + 3);
      const name = doctorName.slice(titleIndex + 3);
      doctorName = `${title} ${name}`;
    }

    return doctorName;
  };

  const fetchDepartmentName = (id: any) => {
    if (!id) return 'Unknown Department';
    const specificDepartment = departments?.find((dep) => dep._id === id);
    let departmentName = (specificDepartment?.name ?? 'Unknown Department')
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return departmentName;
  };

  // ..............................

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;

    setDateRange([startDate, dateRange[1]]);
    if (dateRange[1]) {
      setIsSelectDate(false);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value;
    console.log(endDate, 'bdjhdb');
    setDateRange([dateRange[0], endDate]);

    setIsSelectDate(false);
  };

  const fetchHistoryTickets = async () => {
    setHistoryTicket([]);
    setFilteredTickets([]);
    setDateArray([]);
    setSearch('');

    if (dateRange[0] && dateRange[1]) {
      try {
        setIsFilterApply(true);
        setHistoryTicket([]);
        setDateArray(getDateRange(dateRange[0], dateRange[1]));
        const endDate = dateRange[1];
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const newEndDate = endDateObj.toISOString().split('T')[0];

        const requestData = {
          startDate: `${dateRange[0]}`,
          endDate: `${newEndDate}`,
          creatorId: `${consumerId}`
        };

        const { data } = await apiClient.get(
          `/consumer/getTicketsWithCreator`,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            params: requestData
          }
        );

        setHistoryTicket(data);
      } catch (error) {
        console.error('Error fetching history tickets:');
      }
    }
  };

  useEffect(() => {
    fetchHistoryTickets();
  }, [dateRange[0], dateRange[1]]);

  sessionStorage.removeItem('consumerData');

  const getDateRange = (startDate: string, endDate: string): string[] => {
    const dateArray: string[] = [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      const day = String(dt.getDate()).padStart(2, '0');
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const year = dt.getFullYear();
      dateArray.push(`${day}-${month}-${year}`);
    }

    return dateArray;
  };

  const [clickDate, setClickDate] = useState<string | null>(null);

  const handleDateClick = (date: string) => {
    const newClickDate = clickDate === date ? null : date;
    setClickDate(newClickDate);
    // filterTicketsByDate(date);
  };
  const [filteredTickets, setFilteredTickets] = useState<iTicket[]>([]);

  const convertDateFormat = (date: string) => {
    const parts = date.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // Converts DD-MM-YYYY to YYYY-MM-DD
    }
    return null; // Return null or handle as needed if the format is unexpected
  };

  const filterTicketsByDate = (date: string) => {
    const formattedInputDate = convertDateFormat(date);
    if (!formattedInputDate) {
      console.error('Invalid date format provided:', date);
      return;
    }

    const dateObj = new Date(formattedInputDate);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided:', formattedInputDate);
      return;
    }

    const formattedDate = dateObj.toISOString().split('T')[0];
    // console.log(historyTicket, 'history Ticket');
    const filtered = historyTicket.filter((ticket) => {
      const ticketDate = new Date(ticket.date);
      // console.log(formattedDate, 'formattedDate');
      // console.log(
      //   ticketDate.toISOString().split('T')[0],
      //   "ticketDate.toISOString().split('T')[0]"
      // );
      return (
        !isNaN(ticketDate.getTime()) &&
        ticketDate.toISOString().split('T')[0] === formattedDate
      );
    });
    // console.log(filtered, 'filtered');
    setFilteredTickets(filtered);
  };

  const filterTicketsCountByDate = (date: string) => {
    const formattedInputDate = convertDateFormat(date);
    if (!formattedInputDate) {
      console.error('Invalid date format provided:', date);
      return;
    }

    const dateObj = new Date(formattedInputDate);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided:', formattedInputDate);
      return;
    }

    const formattedDate = dateObj.toISOString().split('T')[0];
    const filtered = historyTicket.filter((ticket) => {
      const ticketDate = new Date(ticket.date);
      return (
        !isNaN(ticketDate.getTime()) &&
        ticketDate.toISOString().split('T')[0] === formattedDate
      );
    });
    return filtered.length;
  };

  useEffect(() => {
    if (clickDate) {
      filterTicketsByDate(clickDate);
    }
  }, [clickDate]);

  // History Functions

  const handleOpen = (image, image1) => {
    console.log(image);
    console.log(image1);
    setSelectedImage(image);
    setSelectedImage1(image1);
    setOpen(true);
  };

  function formatDate(dateStr) {
    const [day, month, year] = dateStr.split('/');

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    return `${day} ${months[month - 1]} ${year}`;
  }

  useEffect(() => {
    (async () => {
      try {
        await getRepresntativesHandler();
      } catch (error) {
        console.error('Error fetching representatives:', error);
      }
    })();
  }, []);

  const downloadPrescription = (image) => {
    FileSaver.saveAs(image, 'prescription_img.jpg');
    // FileSaver.saveAs(image1, 'prescription_img.jpg');
  };

  const getRepresentativeById = (id) => {
    const dataFound = representative.find((rep) => rep._id === id);
    return dataFound ? `${dataFound.firstName} ${dataFound.lastName} ` : null;
  };
  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={1}>{children}</Box>}
      </div>
    );
  };

  const clearDateRange = () => {
    setDateRange(['', '']);
    setHistoryTicket([]);
    setFilteredTickets([]);
    setDateArray([]);
    setIsFilterApply(false);
  };

  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [searchTickets, setSearchTickets] = useState<iTicket[]>([]);

  const handleSearchUhid = async (search: any) => {
    setDateRange(['', '']);
    setHistoryTicket([]);
    setFilteredTickets([]);
    setDateArray([]);
    setIsFilterApply(false);
    console.log(search, 'search value');

    if (search.length > 0) {
      try {
        const { data } = await apiClient.get(
          `/consumer/searchTickets?search=${search}`
        );
        console.log(data, 'fetch data  testxox123');
        if (data) {
          setSearchTickets(data.tickets);
          if (data.count === 0) {
            setIsSearch(true);
          }
        } else {
          setIsSearch(true);
        }

        // return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data?.message || 'An error occurred');
        } else {
          console.error('Unknown error', error);
        }
      }
    }
  };

  const handleSearchValue = (value) => {
    setSearch(value);
    setSearchTickets([]);
    setIsSearch(false);
  };
  return (
    <>
      <Box className={Styles.home_container}>
        <Stack
          className={Styles.home_section1}
          position="sticky"
          top={0}
          // bgcolor="white"
          zIndex={10}
        >
          <Stack className={Styles.home_title}>
            <Stack className={Styles.title_name}>
              <Stack className={Styles.title_date}>
                {' '}
                {new Date().toDateString()}{' '}
              </Stack>
              <Stack> {'Hi, ' + user?.firstName}</Stack>
            </Stack>
            <Stack>
              <Logout />
            </Stack>
          </Stack>

          <Stack className={Styles.home_searchbar}>
            <Box display={'flex'} flexDirection={'column'}>
              <Box
                display={'flex'}
                flexDirection={'row'}
                // justifyContent={'space-between'}
                gap={'10px'}
                width={'100%'}
              >
                <Stack
                  width={'85%'}
                  position={'relative'}
                  className={Styles.search_input_layout}
                >
                  <Stack width={'75%'}>
                    <input
                      type="text"
                      className={Styles.search_input}
                      placeholder=" Search..."
                      onChange={(e) => {
                        handleSearchValue(e.target.value);
                        // setSearch( e.target.value );
                      }}
                      onBlur={(e) => handleSearchUhid(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchUhid(search);
                        }
                      }}
                      style={{
                        // border: '1px solid black',
                        cursor: 'pointer',
                        width: '90%'
                      }}
                    />
                  </Stack>
                  <Stack
                    width={'18%'}
                    // border={'1px solid black'}
                    className={Styles.search_icon}
                    onClick={() => {
                      console.log(search, '---');
                      handleSearchUhid(search);
                    }}
                  >
                    <span
                      style={{
                        // border: '1px solid black',
                        cursor: 'pointer'
                      }}
                    >
                      {' '}
                      <SearchIcon />
                    </span>
                  </Stack>
                </Stack>
                {isFilterApply ? (
                  <Stack width={'15%'} className={Styles.selectDate}>
                    <Badge
                      badgeContent={isFilterApply ? 'X' : ''}
                      sx={{
                        '& .MuiBadge-badge': {
                          color: '#FFF',
                          backgroundColor: '#F94839',
                          margin: '-2px',
                          fontSize: '9px',
                          width: '25px',
                          height: '25px'
                        }
                      }}
                      onClick={() => {
                        clearDateRange();
                      }}
                    >
                      <Stack
                        // onClick={() => {
                        //   setIsSelectDate(!isSelectDate);
                        // }}
                        onClick={() => {
                          clearDateRange();
                        }}
                      >
                        <img src={CalenderIcon} alt="calendar" />
                      </Stack>
                    </Badge>
                  </Stack>
                ) : (
                  <Stack
                    width={'15%'}
                    className={Styles.selectDate}
                    onClick={() => {
                      setIsSelectDate(!isSelectDate);
                    }}
                  >
                    <img src={CalenderIcon} alt="calendar" />
                  </Stack>
                )}
                <Stack
                  ref={dateRef}
                  display={isSelectDate ? 'block flex' : 'none'}
                  direction="row"
                  className={Styles.date_filters}
                >
                  {/* <TextField
                    name="StartDate"
                    fullWidth
                    onChange={handleStartDateChange}
                    value={dateRange[0] || ''}
                    size="small"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                      style: { fontFamily: 'Outfit,san-serif' }
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0],
                      style: {
                        fontFamily: 'Outfit,san-serif',
                        fontSize: '14px'
                      },
                      placeholder: dateRange[0] ? '' : 'Start Date'
                    }}
                    InputProps={{
                      style: {
                        border: 'none',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '14px'
                      },
                      disableUnderline: true
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none'
                        }
                      }
                    }}
                  /> */}
                  <TextField
                    name="StartDate"
                    fullWidth
                    onChange={handleStartDateChange}
                    value={dateRange[0] || ''}
                    size="small"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                      style: { fontFamily: 'Outfit, san-serif' }
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0],
                      style: {
                        fontFamily: 'Outfit, san-serif',
                        fontSize: '14px'
                      }
                    }}
                    InputProps={{
                      style: {
                        border: 'none',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '14px'
                      },
                      disableUnderline: true,
                      startAdornment: !dateRange[0] && (
                        <InputAdornment
                          position="start"
                          style={{ color: '#aaa', fontSize: '14px' }}
                        >
                          Start Date{' '}
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none'
                        }
                      }
                    }}
                  />

                  <TextField
                    name="LastDate"
                    fullWidth
                    onChange={handleEndDateChange}
                    value={dateRange[1]}
                    type="date"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                      style: { fontFamily: 'Outfit,san-serif' }
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0],
                      // min: new Date(dateRange[0]).toDateString().split('T')[0],
                      style: {
                        fontFamily: 'Outfit,san-serif',
                        fontSize: '14px'
                      },
                      placeholder: dateRange[1] ? '' : 'last Date'
                    }}
                    InputProps={{
                      style: {
                        border: 'none',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '14px'
                      },
                      disableUnderline: true,
                      startAdornment: !dateRange[1] && (
                        <InputAdornment
                          position="start"
                          style={{ color: '#aaa', fontSize: '14px' }}
                        >
                          Last Date{' '}
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none'
                        }
                      }
                    }}
                  />
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Stack>
        {!isFilterApply && (
          <Stack
            className={Styles.home_section2}
            onClick={() => {
              navigate('/register');
            }}
          >
            <Stack className={Styles.createPrescription}>
              {[
                {
                  name: 'Patient Registration',
                  description:
                    'Register patient on the platform after doctor’s visit and upload the prescription',
                  icon: UserAddIcon,
                  path: '/register'
                }
                // {
                //   name: 'Query Resolution',
                //   description:
                //     'Resolve queries of the patient, platform representatives will be chatting on behalf of patients.',
                //   icon: <Forum fontSize="medium" />,
                //   path: '/query'
                // }
              ].map((item, index) => {
                return (
                  <Box key={index}>
                    <Stack className={Styles.createPrescription_Icon}>
                      <img src={item.icon} />
                    </Stack>
                    <Stack className={Styles.createPrescription_title}>
                      {item.name}
                    </Stack>
                    <Stack className={Styles.createPrescription_description}>
                      {item.description}
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        )}

        {dateArray && (
          <Stack sx={{ marginBottom: search.length < 0 ? '150px' : '0px' }}>
            {dateArray.map((date) => (
              <Box key={date}>
                <Stack
                  className={Styles.date_fil}
                  onClick={() => {
                    handleDateClick(date);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Stack className={Styles.date_fil_cont}>
                    <Stack className={Styles.date_fil_date}>{date}</Stack>
                    <Stack display={'flex'} flexDirection={'row'} gap={'8px'}>
                      {filterTicketsCountByDate(date) ? (
                        <Stack className={Styles.date_acc_capture}>
                          {filterTicketsCountByDate(date)} Capture
                        </Stack>
                      ) : (
                        <Stack className={Styles.date_acc_capture}>
                          0 Capture
                        </Stack>
                      )}
                      <Stack>
                        <img src={ArrowDownIcon} alt="Arrow down" />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>

                {clickDate === date && (
                  <>
                    <Stack className={Styles.additionalData}>
                      {filteredTickets.length > 0 ? (
                        <>
                          <Stack className={Styles.card_history}>
                            {filteredTickets.map((ticket) => (
                              <Stack key={ticket._id}>
                                <Box
                                  my={1.5}
                                  className={Styles.History_consumer}
                                >
                                  <Stack className={Styles.History_consumer_up}>
                                    <Stack
                                      className={Styles.History_consumer_up1}
                                    >
                                      {ticket?.consumer[0] && (
                                        <Stack
                                          className={
                                            Styles.History_consumer_name
                                          }
                                        >
                                          {' '}
                                          {ticket?.consumer[0]?.firstName}{' '}
                                          {ticket?.consumer[0]?.lastName &&
                                            ticket?.consumer[0]?.lastName}
                                        </Stack>
                                      )}
                                      <Stack
                                        className={
                                          Styles.History_consumer_gen_age
                                        }
                                      >
                                        {ticket?.consumer[0] &&
                                          ticket?.consumer[0]?.gender && (
                                            <Stack
                                              className={
                                                Styles.History_consumer_gen
                                              }
                                            >
                                              {ticket?.consumer[0]?.gender}
                                            </Stack>
                                          )}
                                        {ticket?.consumer[0] &&
                                          ticket?.consumer[0]?.age && (
                                            <Stack
                                              className={
                                                Styles.History_consumer_age
                                              }
                                            >
                                              {ticket?.consumer[0]?.age}
                                            </Stack>
                                          )}
                                      </Stack>
                                    </Stack>
                                    {ticket?.consumer[0] && (
                                      <Stack
                                        className={Styles.History_consumer_up2}
                                      >
                                        #{ticket?.consumer[0]?.uid}
                                      </Stack>
                                    )}
                                  </Stack>

                                  {ticket?.prescription[0] && (
                                    <Stack
                                      className={Styles.History_consumer_dep}
                                    >
                                      {
                                        ticket?.prescription[0].doctorDetails[0]
                                          ?.name
                                      }{' '}
                                      {'('}
                                      {
                                        ticket?.prescription[0]
                                          .departmentDetails[0]?.name
                                      }
                                      {')'}
                                    </Stack>
                                  )}
                                  {ticket?.prescription[0] && (
                                    <Stack
                                      className={
                                        Styles.History_consumer_createdDate
                                      }
                                    >
                                      {formatDate(
                                        ticket?.prescription[0].created_Date
                                      )}
                                    </Stack>
                                  )}

                                  <Box py={0.7} px={1}>
                                    {' '}
                                    <Stack
                                      className={Styles.border}
                                      my={1}
                                    ></Stack>
                                  </Box>

                                  <Stack className={Styles.History_consumer_bt}>
                                    {ticket && (
                                      <Stack
                                        className={
                                          Styles.History_consumer_createdDate
                                        }
                                      >
                                        Created by:{' '}
                                        {getRepresentativeById(ticket.creator)}
                                      </Stack>
                                    )}
                                    {ticket?.prescription[0]?.image && (
                                      <Stack
                                        className={Styles.presc}
                                        onClick={() =>
                                          handleOpen(
                                            ticket?.prescription[0]?.image?.split(
                                              '?'
                                            )[0],
                                            ticket?.prescription[0]?.image1?.split(
                                              '?'
                                            )[0]
                                          )
                                        }
                                      >
                                        View Prescription
                                      </Stack>
                                    )}
                                  </Stack>
                                </Box>
                              </Stack>
                            ))}
                          </Stack>
                        </>
                      ) : (
                        <Stack className={Styles.defaultScreen_container}>
                          <Stack className={Styles.imG}>
                            <img
                              src={SearchDefault}
                              alt="No Department Selected"
                            />
                          </Stack>
                          <Stack className={Styles.defaultScreen_text}>
                            No Ticket Found on Click Date
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  </>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {search && (
        <Stack className={Styles.additionalData}>
          {searchTickets.length > 0 ? (
            <>
              <Stack className={Styles.card_history}>
                {searchTickets.map((ticket) => (
                  <Stack key={ticket._id}>
                    <Box my={1.5} className={Styles.History_consumer}>
                      <Stack className={Styles.History_consumer_up}>
                        <Stack className={Styles.History_consumer_up1}>
                          {ticket?.consumer[0] && (
                            <Stack className={Styles.History_consumer_name}>
                              {typeof ticket?.consumer[0]?.firstName ===
                                'string' && ticket?.consumer[0]?.firstName}
                            </Stack>
                          )}
                          <Stack className={Styles.History_consumer_gen_age}>
                            {ticket?.consumer[0] &&
                              ticket?.consumer[0]?.gender && (
                                <Stack className={Styles.History_consumer_gen}>
                                  {ticket?.consumer[0]?.gender}
                                </Stack>
                              )}
                            {ticket?.consumer[0] &&
                              ticket?.consumer[0]?.age && (
                                <Stack className={Styles.History_consumer_age}>
                                  {ticket?.consumer[0]?.age}
                                </Stack>
                              )}
                          </Stack>
                        </Stack>
                        {ticket?.consumer[0] && (
                          <Stack className={Styles.History_consumer_up2}>
                            #{ticket?.consumer[0]?.uid}
                          </Stack>
                        )}
                      </Stack>

                      {ticket?.prescription[0] && (
                        <Stack className={Styles.History_consumer_dep}>
                          {fetchDoctorName(ticket.prescription[0].doctor)} {'('}
                          {fetchDepartmentName(
                            ticket?.prescription[0].departments[0]
                          )}
                          {')'}
                        </Stack>
                      )}
                      {ticket && (
                        <Stack className={Styles.History_consumer_createdDate}>
                          {ticket.date.split('T')[0]}
                        </Stack>
                      )}

                      <Box py={0.7} px={1}>
                        {' '}
                        <Stack className={Styles.border} my={1}></Stack>
                      </Box>

                      <Stack className={Styles.History_consumer_bt}>
                        {ticket && (
                          <Stack
                            className={Styles.History_consumer_createdDate}
                          >
                            Created by: {getRepresentativeById(ticket.creator)}
                          </Stack>
                        )}
                        {ticket?.prescription[0]?.image && (
                          <Stack
                            className={Styles.presc}
                            onClick={() =>
                              handleOpen(
                                ticket?.prescription[0]?.image?.split('?')[0],
                                ticket?.prescription[0]?.image1?.split('?')[0]
                              )
                            }
                          >
                            View Prescription
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </>
          ) : (
            <>
              {isSearch ? (
                <Stack className={Styles.defaultScreen_container}>
                  <Stack className={Styles.imG}>
                    <img src={SearchDefault} alt="No Department Selected" />
                  </Stack>
                  <Stack className={Styles.defaultScreen_text}>
                    No Ticket Found
                  </Stack>
                </Stack>
              ) : (
                <></>
              )}
            </>
          )}
        </Stack>
      )}

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="row" spacing={1} display="flex" alignItems="center">
            <Stack className={Styles.History_consumer_name}>
              Prescription Image
            </Stack>
            <Stack
              className="Download-Icon"
              onClick={() => {
                downloadPrescription(selectedImage);
              }}
            >
              <img src={DocumentDownload} />
            </Stack>
            <Stack className="modal-close" onClick={handleClose}>
              <img src={CloseModalIcon} />
            </Stack>
          </Stack>
          <Stack position="sticky" top={76} bgcolor="white" zIndex={10}>
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={(_, newValue: number) => setValue(newValue)}
              sx={{
                '& .MuiTabs-indicator': {
                  display: 'none'
                },
                '.Mui-selected': {
                  fontFamily: 'Outfit,san-serif',
                  color: '#080F1A !important',
                  fontSize: '14px',
                  borderBottom: '2px solid #0566FF'
                }
              }}
            >
              <Tab
                label="Image 1"
                sx={{
                  fontSize: '14px',
                  fontFamily: 'Outfit,san-serif',
                  textTransform: 'capitalize'
                }}
              />
              {selectedImage1 && (
                <Tab
                  label="Image 2"
                  sx={{
                    fontSize: '14px',
                    fontFamily: 'Outfit,san-serif',
                    textTransform: 'capitalize'
                  }}
                />
              )}
            </Tabs>
          </Stack>
          <Box>
            <TabPanel value={value} index={1}>
              {selectedImage1 && (
                <img
                  src={selectedImage1}
                  alt="Prescription"
                  onError={() =>
                    console.error('Image failed to load:', selectedImage1)
                  }
                  style={{
                    width: '100%',
                    height: '60vh',
                    objectFit: 'contain'
                  }}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={0}>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Prescription"
                  style={{
                    width: '100%',
                    height: '60vh',
                    objectFit: 'contain'
                  }}
                />
              )}
            </TabPanel>
          </Box>
          {/* {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Prescription"
                          style={{
                            width: '100%',
                            height: '72vh',
                            objectFit: 'contain'
                          }}
                        />
                      )} */}
        </Box>
      </Modal>
    </>
  );
};

export default Home;
