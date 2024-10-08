import {
  Box,
  Button,
  Modal,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import Styles from './Consumer.module.css';
import useServiceStore from '../../../store/serviceStore';
import { useEffect, useState } from 'react';
import useConsumerStore from '../../../store/consumerStore';
import React from 'react';
import { getRepresntativesHandler } from '../../../api/representive/representativeHandler';
import useReprentativeStore from '../../../store/representative';
import { FirstName } from 'aws-sdk/clients/finspacedata';
import SearchDefault from './../../../assets/Amico Medical Prescription (1) 1.svg';
import CloseModalIcon from './../../../assets/Group 48095853.svg';
import DocumentDownload from './../../../assets/document-download.svg';
import FileSaver from 'file-saver';
import { image } from 'pdfkit/js/mixins/images';
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

const HistoryTicket = ({ consumerData }) => {
  const { representative } = useReprentativeStore();
  const { consumerHistory } = useConsumerStore();
  const { doctors, departments } = useServiceStore();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);

  const handleOpen = (image, image1) => {
    console.log(image);
    console.log(image1);
    setSelectedImage(image);
    setSelectedImage1(image1);
    setOpen(true);
  };
  const [value, setValue] = useState(0);
  const handleClose = () => setOpen(false);

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
  const fetchDepartmentName = (id: any) => {
    if (!id) return 'Unknown Department';
    const specificDepartment = departments?.find((dep) => dep._id === id);
    let departmentName = (specificDepartment?.name ?? 'Unknown Department')
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return departmentName;
  };

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
  return (
    <>
      {consumerHistory && consumerHistory.length > 0 ? (
        <>
          {consumerHistory.map((history) => {
            return (
              <React.Fragment key={history._id}>
                <Box my={1.5} className={Styles.History_consumer}>
                  <Stack className={Styles.History_consumer_up}>
                    <Stack className={Styles.History_consumer_up1}>
                      {consumerData && (
                        <Stack className={Styles.History_consumer_name}>
                          {' '}
                          {consumerData.firstName}{' '}
                          {consumerData.lastName && consumerData.lastName}
                        </Stack>
                      )}
                      <Stack className={Styles.History_consumer_gen_age}>
                        {consumerData && consumerData.gender && (
                          <Stack className={Styles.History_consumer_gen}>
                            {consumerData.gender}
                          </Stack>
                        )}
                        {/* {dayjs(history.consumer.dob).toNow(true)} */}
                        {consumerData && consumerData.age && (
                          <Stack className={Styles.History_consumer_age}>
                            {consumerData.age}
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                    {consumerData && (
                      <Stack className={Styles.History_consumer_up2}>
                        #{consumerData.uid}
                      </Stack>
                    )}
                  </Stack>

                  {history?.prescription && (
                    <Stack className={Styles.History_consumer_dep}>
                      {fetchDoctorName(history.prescription.doctor)} {'('}
                      {fetchDepartmentName(
                        history.prescription.departments?.[0]
                      )}
                      {')'}
                    </Stack>
                  )}
                  {history?.prescription && (
                    <Stack className={Styles.History_consumer_createdDate}>
                      {formatDate(history.prescription.created_Date)}
                    </Stack>
                  )}

                  <Box py={0.7} px={1}>
                    {' '}
                    <Stack className={Styles.border} my={1}></Stack>
                  </Box>

                  <Stack className={Styles.History_consumer_bt}>
                    {history && (
                      <Stack className={Styles.History_consumer_createdDate}>
                        Created by: {getRepresentativeById(history.creator)}
                      </Stack>
                    )}
                    {history.prescription?.image && (
                      <Stack
                        className={Styles.presc}
                        onClick={() =>
                          handleOpen(
                            history?.prescription?.image?.split('?')[0],
                            history?.prescription?.image1?.split('?')[0]
                          )
                        }
                      >
                        View Prescription
                      </Stack>
                    )}
                  </Stack>

                  {/* Modal */}
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Stack
                        direction="row"
                        spacing={1}
                        display="flex"
                        alignItems="center"
                      >
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
                      <Stack
                        position="sticky"
                        top={76}
                        bgcolor="white"
                        zIndex={10}
                      >
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
                                console.error(
                                  'Image failed to load:',
                                  selectedImage1
                                )
                              }
                              style={{
                                width: '100%',
                                height: '62vh',
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
                                height: '62vh',
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
                </Box>
              </React.Fragment>
            );
          })}
        </>
      ) : (
        <>
          <Stack className={Styles.defaultScreen_container}>
            <Stack className={Styles.imG}>
              <img src={SearchDefault} alt="No Department Selected" />
            </Stack>
            <Stack className={Styles.defaultScreen_text}>
              No Previous Ticket History Found
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
};

export default HistoryTicket;
