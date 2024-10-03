/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  Menu,
  MenuItem,
  Modal,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotFoundIcon from '../../../src/assets/NotFoundTask.svg';

import { filterActions } from '../../screen/ticket/ticketStateReducers/actions/filterAction';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';

import { useEffect, useState, useRef, useReducer } from 'react';
import {
  getAllReminderHandler,
  getAllTaskCountHandler,
  getAllWhtsappCountHandler,
  getTicketHandler
} from '../../api/ticket/ticketHandler';
import DropDownArrow from '../../assets/DropdownArror.svg';

import useTicketStore from '../../store/ticketStore';
import TicketCard from '../../screen/ticket/widgets/TicketCard';
import { iCallRescheduler, iReminder, iTicket } from '../../types/store/ticket';
import { getDoctorsHandler } from '../../api/doctor/doctorHandler';
import { getDepartmentsHandler } from '../../api/department/departmentHandler';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import DefaultScreen from '../../components/DefaultScreen';
import { ArrowBack } from '@mui/icons-material';
import TicketFilter from '../../screen/ticket/widgets/TicketFilter';
import TicketFilterDiago from '../../screen/ticket/widgets/TicketFilterDiago';
import TicketFilterFollowup from '../../screen/ticket/widgets/TicketFilterFollowup';

import handleClearFilter from '../../screen/ticket/widgets/TicketFilter';

import DownloadAllTickets from '../../screen/ticket/widgets/DownloadAllTickets';
import dayjs from 'dayjs';
import CustomPagination from './CustomPagination';
import {
  NAVIGATE_TO_SWITCHVIEW_TICKET,
  NAVIGATE_TO_TICKET,
  UNDEFINED
} from '../../constantUtils/constant';
import {
  getStagesHandler,
  getSubStagesHandler
} from '../../api/stages/stagesHandler';
import useServiceStore from '../../store/serviceStore';
import './styles.css';
import {
  getAllCallReschedulerHandler,
  getAuditorCommentCount,
  getTicket,
  getTicketAfterNotification,
  getticketRescedulerAbove,
  getticketRescedulerAboveAdmission,
  validateTicket
} from '../../api/ticket/ticket';
import CustomSpinLoader from '../../components/CustomSpinLoader';
import { socket } from '../../api/apiClient';
import { socketEventConstants } from '../../constantUtils/socketEventsConstants';
import useUserStore from '../../store/userStore';
import {
  selectedFiltersReducer,
  ticketFilterTypes
} from '../../screen/ticket/ticketStateReducers/filter';
import { getAllNotesWithoutTicketId } from '../../api/notes/allNote';
import '../../screen/ticket/singleTicket.css';
import ToggleIcon from '../../../src/assets/Toggle.svg';
import ExpandedModal from '../../screen/ticket/widgets/whatsapp/ExpandedModal';
import ExpandedSmsModal from '../../screen/ticket/widgets/SmsWidget/ExpandedSmsModal';
import ExpandedPhoneModal from '../../screen/ticket/widgets/PhoneWidget/ExpandedPhoneModal';
import AuditFilterIcon from '../../../src/assets/commentHeader.svg';
import { toast } from 'react-toastify';
import {
  getAllServiceFromDbHandler,
  getAllServicesHandler
} from '../../api/service/serviceHandler';
import useReprentativeStore from '../../store/representative';
import { getRepresntativesHandler } from '../../api/representive/representativeHandler';
import { SpinnerDotted } from 'spinners-react';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#0566FF',
    color: '#ffffff',
    fontSize: 10,
    fontFamily: `"Outfit",sans-serif`
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#0566FF'
  }
}));

// .import { handleClearFilter } from '../../ticket / widgets / TicketFilter';
let AllIntervals: any[] = [];

interface storeMessage {
  message: string;
  ticket: string;
  unreadCount: number;

  // Add other fields as needed
}
const menuItemStyles = {
  color: '#080F1A',
  fontFamily: `Outfit, sans-serif`,
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '150%'
};
const Ticket = () => {
  const initialFilters: ticketFilterTypes = {
    stageList: [],
    representative: null,
    results: null,
    admissionType: [],
    diagnosticsType: [],
    dateRange: [],
    status: [],
    followUp: null
  };
  const { ticketID } = useParams();
  const {
    tickets,
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    setSearchByName,
    searchByName,
    ticketCount,
    setTicketCount,
    setTickets,
    ticketCache,
    emptyDataText,

    reminders,
    callRescheduler,
    loaderOn,
    pageNumber,
    setPageNumber,
    isSwitchView,
    setIsSwitchView,
    setIsAuditor,
    viewEstimates,
    allAuditCommentCount,
    setAllAuditCommentCount,
    downloadDisable
  } = useTicketStore();
  const { user } = useUserStore.getState();
  const phoneNumber = user?.phone;

  const { representative } = useReprentativeStore();

  // const [filteredTickets, setFilteredTickets] = useState<iTicket[]>();
  const [searchName, setSearchName] = useState<string>('');
  const [totalEstimateValue, setTotalEstimateValue] = useState(0);
  const [phone, setPhone] = useState(null);

  const [reminderList, setReminderList] = useState<any[]>([]);
  const [callReschedulerList, setcallReschedulerList] = useState<any[]>([]);

  const [alarmReminderedList, setAlamarReminderList] = useState<iReminder[]>(
    []
  );
  const [alarmCallReschedulerList, setAlarmCallReschedulerList] = useState<
    iCallRescheduler[]
  >([]);
  const [ticketReminderPatient, setTicketReminderPatient] = useState<any>(null);
  const [ticketCallReschedulerPatient, setTicketCallReschedulerPatient] =
    useState<any>(null);
  const [taskTypeForReminder, setTaskTypeForReminder] = useState('');
  const [taskTypeForRecheduler, setTaskTypeForRecheduler] = useState('');

  const [
    ticketCallReschedulerConsumerData,
    setTicketCallReschedulerConsumerData
  ] = useState<any>(null);

  const [ticketCallReminderConsumerData, setTicketCallReminderConsumerData] =
    useState<any>(null);

  const [searchError, setSearchError] = useState<string>(
    'Type to search & Enter'
  );

  const [pageCount, setPageCount] = useState<number>(1);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [visible, setVisible] = useState(false);

  const [showCallReschedulerModal, setShowCallReschedulerModal] =
    useState(false);

  const [page, setPage] = useState<number>(1);
  // const [selectedItem, setSelectedItem] = useState('Mohali');
  const visibleRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const currentRoute = useMatch(NAVIGATE_TO_TICKET);
  const redirectTicket = () => {
    navigate(
      `${
        localStorage.getItem('ticketType') === 'Admission'
          ? '/admission/'
          : localStorage.getItem('ticketType') === 'Diagnostics'
          ? '/diagnostics/'
          : localStorage.getItem('ticketType') === 'Follow-Up'
          ? '/follow-up/'
          : '/ticket/'
      }`
    );
  };

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

  const handlePagination = async (
    event: React.ChangeEvent<unknown>,
    pageNo: number
  ) => {
    setPageNumber(pageNo);
    setPage(pageNo);
    if (pageNo !== page) {
      setTickets([]);
      await getTicketHandler(searchName, pageNo, 'false', newFilter);
      setPageNumber(pageNo);

      // redirectTicket();
    }
  };

  useEffect(() => {
    setPageCount(Math.ceil(ticketCount / 10));
    setPage(pageNumber);
  }, [tickets, searchByName]);

  const fetchTicketsOnEmpthySearch = async () => {
    setSearchName('');
    setSearchByName(UNDEFINED);
    setPage(1);
    setPageNumber(1);
    await getTicketHandler(UNDEFINED, 1, 'false', newFilter);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (visibleRef.current && !visibleRef.current.contains(event.target)) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log(newFilter, 'newFilter');
    const data = async () => {
      setSearchName('');
      setSearchByName(UNDEFINED);
      setSearchError('Type to search & Enter');
      // setTicketCount(ticketCache["count"]);
      // setTickets(ticketCache[1]);
      setPage(1);
      setPageNumber(1);
      await getTicketHandler(UNDEFINED, 1, 'false', newFilter);
    };
    data();
  }, [localStorage.getItem('location')]);

  // const handleSeachName = (
  //   e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  // ) => {
  //   const value = e.target.value;
  //   if (value) {
  //     inputSearch.current = value
  //   }
  //   if (value === '') {
  //     fetchTicketsOnEmpthySearch();
  //   }
  // };

  const handleSearchKeyPress = async (e: any) => {
    console.log(e);
    if (e.key === 'Enter') {
      setTickets([]);

      if (searchName === '') {
        fetchTicketsOnEmpthySearch();
        setSearchError('Type to search & Enter');
        // redirectTicket();
        return;
      }
      await getTicketHandler(searchName, 1, 'false', newFilter);
      setSearchByName(searchName);
      setSearchError(`remove "${searchName.toUpperCase()}" to reset & Enter`);
      setPageNumber(1);
      setPage(1);
      // redirectTicket();
    }
  };

  // const checkFilterLength = () => {
  //   let filterLength = 0;
  //   if (filterTickets.startDate > 0 && filterTickets.endDate > 0) {
  //     filterLength =
  //       filterTickets.stageList.length +
  //       filterTickets.admissionType.length +
  //       filterTickets.diagnosticType.length +
  //       1;
  //   } else {
  //     filterLength =
  //       filterTickets.stageList.length +
  //       filterTickets.admissionType.length +
  //       filterTickets.diagnosticType.length;
  //   }
  //   return filterLength;
  // };

  // const filterFn = () => {
  //   const filteredData = tickets.filter(
  //     (item: iTicket) =>
  //       departmentFilterRule(item.prescription[0].departments[0]) &&
  //       admissionFilterRule(item.prescription[0].admission) &&
  //       diagnosticsFilterRule(item.prescription[0].diagnostics) &&
  //       dateRule(item.createdAt)
  //   );
  //   setPageCount(Math.ceil(ticketCount / 10));
  //   setFilteredTickets(filteredData);
  // };

  // const departmentFilterRule = (department: string) => {
  //   return filterTickets.departments.length > 0
  //     ? filterTickets.departments.includes(department)
  //     : true;
  // };

  // const admissionFilterRule = (admission: string) => {
  //   return filterTickets.admissionType.length > 0
  //     ? filterTickets.admissionType.includes(admission)
  //     : true;
  // };

  // const diagnosticsFilterRule = (diagnostics: string[]) => {
  //   if (filterTickets.diagnosticType.length > 0) {
  //     let diagnosticsResult =
  //       diagnostics.length > 0
  //         ? diagnostics.every((item) =>
  //             filterTickets.diagnosticType.includes(item)
  //           )
  //         : false;

  //     return diagnosticsResult;
  //   } else return true;
  // };

  // const dateRule = (createdAt: string) => {
  //   const createdDate = dayjs(createdAt).unix() * 1000;
  //   if (filterTickets.startDate > 0 && filterTickets.endDate > 0) {
  //     const isTicketofDate =
  //       createdDate >= filterTickets.startDate &&
  //       createdDate < filterTickets.endDate
  //         ? true
  //         : false;
  //     return isTicketofDate;
  //   } else return true;
  // };

  // window.onload = redirectTicket;

  useEffect(() => {
    (async function () {
      // await getTicketHandler(UNDEFINED, 1, 'false', newFilter);
      await getAllNotesWithoutTicketId();
      await getStagesHandler();
      await getSubStagesHandler();
      await getDoctorsHandler();
      await getDepartmentsHandler();
      await getAllReminderHandler();
      await getAllCallReschedulerHandler();
      await getAllTaskCountHandler();
      await getAllServiceFromDbHandler();
    })();
    setPageNumber(1);
    setIsAuditor(false);
    setSearchName('');
    setSearchByName(UNDEFINED);
    setSearchError('Type to search & Enter');
    // setTicketCount(ticketCache["count"]);
    // setTickets(ticketCache[1]);
    setPage(1);
    setPageNumber(1);
  }, [localStorage.getItem('ticketType')]);

  // const isAlamredReminderExist = (reminder: iReminder) => {
  //   const result = reminderList?.findIndex((data) => data === reminder?._id);
  //   if (result < 0) {
  //     return true;
  //   }
  //   return false;
  // };

  const handleCloseModal = async () => {
    const result = await getAllReminderHandler();
    setTimeout(() => {
      setPage(1);
      setPageNumber(1);
      let list = alarmReminderedList;
      list.splice(0, 1);
      setShowReminderModal(false);
      setAlamarReminderList([]);
      setReminderList(result);
    }, 100);
  };

  const handleCloseCallReschedulerModal = async () => {
    const result = await getAllCallReschedulerHandler();

    setTimeout(() => {
      setPage(1);
      setPageNumber(1);
      let list = alarmCallReschedulerList;
      list.splice(0, 1);
      setShowCallReschedulerModal(false);
      setAlarmCallReschedulerList([]);
      setcallReschedulerList(result);
    }, 100);
  };

  const handleCallReminderToast = () => {
    toast(
      <div>
        <div
          style={{
            display: 'flex',
            color: '#080F1A',
            fontSize: '14px',
            fontFamily: 'Outfit,san-serif',
            fontWeight: 'bold'
          }}
        >
          <NotificationsActiveIcon
            sx={{ fontSize: '20px', marginRight: '14px' }}
          />
          Reminder{' '}
          {(ticketCallReminderConsumerData?.firstName || '').toUpperCase()}
          {(ticketCallReminderConsumerData?.lastName || '').toUpperCase()}
          {taskTypeForReminder === 'Admission'
            ? '(Admission)'
            : '(Diagnostics)'}
        </div>
        <div
          style={{
            color: '#647491',
            fontSize: '12px',
            fontFamily: 'Outfit,san-serif',
            marginLeft: '33px'
          }}
        >
          {alarmReminderedList[0]?.title.toUpperCase()}
        </div>
      </div>,
      {
        autoClose: false,
        style: {
          color: '#fff',
          fontSize: '16px',
          borderRadius: '0.5rem'
        },
        onClick: handleCloseModal,
        onClose: handleCloseModal
      }
    );
  };
  const handleCallReschedulerToast = () => {
    toast(
      <div>
        <div
          style={{
            display: 'flex',
            color: '#080F1A',
            fontSize: '14px',
            fontFamily: 'Outfit,san-serif',
            fontWeight: 'bold'
          }}
        >
          <NotificationsActiveIcon
            sx={{ fontSize: '20px', marginRight: '14px' }}
          />
          {ticketCallReschedulerPatient && (
            <Typography sx={{ fontSize: '14px', marginRight: '14px' }}>
              {`Call Rescheduler for ${(
                ticketCallReschedulerConsumerData?.firstName || ''
              ).toUpperCase()}${(
                ticketCallReschedulerConsumerData?.lastName || ''
              ).toUpperCase()} `}
              {taskTypeForRecheduler === 'Admission'
                ? '(Admission)'
                : '(Diagnostics)'}
            </Typography>
          )}{' '}
        </div>
        <div
          style={{
            color: '#647491',
            fontSize: '12px',
            fontFamily: 'Outfit,san-serif',
            marginLeft: '33px'
          }}
        >
          <Typography fontSize={'18px'} fontWeight={'600'} margin={'10px'}>
            {alarmCallReschedulerList[0]?.selectedLabels
              ? alarmCallReschedulerList[0].selectedLabels
                  .map((label) => label.label)
                  .join(', ')
                  .toUpperCase()
              : 'N/A'}
          </Typography>
        </div>
      </div>,
      {
        autoClose: false,
        style: {
          color: '#fff',
          fontSize: '16px',
          borderRadius: '0.5rem'
        },
        onClick: handleCloseCallReschedulerModal,
        onClose: handleCloseCallReschedulerModal
      }
    );
  };

  const clearAllInterval = (AllIntervals: any[]) => {
    AllIntervals?.forEach((interval) => {
      clearInterval(interval);
    });
    AllIntervals = [];
  };

  // const refetchTickets = async () => {
  //   const copiedFilterTickets = { ...filterTickets };
  //   await getTicketHandler(UNDEFINED, 1, 'false', copiedFilterTickets);
  // }
  useEffect(() => {
    const refetchTickets = async () => {
      let pageNumber = page;
      if (ticketID) {
      } else {
        await getTicketHandler(searchName, pageNumber, 'false', newFilter);
        await getTicketAfterNotification(
          searchName,
          pageNumber,
          'false',
          newFilter
        );
      }
    };

    // socket.on(socketEventConstants.REFETCH_TICKETS, refetchTickets);
    if (localStorage.getItem('ticketType') === 'Diagnostics') {
      socket.on(
        socketEventConstants.DIAGNOSTICS_REFETCH_TICKETS,
        refetchTickets
      );
    } else if (localStorage.getItem('ticketType') === 'Follow-Up') {
      socket.on(socketEventConstants.FOLLOWUP_REFETCH_TICKETS, refetchTickets);
    } else if (localStorage.getItem('ticketType') === 'Admission') {
      socket.on(socketEventConstants.REFETCH_TICKETS, refetchTickets);
    }

    return () => {
      if (localStorage.getItem('ticketType') === 'Diagnostics') {
        socket.off(
          socketEventConstants.DIAGNOSTICS_REFETCH_TICKETS,
          refetchTickets
        );
      } else if (localStorage.getItem('ticketType') === 'Follow-Up') {
        socket.off(
          socketEventConstants.FOLLOWUP_REFETCH_TICKETS,
          refetchTickets
        );
      } else if (localStorage.getItem('ticketType') === 'Admission') {
        socket.off(socketEventConstants.REFETCH_TICKETS, refetchTickets);
      }
      // socket.off(socketEventConstants.REFETCH_TICKETS, refetchTickets);
    };
  }, [newFilter, page, searchName]);

  // useEffect(() => {
  //   const refetchTickets = async () => {
  //     await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
  //   }

  //   socket.on(socketEventConstants.REFETCH_TICKETS, refetchTickets);

  //   return () => {
  //     socket.off(socketEventConstants.REFETCH_TICKETS, refetchTickets);
  //   };
  // }, []);
  console.log(page);

  useEffect(() => {
    clearAllInterval(AllIntervals);

    reminders?.forEach((reminderDetail, index) => {
      console.log(reminderDetail);
      let alarmInterval: any;

      alarmInterval = setInterval(() => {
        const currentTime = new Date();
        if (
          reminderDetail &&
          reminderDetail.date <= currentTime.getTime() &&
          reminderDetail.date + 11000 > currentTime.getTime()
        ) {
          (async () => {
            if (!reminderList.includes(reminderDetail._id)) {
              console.log(reminders);
              const data =
                reminderDetail.ticketType === 'admission'
                  ? await getticketRescedulerAboveAdmission(
                      reminderDetail?.ticket
                    )
                  : await getticketRescedulerAbove(reminderDetail?.ticket);
              if (reminderDetail.ticketType === 'admission') {
                setTaskTypeForReminder('Admission');
              }
              setTicketCallReminderConsumerData(data.message?.consumerDetails);
              setTicketReminderPatient(data.message?.ticketdetails);
              setAlamarReminderList([...alarmReminderedList, reminderDetail]);
              setReminderList([...reminderList, reminderDetail?._id]);
              // redirectTicket();
              setShowReminderModal(true);
            }
          })();

          clearInterval(alarmInterval);
        }
      }, 10000);

      AllIntervals.push(alarmInterval);

      return () => {
        clearAllInterval(AllIntervals);
      };
    });
  }, [reminders]);

  const handleCallToasterReminder = async () => {
    handleCallReminderToast();
    await getTicketHandler(UNDEFINED, pageNumber, 'false', newFilter);
  };

  useEffect(() => {
    if (showReminderModal) {
      handleCallToasterReminder();
    }
  }, [showReminderModal]);

  useEffect(() => {
    clearAllInterval(AllIntervals);
    callRescheduler?.forEach((callRescheduleDetail, index) => {
      let alarmInterval: any;

      alarmInterval = setInterval(() => {
        const currentTime = new Date();
        if (
          callRescheduleDetail &&
          callRescheduleDetail.date <= currentTime.getTime() &&
          callRescheduleDetail.date + 11000 > currentTime.getTime()
          // isAlamredReminderExist(reminderDetail)
        ) {
          (async () => {
            console.log('inside the condition');
            if (!callReschedulerList.includes(callRescheduleDetail?._id)) {
              const data =
                callRescheduleDetail.ticketType === 'admission'
                  ? await getticketRescedulerAboveAdmission(
                      callRescheduleDetail?.ticket
                    )
                  : await getticketRescedulerAbove(
                      callRescheduleDetail?.ticket
                    );

              if (callRescheduleDetail.ticketType === 'admission') {
                setTaskTypeForRecheduler('Admission');
              }
              setTicketCallReschedulerConsumerData(
                data?.consumerDetails?.consumerDetails
              );
              // await getTicketHandler(UNDEFINED, pageNumber, 'false', selectedFilters);
              setTicketCallReschedulerPatient(data?.message?.ticketdetails);
              setAlarmCallReschedulerList([
                ...alarmCallReschedulerList,
                callRescheduleDetail
              ]);
              setcallReschedulerList([
                ...callReschedulerList,
                callRescheduleDetail?._id
              ]);
              // redirectTicket();
              setShowCallReschedulerModal(true);
            }
          })();

          clearInterval(alarmInterval);
        }
      }, 10000);

      AllIntervals.push(alarmInterval);

      return () => {
        clearAllInterval(AllIntervals);
      };
    });
  }, [callRescheduler]);

  const handleCallToasterRescheduler = async () => {
    handleCallReschedulerToast();
    await getTicketHandler(UNDEFINED, pageNumber, 'false', newFilter);
  };

  useEffect(() => {
    if (showCallReschedulerModal) {
      handleCallToasterRescheduler();
    }
  }, [showCallReschedulerModal]);

  const { setFilterTickets } = useTicketStore();
  // const initialFilters = {
  //   stageList: [],
  //   representative: null,
  //   results: null,
  //   admissionType: [],
  //   diagnosticsType: [],
  //   dateRange: [],
  //   status: [],
  //   followUp: null,
  // };

  const backToDashboard = () => {
    getTicketHandler(UNDEFINED, 1, 'false', initialFilters);
    setFilterTickets(initialFilters);
    navigate('/');
  };

  const totalEstimate = (ticketID: any) => {
    if (viewEstimates.length !== 0) {
      if (viewEstimates[viewEstimates.length - 1]?.ticket === ticketID) {
        return viewEstimates[viewEstimates.length - 1]?.total;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleClose = (item) => {
  //   if (item) {
  //     setSelectedItem(item);
  //   }
  //   setAnchorEl(null);
  // };

  //This function call the api to get all the ticket id with their whtsapp message count
  const getAllWhtsappMsgCount = async () => {
    await getAllWhtsappCountHandler();
    await getTicketHandler(searchName, pageNumber, 'false', newFilter);
  };
  useEffect(() => {
    getAllWhtsappMsgCount();
  }, []);

  //For getting the whtsapp message instant

  const [messages, setMessages] = useState<storeMessage[]>([]);

  useEffect(() => {
    // Check if socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
      getAllWhtsappMsgCount();
    };

    // Listen for the 'newMessage' event
    socket.on('newMessage', handleNewMessage);

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('newMessage', handleNewMessage); // Remove the event listener
      socket.disconnect();
    };
  }, [ticketID]);

  const handleOnClose = async () => {
    if (ticketID) {
      // localStorage.getItem('ticketType') === 'Admission'
      //   ? await validateTicket(ticketID)
      //   : await validateTicketDiago(ticketID);
      await validateTicket(ticketID);
      if (!isSwitchView) {
        navigate(
          `${
            localStorage.getItem('ticketType') === 'Admission'
              ? '/admission/'
              : localStorage.getItem('ticketType') === 'Diagnostics'
              ? '/diagnostics/'
              : localStorage.getItem('ticketType') === 'Follow-Up'
              ? '/follow-up/'
              : '/ticket/'
          }`
        );
      } else {
        navigate(NAVIGATE_TO_SWITCHVIEW_TICKET);
      }
    }
  };

  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const fetchRepresentatives = async () => {
      try {
        const fetchedRepresentative = await getRepresntativesHandler();

        const patnaFound = fetchedRepresentative?.some(
          (rep) =>
            rep.phone === phoneNumber && rep.Unit === '66fa9666589c46100af402c9'
        );
        const ranchiFound = fetchedRepresentative?.some(
          (rep) =>
            rep.phone === phoneNumber && rep.Unit === '66f7bdca783f9aaba1099ce4'
        );

        if (patnaFound) {
          setIsAdminUser(false);
        } else if (ranchiFound) {
          setIsAdminUser(false);
        } else {
          setIsAdminUser(true);
        }
      } catch (error) {
        console.error('Error fetching representatives:', error);
      }
    };

    fetchRepresentatives();
  }, [phone]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuditorCommentCount(); // Resolve the promise here
        setAllAuditCommentCount({
          auditorCommentId: '',
          ticketid: '',
          unreadCount: data ? data : {} // Set the resolved data here
        });
      } catch (error) {
        console.error('Error fetching auditor comment count:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Check if socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewMessage = (data: any) => {
      setAllAuditCommentCount(data);
    };

    // Listen for the 'newMessage' event
    socket.on('auditorCommentAdded', handleNewMessage);
    return () => {
      socket.off('auditorCommentAdded', handleNewMessage); // Remove the event listener
      socket.disconnect();
    };
  });

  return (
    <>
      {downloadDisable && (
        <>
          <Box
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="rgba(255, 255, 255, 0.5)" // Semi-transparent background
            zIndex={9999} // Ensure it's on top
          >
            <Box
              display="flex"
              flexDirection="column" // Arrange spinner and text vertically
              justifyContent="center"
              alignItems="center"
            >
              <SpinnerDotted
                size={100}
                thickness={100}
                speed={50}
                color="#007BFF"
                // secondaryColor="#D9EBFF"
              />
              <Box mt={2} fontSize="16px" fontWeight="bold">
                {' '}
                {/* Add margin-top to space text below the spinner */}
                Please Wait ...
              </Box>
            </Box>
          </Box>
        </>
      )}
      <Box height={'100vh'} display="flex" position="fixed" width="100%">
        <Box
          bgcolor="#F6F7F9"
          width="23%"
          position="sticky"
          top={0}
          p={'2rem 0.5rem 2rem 0.5rem'}
        >
          <Box
            px={1}
            height={'17vh'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
          >
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <Stack
                className="Ticket-Assignee-title"
                sx={{
                  marginLeft: '3px',
                  fontSize: '24px !important',
                  fontStyle: 'normal',
                  fontWeight: '500'
                }}
              >
                Tickets
              </Stack>
              <Stack display={'flex'} flexDirection={'row'}>
                <Stack>
                  <Box
                    height="100%"
                    sx={{
                      borderRadius: 'var(--36px, 36px)',
                      border: '1px solid var(--Borders-Light-Grey, #d4dbe5)',
                      background: 'var(--Background-White, #FFF)',
                      cursor: 'pointer'
                    }}
                    className="Box_location"
                    onClick={() => setVisible(!visible)}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      marginTop="3px"
                      paddingLeft="1rem"
                      paddingRight={isAdminUser ? '0rem' : '0.8rem'}
                    >
                      <span>
                        {localStorage.getItem('location') == ''
                          ? 'All'
                          : localStorage.getItem('location')}
                      </span>
                      {isAdminUser ? (
                        <span>
                          <img src={DropDownArrow} alt="" />
                        </span>
                      ) : (
                        <></>
                      )}
                    </Stack>
                    {isAdminUser ? (
                      <Stack
                        ref={visibleRef}
                        display={visible ? 'block' : 'none'}
                        className="ticket-assigneemenu1"
                        bgcolor="white"
                        position="absolute"
                        zIndex="1"
                        boxShadow="0px 0px 10px rgba(0,0,0,0.1)"
                      >
                        <Stack className="ticket-asssignee-container-layout">
                          <MenuItem
                            sx={menuItemStyles}
                            onClick={() => (
                              setVisible(false),
                              localStorage.setItem('location', ''),
                              handleOnClose()
                            )}
                          >
                            All
                          </MenuItem>

                          <MenuItem
                            sx={menuItemStyles}
                            onClick={() => (
                              setVisible(false),
                              localStorage.setItem('location', 'patna'),
                              handleOnClose()
                            )}
                          >
                            Patna
                          </MenuItem>
                          <MenuItem
                            sx={menuItemStyles}
                            onClick={() => (
                              setVisible(false),
                              localStorage.setItem('location', 'ranchi'),
                              handleOnClose()
                            )}
                          >
                            Ranchi
                          </MenuItem>
                        </Stack>
                      </Stack>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Stack>
                <Stack>
                  <DownloadAllTickets />
                </Stack>
                <Stack
                  sx={{
                    marginTop: '5px',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setIsSwitchView(!isSwitchView);
                    navigate('/switchView');
                  }}
                >
                  <LightTooltip title="Switch View">
                    <img
                      src={ToggleIcon}
                      alt="switch View"
                      style={{
                        fill: 'blue'
                      }}
                    />
                  </LightTooltip>
                </Stack>
                {/* <Stack
                  sx={{
                    marginTop: '5px',
                    color: '#000',
                    fontFamily: 'Outfit,sanserif',
                    fontSize: '14px'
                  }}
                > 
                  Switch view
                </Stack> */}
              </Stack>
            </Box>

            <Box display={'flex'} flexDirection={'column'}>
              <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                gap={'10px'}
              >
                <Stack width={'95%'} position={'relative'}>
                  <span className="search-icon">
                    {' '}
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    value={searchName !== 'undefined' ? searchName : ''}
                    className="search-input"
                    placeholder=" Search..."
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                  />
                </Stack>
                {/* <Stack
                  sx={{
                    marginTop: '10px',
                    marginRight: '-10px',
                    width: '24px',
                    height: '24px'
                  }}
                >
                  <img src={AuditFilterIcon} alt="Audit Filter" />
                </Stack> */}
                <Stack marginRight={'-10px'}>
                  {localStorage.getItem('ticketType') === 'Admission' ? (
                    <TicketFilter setPage={setPage} />
                  ) : localStorage.getItem('ticketType') === 'Diagnostics' ? (
                    <TicketFilterDiago setPage={setPage} />
                  ) : localStorage.getItem('ticketType') === 'Follow-Up' ? (
                    <TicketFilterFollowup setPage={setPage} />
                  ) : (
                    <TicketFilter setPage={setPage} />
                  )}
                </Stack>
              </Box>
              <Box
                sx={{
                  fontFamily: `Outfit,sanserif`,
                  fontSize: '13px',
                  color: '#647491'
                }}
              >
                {searchError && <div>{searchError}</div>}
              </Box>
            </Box>

            {/* <Stack direction="row" spacing={1}>
            <TextField
              sx={{ bgcolor: '#f5f7f5', p: 1, borderRadius: 1 }}
              size="small"
              fullWidth
              placeholder="Search Leads"
              id="outlined-start-adornment"
              variant="standard"
              helperText={searchError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              // onChange={handleSeachName}
              onKeyDown={handleSearchKeyPress}
            />
            <TicketFilter setPage={setPage} />
          </Stack> */}
          </Box>

          <Box
            position="relative"
            p={1}
            height={'71vh'}
            sx={{
              overflowY: 'scroll',
              '&::-webkit-scrollbar ': {
                display: 'none'
              }
            }}
          >
            {tickets.length > 0 ? (
              tickets.map((item: iTicket, index: number) => (
                <TicketCard key={item._id} patientData={item} index={index} />
              ))
            ) : emptyDataText !== '' ? (
              // <Alert
              //   sx={{
              //     marginTop: '40px',
              //     height: '25vh',
              //     display: 'flex',
              //     justifyContent: 'center',
              //     alignItems: 'center'
              //   }}
              //   severity="error"
              // >
              //   NO DATA FOUND
              // </Alert>
              <Box className="NotFound-Page">
                <img src={NotFoundIcon} />
                <Stack className="NotFound-text">No Ticket Found</Stack>
                <Stack className="NotFound-subtext">No Ticket Found</Stack>
              </Box>
            ) : (
              [0, 1, 2, 3, 4, 5].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  sx={{ borderRadius: 2, my: 1 }}
                  width="100%"
                  height="20%"
                />
              ))
            )}
          </Box>

          <Box>
            <CustomPagination
              handlePagination={handlePagination}
              pageCount={pageCount}
              page={pageNumber}
            />
          </Box>
        </Box>

        <Box bgcolor="#F6F7F9" width="73%">
          {currentRoute ? <DefaultScreen /> : <Outlet />}
        </Box>
        <Box>
          {/* <Modal
            open={showReminderModal}
          // onClose={() => handleCloseModal()}
          >
            <Box
              sx={{
                position: 'absolute',
                bgcolor: 'white',
                width: '600px',
                height: '400px',
                top: '50%',
                left: '50%',
                border: '0px solid transparent',
                borderRadius: '8px',
                transform: 'translate(-50%, -50%)',
                padding: '10px'
              }}
            >
              <div
                onClick={handleCloseModal}
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  cursor: 'pointer'
                }}
              >
                <CloseIcon fontSize="large" />
              </div>
              <div className="buzz-animation">
                <NotificationsActiveIcon sx={{ fontSize: '80px' }} />
              </div>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                {ticketReminderPatient && (
                  <Typography>{`Reminder for ${(
                    ticketReminderPatient?.consumer[0]?.firstName || 'N/A'
                  ).toUpperCase()} `}</Typography>
                )}{' '}
                <Typography
                  fontSize={'18px'}
                  fontWeight={'600'}
                  margin={'10px'}
                >
                  {alarmReminderedList[0]?.title.toUpperCase() || 'N/A'}
                </Typography>
                <Typography margin={'12px'}>
                  {alarmReminderedList[0]?.description || 'N/A'}
                </Typography>
                <Chip
                  size="medium"
                  variant="outlined"
                  color="primary"
                  label={dayjs(alarmReminderedList[0]?.date).format(
                    'DD/MMM/YYYY hh:mm A '
                  )}
                />
              </Box>
            </Box>
          </Modal> */}
        </Box>
        <Box>
          {/* <Modal
            open={showCallReschedulerModal}
          // onClose={() => handleCloseModal()}
          >
            <Box
              sx={{
                position: 'absolute',
                bgcolor: 'white',
                width: '600px',
                height: '400px',
                top: '50%',
                left: '50%',
                border: '0px solid transparent',
                borderRadius: '8px',
                transform: 'translate(-50%, -50%)',
                padding: '10px'
              }}
            >
              <div
                onClick={handleCloseCallReschedulerModal}
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  cursor: 'pointer'
                }}
              >
                <CloseIcon fontSize="large" />
              </div>
              <div className="buzz-animation">
                <NotificationsActiveIcon sx={{ fontSize: '80px' }} />
              </div>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                {ticketCallReschedulerPatient && (
                  <Typography>{`Call Rescheduler for ${(
                    ticketCallReschedulerPatient?.consumer[0]?.firstName ||
                    'N/A'
                  ).toUpperCase()} `}</Typography>
                )}{' '}
                <Typography
                  fontSize={'18px'}
                  fontWeight={'600'}
                  margin={'10px'}
                >
                  {alarmCallReschedulerList[0]?.selectedLabels
                    ? alarmCallReschedulerList[0].selectedLabels
                      .map((label) => label.label)
                      .join(', ')
                      .toUpperCase()
                    : 'N/A'}
                </Typography>
                <Typography margin={'12px'}>
                  {alarmCallReschedulerList[0]?.description || 'N/A'}
                </Typography>
                <Chip
                  size="medium"
                  variant="outlined"
                  color="primary"
                  label={dayjs(alarmCallReschedulerList[0]?.date).format(
                    'DD/MMM/YYYY hh:mm A '
                  )}
                />
              </Box>
            </Box>
          </Modal> */}
        </Box>

        {/* <CustomSpinLoader open={loaderOn} /> */}
      </Box>
      <ExpandedModal />
      <ExpandedSmsModal />
      <ExpandedPhoneModal />
    </>
  );
};

export default Ticket;
