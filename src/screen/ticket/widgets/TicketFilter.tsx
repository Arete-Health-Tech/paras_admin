import { ClearAll, Difference, FilterList } from '@mui/icons-material';
import {
  Badge,
  BadgeProps,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useTicketStore from '../../../store/ticketStore';
import { getStagesHandler } from '../../../api/stages/stagesHandler';

import { iTicketFilter } from '../../../types/store/ticket';
import { getRepresntativesHandler } from '../../../api/representive/representativeHandler';
import {
  selectedFiltersReducer,
  ticketFilterTypes
} from '../ticketStateReducers/filter';
import { filterActions } from '../ticketStateReducers/actions/filterAction';
import { NAVIGATE_TO_TICKET, UNDEFINED } from '../../../constantUtils/constant';
import {
  getAuditFilterTicketsHandler,
  getTicketHandler
} from '../../../api/ticket/ticketHandler';
import useUserStore from '../../../store/userStore';
import { apiClient } from '../../../api/apiClient';
import { validateTicket } from '../../../api/ticket/ticket';
import '../singleTicket.css';
import AuditFilterIcon from '../../../assets/commentHeader.svg';
import { Tooltip, TooltipProps, Zoom, tooltipClasses } from '@mui/material';
import useReprentativeStore from '../../../store/representative';

const drawerWidth = 450;
export const ticketFilterCount = (
  selectedFilters: iTicketFilter,
  admissionType: string[],
  diagnosticsType: string[],
  dateRange: string[],
  statusType: string[],
  filteredLocation: string,
  isPatnaUser: boolean,
  isRanchiUser: boolean,
  followUp: Date | null
) => {
  const stageListCount = selectedFilters['stageList'].length;
  const representativeCount = selectedFilters['representative'] ? 1 : 0;

  const admissionCount = admissionType ? admissionType.length : 0;
  const diagnosticsCount = diagnosticsType ? diagnosticsType.length : 0;
  const DateCount = dateRange[0] && dateRange[1] ? 1 : 0;

  const resultCount = selectedFilters['results'] ? 1 : 0;
  const statusCount = statusType ? statusType.length : 0;
  const followUpCount = followUp !== null ? 1 : 0;

  let locationCount = 0;
  if (!isPatnaUser && !isRanchiUser) {
    locationCount =
      filteredLocation == 'Patna' || filteredLocation == 'Ranchi' ? 1 : 0;
  } else {
    locationCount = 0;
    console.log('good');
  }

  const total =
    stageListCount +
    representativeCount +
    resultCount +
    admissionCount +
    diagnosticsCount +
    DateCount +
    statusCount +
    locationCount +
    followUpCount;
  return total;
};
const TicketFilter = (props: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { ticketID } = useParams();
  const navigate = useNavigate();
  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 7,
      padding: '0 4px',
      color: '#FFFFFF',
      backgroundColor: '#0566FF'
    }
  }));
  const ClearBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -0,
      top: 7,
      padding: '0 4px',
      color: '#FFFFFF',
      backgroundColor: 'red'
    }
  }));
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

  const {
    setFilterTickets,
    setPageNumber,
    isSwitchView,
    isAuditorFilterOn,
    setIsAuditorFilterOn,
    setFilteredLocation,
    filteredLocation,
    setDownloadDisable
  } = useTicketStore();

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [admissionType, setAdmissionType] = React.useState<string[]>([]);
  const [statusType, setStatusType] = React.useState<string[]>([]);
  const [result, setResult] = React.useState('');
  const [diagnosticsType, setDiagnosticsType] = React.useState<string[]>(
    () => []
  );
  // const [speciality, setSpeciality] = React.useState<string[]>(() => []);
  const [stagesLabel, setStagesLabels] = React.useState<any>([]);
  const [representativeLabel, setRepresentativeLabel] = React.useState<any>([]);

  const [selectedFilters, dispatchFilter] = useReducer(
    selectedFiltersReducer,
    initialFilters
  );
  // const [startDate, setStartDate] = React.useState<string>('');
  // const [endDate, setEndDate] = React.useState<string>('');
  const [followUp, setFollowUp] = React.useState<Date | null>(null);
  const [dateRange, setDateRange] = React.useState<string[]>(['', '']);
  const [currentReperesentative, setCurrentRepresentative] = useState('');
  const [filterCount, setFilterCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValueLost, setSelectedValueLost] = useState(null);

  const { user } = useUserStore.getState();
  const phoneNumber = user?.phone;

  // const { representative } = useReprentativeStore();

  const [isPatnaUser, SetIsPatnaUser] = useState(false);
  const [isRanchiUser, SetIsRanchiUser] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const fetchedRepresentative = await getRepresntativesHandler();
        const patnaFound = fetchedRepresentative?.some(
          (rep) =>
            rep.phone === phoneNumber &&
            rep.Unit === '66fa9666589c46100af402c9' &&
            rep.role === 'ADMIN'
        );
        const ranchiFound = fetchedRepresentative?.some(
          (rep) =>
            rep.phone === phoneNumber &&
            rep.Unit === '66f7bdca783f9aaba1099ce4' &&
            rep.role === 'ADMIN'
        );

        if (patnaFound) {
          SetIsPatnaUser(true);
          setFilteredLocation('patna');
        } else if (ranchiFound) {
          SetIsRanchiUser(true);
          setFilteredLocation('Ranchi');
        } else {
          setIsAdminUser(true);
          SetIsPatnaUser(false);
          SetIsRanchiUser(false);
          setFilteredLocation('');
        }
      } catch (error) {
        console.error('Error fetching representatives:', error);
      }
    })();
  }, []);

  const handleStageList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (selectedFilters.stageList.includes(value)) {
      const modifiedStageList = selectedFilters.stageList;
      modifiedStageList.splice(modifiedStageList.indexOf(value), 1);

      dispatchFilter({
        type: filterActions.STAGES,
        payload: [...modifiedStageList]
      });
      return;
    }
    dispatchFilter({
      type: filterActions.STAGES,
      payload: [...selectedFilters.stageList, value]
    });
  };

  const handleRepresentative = (e: any) => {
    const value = e.target.value;
    if (value) {
      setCurrentRepresentative(value);
      dispatchFilter({ type: filterActions.REPRESENTATIVE, payload: value });
    }
  };

  const handleLocation = (
    event: React.MouseEvent<HTMLElement>,
    location: string
  ) => {
    setFilteredLocation(location);
  };

  const handleAdmissionType = (
    event: React.MouseEvent<HTMLElement>,
    newAdmission: string[]
  ) => {
    setAdmissionType(newAdmission);

    dispatchFilter({
      type: filterActions.ADMISSIONTYPE,
      payload: newAdmission
    });
  };

  const handleStatusType = (
    event: React.MouseEvent<HTMLElement>,
    Status: string[]
  ) => {
    setStatusType(Status);

    dispatchFilter({
      type: filterActions.STATUS,
      payload: Status
    });
  };

  const handleDiagnosticsType = (
    event: React.MouseEvent<HTMLElement>,
    newDiagnostics: string[]
  ) => {
    setDiagnosticsType(newDiagnostics);
    dispatchFilter({
      type: filterActions.DIAGNOSTICSTYPE,
      payload: newDiagnostics
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    setDateRange((prevState) => [startDate, prevState[1]]);
    dispatchFilter({
      type: filterActions.DATERANGE,
      payload: JSON.stringify([startDate, dateRange[1]])
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value;
    setDateRange((prevState) => [prevState[0], endDate]);
    dispatchFilter({
      type: filterActions.DATERANGE,
      payload: JSON.stringify([dateRange[0], endDate])
    });
  };

  const handleFollowUpToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (followUp == null) {
      setFollowUp(new Date(newValue!));
    } else {
      setFollowUp(null);
    }
  };

  const handleFollowUp = (
    event: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => {
    console.log({ value });
    if (followUp == null) {
      const dateValue = value ? new Date(value) : null;
      setFollowUp(dateValue);
      dispatchFilter({
        type: filterActions.FOLLOWUP,
        payload: dateValue?.toISOString()
      });
    } else {
      const dateValue = value ? new Date(value) : null;
      setFollowUp(null);
      dispatchFilter({
        type: filterActions.FOLLOWUP,
        payload: dateValue
      });
    }
  };
  console.log({ followUp });

  // const handleToggleChange = (event, newValue) => {
  //   setSelectedValue(newValue);
  // };

  const handleResult = (e: any) => {
    const value = e.target.value;

    if (value === 'Won') {
      setResult(value);
      dispatchFilter({
        type: filterActions.RESULTS,
        payload: '65991601a62baad220000001'
      });
    } else if (value === 'Lose') {
      setResult(value);
      dispatchFilter({
        type: filterActions.RESULTS,
        payload: '65991601a62baad220000002'
      });
    } else if (value === null) {
      setResult(value);
      dispatchFilter({
        type: filterActions.RESULTS,
        payload: null
      });
    }
    setResult('');
  };

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  // const departments = [
  //   {
  //     label: 'General and Laparoscopic',
  //     id: '63ce58474dca242deb6a4d41'
  //   },
  //   {
  //     label: 'Surgical oncology ',
  //     id: '63ce59964dca242deb6a4d4c'
  //   },
  //   {
  //     label: 'GI surgery',
  //     id: '63de1ab09c1af160749af88d'
  //   },
  //   { label: 'Neurology', id: '63de1a5d9c1af160749af884' }
  // ];

  React.useEffect(() => {
    (async () => {
      const fetchedStageData = await getStagesHandler();
      const fetchedRepresentative = await getRepresntativesHandler();

      const transformStages = fetchedStageData.map(({ _id, name }) => {
        return {
          id: _id,
          label: name
        };
      });

      const assignRepr = fetchedRepresentative?.filter(
        (rep) => rep.role === 'REPRESENTATIVE'
      );
      // const transformRepresentative = fetchedRepresentative.map(
      const transformRepresentative = assignRepr.map(
        ({ _id, firstName, lastName }) => {
          const labelName = `${firstName} ${lastName}`;
          return {
            id: _id,
            label: labelName
          };
        }
      );
      setRepresentativeLabel(transformRepresentative);
      setStagesLabels(transformStages);
    })();
  }, []);

  const handleApplyFilter = async () => {
    try {
      setDownloadDisable(true);

      setIsFilterOpen(false);
      setPageNumber(1);
      setFilterTickets(selectedFilters);

      await getTicketHandler(UNDEFINED, 1, 'false', selectedFilters);

      setFilterCount(
        ticketFilterCount(
          selectedFilters,
          admissionType,
          diagnosticsType,
          dateRange,
          statusType,
          filteredLocation,
          isPatnaUser,
          isRanchiUser,
          followUp
        )
      );

      props.setPage(1);

      if (ticketID) {
        await validateTicket(ticketID);
        const ticketType = localStorage.getItem('ticketType');
        const basePath =
          ticketType === 'Admission'
            ? '/admission/'
            : ticketType === 'Diagnostics'
            ? '/diagnostics/'
            : ticketType === 'Follow-Up'
            ? '/follow-up/'
            : '/ticket/';

        navigate(basePath);
      }

      console.log('Filter data:', selectedFilters);
    } catch (error) {
      console.error('Error in handleApplyFilter:', error);
      setDownloadDisable(false);
    } finally {
      setDownloadDisable(false);
    }
  };
  const handleApplyFilterOnClear = async () => {
    try {
      setDownloadDisable(true);

      setIsFilterOpen(false);
      setPageNumber(1);
      setFilterTickets(selectedFilters);

      await getTicketHandler(UNDEFINED, 1, 'false', selectedFilters);

      setFilterCount(0);
      props.setPage(1);

      if (ticketID) {
        await validateTicket(ticketID);
        const ticketType = localStorage.getItem('ticketType');
        const basePath =
          ticketType === 'Admission'
            ? '/admission/'
            : ticketType === 'Diagnostics'
            ? '/diagnostics/'
            : ticketType === 'Follow-Up'
            ? '/follow-up/'
            : '/ticket/';

        navigate(basePath);
      }

      console.log('Filter data:', selectedFilters);
    } catch (error) {
      console.error('Error in handleApplyFilter:', error);
      setDownloadDisable(false);
    } finally {
      setDownloadDisable(false);
    }
  };

  const handleClearFilter = async () => {
    dispatchFilter({ type: filterActions.STAGES, payload: [] });
    dispatchFilter({ type: filterActions.REPRESENTATIVE, payload: null });
    dispatchFilter({ type: filterActions.ADMISSIONTYPE, payload: [] });
    dispatchFilter({ type: filterActions.DIAGNOSTICSTYPE, payload: [] });
    dispatchFilter({ type: filterActions.DATERANGE, payload: [] });
    dispatchFilter({ type: filterActions.RESULTS, payload: null });
    dispatchFilter({ type: filterActions.STATUS, payload: [] });
    dispatchFilter({ type: filterActions.FOLLOWUP, payload: null });

    setCurrentRepresentative('');
    setFilterCount(
      ticketFilterCount(
        selectedFilters,
        admissionType,
        diagnosticsType,
        dateRange,
        statusType,
        filteredLocation,
        isPatnaUser,
        isRanchiUser,
        followUp
      )
    );
    setFilterCount(0);
    setPageNumber(1);
    setSelectedValue(null);
    setSelectedValueLost(null);
    setResult(' ');
    setFollowUp(null);
    setAdmissionType((prev) => []);
    setStatusType((prev) => []);
    setDiagnosticsType((prev) => []);
    setDateRange(['', '']);
    if (isPatnaUser) {
      setFilteredLocation('patna');
    } else if (isRanchiUser) {
      setFilteredLocation('Ranchi');
    } else {
      setFilteredLocation('');
    }
  };

  useEffect(() => {
    handleClearFilter();
    handleApplyFilterOnClear();
  }, [localStorage.getItem('ticketType')]);

  const handleToggleChange = (event, newValue: any) => {
    setSelectedValue(newValue === selectedValue ? null : newValue);
    setResult(newValue);
    setFilteredLocation('');
  };

  const handleToggleLostChange = (event, newValue: any) => {
    setSelectedValueLost(newValue === selectedValueLost ? null : newValue);
    setResult(newValue);
    setFilteredLocation('');
  };

  // const [isAuditorFilterOn, setIsAuditorFilterOn] = useState(false);
  const handleAuditorFilter = async () => {
    await getAuditFilterTicketsHandler();
    setIsAuditorFilterOn(true);
  };
  const handleClearAuditorFilter = async () => {
    await getTicketHandler(UNDEFINED, 1, 'false', selectedFilters);
    setIsAuditorFilterOn(false);
  };

  return (
    <Box>
      <Stack display={'flex'} flexDirection={'row'} gap={'10px'}>
        <Stack className="AuditorFilterIcon">
          {isAuditorFilterOn ? (
            <LightTooltip
              title="Clear Audit Filter"
              disableInteractive
              placement="top"
              TransitionComponent={Zoom}
            >
              <ClearBadge badgeContent={'x'} color="error">
                <img
                  src={AuditFilterIcon}
                  alt="Audit Filter"
                  onClick={handleClearAuditorFilter}
                />
              </ClearBadge>
            </LightTooltip>
          ) : (
            <LightTooltip
              title="Apply Audit Filter"
              disableInteractive
              placement="top"
              TransitionComponent={Zoom}
            >
              <img
                src={AuditFilterIcon}
                onClick={handleAuditorFilter}
                alt="Audit Filter"
              />
            </LightTooltip>
          )}
        </Stack>
        <IconButton onClick={handleFilterOpen}>
          <StyledBadge
            invisible={filterCount <= 0}
            badgeContent={filterCount}
            // color="primary"
          >
            <FilterList sx={{ color: '#080F1A' }} />
          </StyledBadge>
        </IconButton>
      </Stack>

      <Drawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        anchor={isSwitchView == false ? 'left' : 'right'}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        <Box>
          <Box
            p={2}
            borderBottom={1}
            borderColor="#f3f3f3"
            display="flex"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1}>
              <FilterList sx={{ marginTop: '2px' }} />
              <Stack
                sx={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '20px !important',
                  fontWeight: '500'
                }}
              >
                Add Filter{' '}
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1}>
              <button
                className="filter-btn"
                onClick={handleApplyFilter}
                style={{ fontSize: '14px', borderRadius: '5px' }}
              >
                Apply
              </button>
              {filterCount > 0 && (
                <button
                  className="filter-btn"
                  onClick={handleClearFilter}
                  style={{ fontSize: '14px', borderRadius: '5px' }}
                >
                  Clear Filters <ClearAll />
                </button>
              )}
            </Stack>
          </Box>
          <Box px={1} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box p={2}>
              <Stack
                sx={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Select Stages
              </Stack>
              <FormGroup>
                {stagesLabel.map(({ id, label }) => (
                  <FormControlLabel
                    key={id}
                    control={
                      <Checkbox
                        value={id}
                        onChange={handleStageList}
                        checked={selectedFilters.stageList.includes(id)}
                      />
                    }
                    label={
                      <Stack
                        sx={{
                          fontFamily: 'Outfit,sans-serif',
                          fontSize: '14px'
                        }}
                      >
                        {label}
                      </Stack>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
            <Box py={2} px={4}>
              <Stack
                sx={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Assigned To
              </Stack>
              <Select
                size="medium"
                onChange={handleRepresentative}
                value={currentReperesentative}
                sx={{
                  height: '35px',
                  textTransform: 'capitalize',
                  fontFamily: 'Outfit,sans-serif'
                }}
              >
                {
                  // representativeLabel?.some(rep => rep.role === "REPRESENTATIVE")
                  representativeLabel?.map(({ id, label }, index) => {
                    return (
                      <MenuItem
                        value={id}
                        sx={{
                          textTransform: 'capitalize',
                          fontFamily: 'Outfit,sans-serif'
                        }}
                      >
                        {label}
                      </MenuItem>
                    );
                  })
                }
              </Select>
            </Box>
          </Box>

          <Box px={3}>
            <Stack sx={{ fontFamily: 'Outfit,san-serif', fontWeight: '500' }}>
              Result (This filter cannot be used in combination with any other
              filter, To be used independently only)
            </Stack>
            <ToggleButtonGroup
              color="primary"
              value={result}
              onChange={handleResult}
            >
              <ToggleButton
                value="Won"
                style={{
                  backgroundColor:
                    selectedValue === 'Won' ? '#3949AB14' : 'white',
                  color: selectedValue === 'Won' ? '#3949AB' : 'grey',
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '12px'
                }}
                onClick={handleToggleChange}
              >
                WON
              </ToggleButton>
              <ToggleButton
                value="Lose"
                style={{
                  backgroundColor:
                    selectedValueLost === 'Lose' ? '#3949AB14' : 'white',
                  color: selectedValueLost === 'Lose' ? '#3949AB' : 'grey',
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '12px'
                }}
                onClick={handleToggleLostChange}
              >
                LOST
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {/* <Box px={3}>
              <Stack sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: '500' }}>
                Doctor Appointment Follow-up Date (This filter cannot be used in
                combination with any other filter, To be used independently only)
              </Stack>
              <ToggleButtonGroup
                color="primary"
                value={followUp ? followUp.toISOString() : null} // Convert to string if not null
                onChange={handleFollowUp}
                exclusive // Ensure only one toggle can be selected
              >
                <ToggleButton
                  value={new Date().toISOString()} // Store the date as a string
                  style={{
                    backgroundColor: followUp !== null ? '#3949AB14' : 'white',
                    color: followUp !== null ? '#3949AB' : 'grey',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '12px'
                  }}
                  onClick={handleFollowUpToggleChange}
                >
                  Doctor Appointment Date
                </ToggleButton>
              </ToggleButtonGroup>
            </Box> */}
          <Box p={1} px={3}>
            <Stack sx={{ fontFamily: 'Outfit,san-serif', fontWeight: '500' }}>
              Status
            </Stack>
            <ToggleButtonGroup
              color="primary"
              value={statusType}
              onChange={handleStatusType}
            >
              {/* <ToggleButton value="dnd"
                sx={{
                  fontFamily: "Outfit,sans-serif",
                  fontSize: '12px',
                }}
              >DND
              </ToggleButton> */}
              <ToggleButton
                value="dnp"
                sx={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '11px'
                }}
              >
                DNP
              </ToggleButton>
              <ToggleButton
                value="todayTask"
                sx={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '12px'
                }}
              >
                Today Task
              </ToggleButton>
              <ToggleButton
                value="pendingTask"
                sx={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '12px'
                }}
              >
                Pending
              </ToggleButton>
              <ToggleButton
                value="CallCompleted"
                sx={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '12px'
                }}
              >
                Call Completed
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {localStorage.getItem('ticketType') === 'Admission' && (
            <Box p={1} px={3}>
              <Stack sx={{ fontFamily: 'Outfit,san-serif', fontWeight: '500' }}>
                Admission Type
              </Stack>
              <ToggleButtonGroup
                color="primary"
                value={admissionType}
                onChange={handleAdmissionType}
              >
                <ToggleButton
                  value="Surgery"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  Surgery
                </ToggleButton>
                <ToggleButton
                  value="MM"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  MM
                </ToggleButton>
                <ToggleButton
                  value="DC"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  DC
                </ToggleButton>
                <ToggleButton
                  value="Yes"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  Yes
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
          {localStorage.getItem('ticketType') === 'Diagnostics' && (
            <Box p={1} px={3}>
              <Stack sx={{ fontFamily: 'Outfit,san-serif', fontWeight: '500' }}>
                Diagnotics Type
              </Stack>
              <ToggleButtonGroup
                color="primary"
                value={diagnosticsType}
                onChange={handleDiagnosticsType}
              >
                <ToggleButton
                  value="MRI"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  MRI
                </ToggleButton>
                <ToggleButton
                  value="PET-CT"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  PET-CT
                </ToggleButton>
                <ToggleButton
                  value="CT-Scan"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  CT-Scan
                </ToggleButton>

                <ToggleButton
                  value="Lab"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  Lab
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
          {/* {user?.role === 'ADMIN' && isAdminUser && (
            <Box p={1} px={3}>
              <Stack sx={{ fontFamily: 'Outfit,san-serif', fontWeight: '500' }}>
                Location
              </Stack>
              <ToggleButtonGroup
                color="primary"
                value={filteredLocation}
                // onChange={() => setFilteredLocation('Amritsar')}
                onChange={handleLocation}
              >
                <ToggleButton
                  value="Patna"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  Patna
                </ToggleButton>

                <ToggleButton
                  value="Ranchi"
                  sx={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '12px'
                  }}
                >
                  Ranchi
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )} */}

          <Box p={1} px={3}>
            <Stack sx={{ fontFamily: 'Outfit,san-serif', fontWeight: '500' }}>
              Select Date Range
            </Stack>
            <Stack py={1} direction="row" spacing={2}>
              <Box>
                <Stack
                  sx={{
                    fontFamily: 'Outfit,san-serif',
                    fontSize: '12px',
                    fontWeight: '400'
                  }}
                >
                  Start Date
                </Stack>
                <TextField
                  fullWidth
                  onChange={handleStartDateChange}
                  value={dateRange[0]}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                    style: { fontFamily: 'Outfit,san-serif', fontSize: '14px' }
                  }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0],
                    style: { fontFamily: 'Outfit,san-serif', fontSize: '14px' }
                  }}
                />
              </Box>
              <Box>
                <Stack
                  sx={{
                    fontFamily: 'Outfit,san-serif',
                    fontSize: '12px',
                    fontWeight: '400'
                  }}
                >
                  End Date
                </Stack>
                <TextField
                  fullWidth
                  onChange={handleEndDateChange}
                  value={dateRange[1]}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                    style: { fontFamily: 'Outfit,san-serif', fontSize: '14px' }
                  }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0],
                    min: new Date(dateRange[0]).toDateString().split('T')[0],
                    style: { fontFamily: 'Outfit,san-serif', fontSize: '14px' }
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TicketFilter;
