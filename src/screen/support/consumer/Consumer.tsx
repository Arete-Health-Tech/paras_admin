import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getConsumerTicketsHandler,
  searchConsumerHandler
} from '../../../api/consumer/consumerHandler';
import { uploadAndSendEstimateHandler } from '../../../api/estimate/estimateHandler';
import useConsumerStore from '../../../store/consumerStore';
import useEventStore from '../../../store/eventStore';
import CreatePrescription from '../prescription/CreatePrescription';
import BackHeader from '../widgets/BackHeader';
import Styles from './Consumer.module.css';
import { apiClient } from '../../../api/apiClient';
import UserAddIcon from '../../../assets/user-add.svg';
import BackArrow from '../../../assets/arrow-leftBlue.svg';
import { useNavigate } from 'react-router-dom';
import useServiceStore from '../../../store/serviceStore';
import ShowPrescription from '../../ticket/widgets/ShowPrescriptionModal';
import { iTicket } from '../../../types/store/ticket';
import HistoryTicket from './HistoryTicket';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Consumer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  age: string;
  dob: string;
  gender: string;
  uid: string;
}

const Consumer = () => {
  const [value, setValue] = useState(0);

  const { consumerHistory, searchResults, registerUhid } = useConsumerStore();
  const { setSnacks } = useEventStore();
  const { id } = useParams();
  console.log(id, 'id');
  const [consumerData, setConsumerData] = useState<Consumer | null>(null);
  const navigate = useNavigate();
  const UploadComp = ({ id }: { id: string }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const uploadHandler = async () => {
      if (!file) return;
      setLoading(true);
      await uploadAndSendEstimateHandler(file, id);
      setSnacks('File sent to customer', 'success');
      setFile(null);
      setLoading(false);
    };

    // console.log(
    //   consumerHistory, "previous data");
    return (
      <>
        {file ? (
          <>
            <Button
              disabled={loading}
              size="small"
              variant="contained"
              onClick={uploadHandler}
            >
              Send
            </Button>
            <Typography variant="caption">{file?.name}</Typography>
          </>
        ) : (
          <Button size="small" variant="contained" component="label">
            Upload Estimate
            <input
              hidden
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files![0])}
              type="file"
            />
          </Button>
        )}
      </>
    );
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

  useEffect(() => {
    (async function () {
      if (id) {
        await getConsumerTicketsHandler(id);
        await searchConsumerHandler(id);
      }
    })();

    const getConsumer = async () => {
      const response = await apiClient.get('/consumer/findConsumer?', {
        params: { search: registerUhid }
      });
      // console.log(response,"response");
      setConsumerData(response.data);
      if (response.data) {
        sessionStorage.setItem('consumerData', JSON.stringify(response.data));
      }
    };
    const fetchData = async () => {
      const storedData = getStoredConsumer();
      if (storedData) {
        // console.log('Using stored data:', storedData);
        setConsumerData(storedData);
      } else {
        await getConsumer();
      }
    };

    fetchData();
  }, []);

  const getStoredConsumer = () => {
    const storedData = sessionStorage.getItem('consumerData');
    return storedData ? JSON.parse(storedData) : null;
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Box>
      {/* <BackHeader title="Patient" /> */}
      <Stack className={Styles.consumer_title}>
        <Stack
          className={Styles.back_arrow}
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={BackArrow} alt="back" />
        </Stack>
        <Stack display={'flex'} flexDirection={'column'} gap={'4px'}>
          <Stack className={Styles.title_up}>
            {consumerData && (
              <Stack className={Styles.title_name}>
                {consumerData.firstName}{' '}
                {consumerData.lastName && consumerData.lastName}
              </Stack>
            )}
            <Stack display={'flex'} flexDirection={'row'} gap={'4px'}>
              {consumerData && consumerData.gender && (
                <Stack className={Styles.title_gen}>
                  {consumerData.gender}
                </Stack>
              )}
              {consumerData && consumerData.age && (
                <Stack className={Styles.title_Age}>{consumerData.age}</Stack>
              )}
            </Stack>
          </Stack>
          <Stack className={Styles.title_bot}>
            {consumerData && (
              <Stack className={Styles.title_uhid}>#{consumerData.uid}</Stack>
            )}
          </Stack>
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
            label="Prescription"
            sx={{
              fontSize: '14px',
              fontFamily: 'Outfit,san-serif',
              textTransform: 'capitalize'
            }}
          />
          <Tab
            label={`History (${
              consumerHistory.length > 0 ? consumerHistory.length : '0'
            })`}
            sx={{
              fontSize: '14px',
              fontFamily: 'Outfit,san-serif',
              textTransform: 'capitalize'
            }}
          />
        </Tabs>
      </Stack>
      <Box>
        <TabPanel value={value} index={1}>
          <Stack marginBottom={'150px'} margin={'0 6px'}>
            <HistoryTicket consumerData={consumerData} />
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={0}>
          <CreatePrescription />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Consumer;
