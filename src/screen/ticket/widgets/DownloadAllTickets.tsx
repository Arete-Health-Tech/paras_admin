/* eslint-disable @typescript-eslint/no-unused-vars */
import { DownloadForOfflineOutlined, Payment } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getDepartmentsHandler } from '../../../api/department/departmentHandler';
import { getDoctorsHandler } from '../../../api/doctor/doctorHandler';
import { getTicketHandler } from '../../../api/ticket/ticketHandler';
import useServiceStore from '../../../store/serviceStore';
import useTicketStore from '../../../store/ticketStore';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { ageSetter } from '../../../utils/ageReturn';
import { UNDEFINED } from '../../../constantUtils/constant';
import useReprentativeStore from '../../../store/representative';
import DownloadAllFileIcon from '../../../../src/assets/DownloadAllFiles.svg';
import { apiClient } from '../../../api/apiClient';
import {
  getAllDownloadTicketDiagontics,
  getAllDownloadTicketFollowUp,
  getAllTicketAdmission
} from '../../../api/ticket/ticket';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useUserStore from '../../../store/userStore';

type Props = {};
const materilaFieldCss = {
  fontSize: '14px',
  color: '#080F1A',
  fontFamily: `"Outfit",sans-serif`
};
const materilaInputFieldCss = {
  fontSize: '14px',
  color: '#080F1A',
  fontFamily: `"Outfit",sans-serif`
};
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

const DownloadAllTickets = (props: Props) => {
  const { doctors, departments, stages, allNotes } = useServiceStore();
  const { user } = useUserStore.getState();

  const [errors, setErrors] = useState({ unit: false, date: false });
  const { representative } = useReprentativeStore();
  console.log({ user });
  const {
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    setDownloadDisable,
    downloadDisable
  } = useTicketStore();
  // const [disable, setDisable] = useState(false);

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

  const doctorSetter = (id: string) => {
    return doctors.find((element) => element._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((element) => element._id === id)?.name;
  };
  const stageSetter = (id: string) => {
    return stages.find((element) => element._id === id)?.name;
  };
  const assigneSetter = (id: string) => {
    return representative.find((element) => element._id === id);
  };
  const noteSetter = (id: string): string[] => {
    const foundItems = allNotes.filter((item) => item.ticket === id);

    const notesArray = foundItems.map(
      (item) => item.text.replace(/<[^>]*>/g, '') // Remove HTML tags
    );

    return notesArray.length > 0 ? notesArray : [];
  };
  const handleAssigne = (assignees: any) => {
    if (!Array.isArray(assignees)) {
      return [];
    }
    let result: string[] = [];

    for (let i = 0; i <= assignees.length; i++) {
      const rep = representative.find((rep) => rep._id === assignees[i]);
      if (rep) {
        // const initials = `${rep.firstName.charAt(0)}${rep.lastName.charAt(0)}`;
        const fullName = `${rep.firstName} ${rep.lastName}`;
        result.push(fullName);
      }
    }
    return result;
  };

  function subStageName(code: number): string {
    switch (code) {
      case 1:
        return 'Send Engagement';
      case 2:
        return 'Create Estimation';
      case 3:
        return 'Call Patient';
      case 4:
        return 'Add Call Summary';
      default:
        return 'Unknown';
    }
  }
  const returnedDate = (date: string | null | Date) => {
    return dayjs(date).format('DD/MMM/YYYY');
  };

  // From here this is used for select download the data with the date

  useEffect(() => {
    setAnchorEl(null);
  }, [localStorage.getItem('ticketType')]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    if (newDate) {
      console.log(newDate.format('YYYY-MM')); // Print selected date
      setErrors((prev) => ({ ...prev, date: false }));
    }
  };

  const downloadData = async () => {
    if (!selectedDate) {
      setErrors({
        date: !selectedDate,
        unit: !selectedUnit
      });
      return;
    }

    try {
      setDownloadDisable(true);

      const ticketType = localStorage.getItem('ticketType');
      let sortedTickets = [];
      if (selectedUnit == 'All') {
        if (ticketType === 'Admission') {
          sortedTickets = await getAllTicketAdmission(selectedDate, user?.Unit);
        } else if (ticketType === 'Diagnostics') {
          sortedTickets = await getAllDownloadTicketDiagontics(
            selectedDate,
            user?.Unit
          );
        } else if (ticketType === 'Follow-Up') {
          sortedTickets = await getAllDownloadTicketFollowUp(
            selectedDate,
            user?.Unit
          );
        } else {
          sortedTickets = await getAllTicketAdmission(selectedDate, user?.Unit);
        }
      } else if (selectedUnit == 'Ranchi') {
        const ranchiId = '66f7bdca783f9aaba1099ce4';
        if (ticketType === 'Admission') {
          sortedTickets = await getAllTicketAdmission(selectedDate, ranchiId);
        } else if (ticketType === 'Diagnostics') {
          sortedTickets = await getAllDownloadTicketDiagontics(
            selectedDate,
            ranchiId
          );
        } else if (ticketType === 'Follow-Up') {
          sortedTickets = await getAllDownloadTicketFollowUp(
            selectedDate,
            ranchiId
          );
        }
      } else if (selectedUnit == 'Patna') {
        const patnaId = '66fa9666589c46100af402c9';
        if (ticketType === 'Admission') {
          sortedTickets = await getAllTicketAdmission(selectedDate, patnaId);
        } else if (ticketType === 'Diagnostics') {
          sortedTickets = await getAllDownloadTicketDiagontics(
            selectedDate,
            patnaId
          );
        } else if (ticketType === 'Follow-Up') {
          sortedTickets = await getAllDownloadTicketFollowUp(
            selectedDate,
            patnaId
          );
        }
      }
      await Promise.all([getDoctorsHandler(), getDepartmentsHandler()]);

      const data = sortedTickets?.map((ticket: any, index: number) => {
        return {
          serialNo: index + 1,
          firstName: ticket?.consumer[0]?.firstName,
          lastName:
            ticket?.consumer[0]?.lastName && ticket?.consumer[0]?.lastName,
          uhid: ticket?.consumer[0]?.uid,
          gender: ticket?.consumer[0]?.gender,
          phone: ticket?.consumer[0]?.phone,
          age: Number(ticket?.consumer[0]?.age) || '',
          location: ticket?.specialty ? ticket?.specialty : 'Patna',
          stage: stageSetter(ticket?.stage[0]?._id)
            ? stageSetter(ticket?.stage[0]?._id)
            : '',
          department: departmentSetter(ticket?.prescription[0]?.departments[0]),
          doctor: doctorSetter(ticket?.prescription[0]?.doctor),
          admissionType: ticket.prescription[0].admission
            ? ticket.prescription[0].admission
            : 'Not Advised',
          serviceName: ticket.prescription[0].service
            ? ticket.prescription[0].service.name
            : 'No Advised',
          isPharmacy: ticket?.prescription[0]?.isPharmacy
            ? 'Advised'
            : 'No Advised',
          assigned:
            handleAssigne(ticket?.assigned[0]?._id).join(' ') ||
            ticket?.assigned[0]?.firstName,
          // CTScan: ticket?.prescription[0]?.diagnostics.includes('CT-Scan')
          //   ? 'Yes'
          //   : 'No',
          // LAB: ticket.prescription[0].diagnostics.includes('Lab') ? 'Yes' : 'No',
          // MRI: ticket.prescription[0].diagnostics.includes('MRI') ? 'Yes' : 'No',
          // EEG: ticket.prescription[0].diagnostics.includes('EEG') ? 'Yes' : 'No',
          // EMG: ticket.prescription[0].diagnostics.includes('EMG') ? 'Yes' : 'No',
          // XRAY: ticket.prescription[0].diagnostics.includes('X-RAY')
          //   ? 'Yes'
          //   : 'No',
          // USG: ticket.prescription[0].diagnostics.includes('USG') ? 'Yes' : 'No',
          // PETCT: ticket.prescription[0].diagnostics.includes('PET_CT')
          //   ? 'Yes'
          //   : 'No',
          diagnostics:
            ticket.prescription[0].diagnostics.length > 0
              ? ticket.prescription[0].diagnostics
              : 'Not Advised',
          followUpDate:
            returnedDate(ticket?.prescription[0]?.followUp) ===
              'Invalid Date' ||
            returnedDate(ticket?.prescription[0]?.followUp) === '01/Jan/1970'
              ? 'No Follow Up'
              : returnedDate(ticket?.prescription[0]?.followUp),
          capturedBy:
            ticket?.creator[0]?.firstName + ' ' + ticket?.creator[0]?.lastName,

          prescriptionCreatedAt: ticket.prescription[0]?.created_Date,

          prescriptionLink: ticket?.prescription[0]?.image,
          prescriptionLink1: ticket?.prescription[0]?.image1,
          Lead_disposition: ticket
            ? ticket.result === '65991601a62baad220000001'
              ? 'won'
              : ticket.result === '65991601a62baad220000002'
              ? 'loss'
              : null
            : null,
          // pharmacyStatus: ticket?.pharmacyStatus,
          isEstimateUpload: ticket?.estimateupload[0]?.total > 0 ? 'Yes' : 'No',
          estimateValue: ticket?.estimateupload[0]?.total
            ? ticket?.estimateupload[0]?.total
            : 0,
          PaymentType: ticket?.estimateupload[0]?.paymentType
            ? ticket?.estimateupload[0]?.paymentType
            : 'Not Mentioned',
          date: ticket?.date,
          subStageName: subStageName(ticket?.subStageCode?.code),
          status:
            ticket?.status !== 'dnp' &&
            ticket?.status !== 'dnd' &&
            ticket?.status !== 'CallCompleted' &&
            ticket?.status !== 'RescheduledCall'
              ? ticket.status
              : 'N/A',
          notes: noteSetter(ticket._id),
          Second_opinion_hospital: ticket?.opinion[0]?.hospital,
          Considering_Consultation:
            ticket?.opinion[0]?.type === 'Considering Consultation'
              ? 'Yes'
              : 'No',
          Consulted: ticket?.opinion[0]?.type === 'consulted' ? 'Yes' : 'No',
          we_are_second_opinion:
            ticket?.opinion[0]?.type === 'we are second opinon' ? 'Yes' : 'No',
          Second_opinion_doctor: ticket?.opinion[0]?.doctor,
          Second_opinion_add_info: ticket?.opinion[0]?.additionalInfo,
          Awaiting_test_results:
            ticket?.opinion[0]?.challengeSelected?.includes(
              'Awaiting test results'
            )
              ? 'Yes'
              : 'No',
          Awaiting_TPA_approvals:
            ticket?.opinion[0]?.challengeSelected?.includes(
              'Awaiting TPA approvals'
            )
              ? 'Yes'
              : 'No',
          Bad_Experience: ticket?.opinion[0]?.challengeSelected?.includes(
            'Bad Experience'
          )
            ? 'Yes'
            : 'No',
          Under_MM: ticket?.opinion[0]?.challengeSelected?.includes('Under MM')
            ? 'Yes'
            : 'No',
          Financial_constatints:
            ticket?.opinion[0]?.challengeSelected?.includes(
              'Financial constatints'
            )
              ? 'Yes'
              : 'No',
          Not_happy_with_doctor:
            ticket?.opinion[0]?.challengeSelected?.includes(
              'Not happy with doctor'
            )
              ? 'Yes'
              : 'No',
          Lead_Probability: `${ticket?.Probability}%`,
          Lead_Rating:
            ticket?.auditorcomment[ticket?.auditorcomment.length - 1]?.ratings,
          Call_disposition:
            ticket?.status === 'dnp' ||
            ticket?.status === 'dnd' ||
            ticket?.status === 'CallCompleted' ||
            ticket?.status === 'RescheduledCall'
              ? ticket?.status
              : 'N/A',
          Call_Recording:
            ticket?.phoneData[ticket?.phoneData.length - 1]?.time ||
            'Not Contacted yet',
          Last_Activity_Date: ticket?.lastActivity,
          lostReasons: ticket?.patientStatus[0]?.dropReason
        };
      });

      const csv = Papa.unparse(data);
      const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      FileSaver.saveAs(
        csvBlob,
        `${dayjs(new Date()).format('DD:MM:YY')}Data.csv`
      );
      toast.success('Download Successful');
    } catch (error) {
      console.error(
        'Error generating CSV:  Please Contact Octa Admin for Download Data',
        error
      );
      toast.error(
        'Error generating CSV: Check Your Internet Connectivity if still facing issue while Downloading - Please Contact Octa Admin for Download Data)'
      );
    } finally {
      setDownloadDisable(false);
    }
    setDownloadDisable(false);
  };
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  const handleUnitChange = (event: SelectChangeEvent<string>) => {
    setSelectedUnit(event.target.value);
    setErrors((prev) => ({ ...prev, unit: false })); // Clear error on selection
  };
  return (
    <Box p={1} px={2}>
      {/* <LightTooltip
        title={!downloadDisable ? 'Download All Data' : 'Downloading....'}
      > */}
      <Stack style={{ borderRadius: '12px' }}>
        {/* Button to open dropdown */}
        <button
          onClick={handleClick}
          style={{ border: 'none', background: 'transparent', width: '20px' }}
        >
          <img src={DownloadAllFileIcon} alt="Download All Data" />
        </button>

        {/* Popover dropdown for DatePicker */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          sx={{ borderRadius: '24px' }}
        >
          <Box
            display={'flex'}
            width={'250px'}
            flexDirection={'column'}
            gap={'15px'}
            sx={{
              padding: '30px 20px',
              borderRadius: '16px'
            }}
          >
            {user?.role == 'ADMIN' && user?.Unit == null && (
              <FormControl fullWidth size="small">
                <InputLabel id="unit-select-label" sx={materilaFieldCss}>
                  Select Unit
                </InputLabel>
                <Select
                  labelId="unit-select-label"
                  id="unit-select"
                  value={selectedUnit}
                  label="Select Unit"
                  sx={materilaInputFieldCss}
                  onChange={handleUnitChange}
                >
                  <MenuItem value="All" sx={materilaInputFieldCss}>
                    All
                  </MenuItem>
                  <MenuItem value="Ranchi" sx={materilaInputFieldCss}>
                    Ranchi
                  </MenuItem>
                  <MenuItem value="Patna" sx={materilaInputFieldCss}>
                    Patna
                  </MenuItem>
                </Select>
                {errors.unit && (
                  <Stack sx={{ fontSize: '12px', color: 'red' }}>
                    Please select a unit.
                  </Stack>
                )}
              </FormControl>
            )}
            <Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{ textField: { size: 'small' } }}
                  label={'MM/YYYY'}
                  views={['month', 'year']}
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
              {errors.date && (
                <Stack sx={{ fontSize: '12px', color: 'red' }}>
                  Please select a Month.
                </Stack>
              )}
            </Stack>
            <Stack
              style={{
                padding: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'outFit,san-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                color: '#0566FF',
                border: '1.5px solid #0566FF',
                borderRadius: '4px'
              }}
              onClick={downloadData}
            >
              Download
              {/* <img src={DownloadAllFileIcon} alt="Download All Data" /> */}
            </Stack>
          </Box>
        </Popover>
      </Stack>
      {/* </LightTooltip> */}
    </Box>
  );
};

export default DownloadAllTickets;
