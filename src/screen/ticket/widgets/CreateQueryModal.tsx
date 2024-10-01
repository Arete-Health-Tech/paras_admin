import { Add, Close } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextareaAutosize,
  TextField
} from '@mui/material';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useServiceStore from '../../../store/serviceStore';
import useUserStore from '../../../store/userStore';
import { iDepartment } from '../../../types/store/service';
import { database } from '../../../utils/firebase';

type Props = {};

const CreateQueryModal = (props: Props) => {
  const [queryTitle, setQueryTitle] = useState('');
  const [queryDepartment, setQueryDepartment] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { departments } = useServiceStore();
  const { ticketID } = useParams();

  const { user } = useUserStore();

  const handleCreateQuery = async () => {
    const message = queryMessage.trim();
    if (message.length === 0) {
      return;
    }
    const newQuery = {
      agentId: user?._id,
      createdAt: Timestamp.fromDate(new Date()),
      departmentId: queryDepartment,
      isReolved: false,
      subject: queryTitle,
      ticketId: ticketID
    };
    const roomDoc = await addDoc(collection(database, 'queries'), newQuery);
    await addDoc(collection(database, 'queries', roomDoc.id, 'messages'), {
      content: message,
      createdAt: Timestamp.fromDate(new Date()),
      sender: 'agent'
    });
    setQueryDepartment((_) => '');
    setQueryTitle((_) => '');
    setIsOpen((_) => false);
  };

  return (
    <Box
      sx={{
        transition: '400ms ease-in-out'
      }}
      p={2}
      borderRadius="10px 10px 0px 0px"
      height={isOpen ? '60%' : '15%'}
      position="sticky"
      bottom={isOpen ? 20 : 1}
      bgcolor="#f1f5f7"
    >
      <Box my={1}>
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          endIcon={isOpen ? <Close /> : <Add />}
        >
          {isOpen ? 'Close' : 'Create New Query'}
        </Button>
      </Box>

      {isOpen && (
        <Stack spacing={2} direction="column" height="100%" p={1}>
          <Autocomplete
            fullWidth
            size="small"
            aria-required={true}
            options={departments}
            onChange={(event, value) => setQueryDepartment((_) => value?._id!)}
            id="combo-box-demo"
            getOptionLabel={(option: iDepartment) => option.name}
            sx={{ width: 400, textTransform: 'capitalize' }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ textTransform: 'capitalize' }}
                label="Select Department"
                value={queryDepartment}
              />
            )}
          />
          <TextField
            value={queryTitle}
            label="Enter Query Title"
            size="small"
            fullWidth
            onChange={(e) => setQueryTitle((_) => e.target.value)}
          />

          <TextareaAutosize
            aria-label="empty textarea"
            onChange={(e) => setQueryMessage((_) => e.target.value)}
            placeholder="Enter Message"
            minRows={3}
            style={{
              padding: '7px',
              outline: 'solid 1px #999',
              background: 'transparent',
              borderRadius: '5px'
            }}
          />
          <Button onClick={handleCreateQuery} variant="contained">
            Create Query Room
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default CreateQueryModal;
