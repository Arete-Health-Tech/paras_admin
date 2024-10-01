import {
  Button,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { IWard } from '../../../types/store/service';
import { createWardHandler } from '../../../api/ward/wardHandler';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '1rem',
  borderWidth: 0,
  p: 4
};
const AddWards = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ward, setWard] = useState<IWard>({
    name: '',
    type: 0,
    code: '',
    roomRent: '',
    consultation: '',
    emergencyConsultation: ''
  });

  const addNewWard = async () => {
    await createWardHandler(ward);
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => setOpenModal(true)}
      >
        <AddIcon />
        Add New
      </Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Stack padding={3} sx={style} spacing={3}>
          <Typography marginY={3} variant="h5" fontWeight={600}>
            Add New Ward
          </Typography>
          <Stack display="flex" width="100%">
            <Box>
              <TextField
                sx={{ m: 1, width: '25ch' }}
                value={ward.name}
                onChange={(e) => setWard({ ...ward, name: e.target.value })}
                label="Ward Name"
              />
              <FormControl sx={{ m: 1, width: '25ch' }}>
                <InputLabel id="demo-simple-select-label">
                  Select Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Type"
                  value={ward.type}
                  onChange={(e) => setWard({ ...ward, type: +e.target.value })}
                >
                  <MenuItem value={0}>General Ward</MenuItem>
                  <MenuItem value={1}>ICU</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, width: '25ch' }}>
                <InputLabel id="demo-simple-select-label">
                  Select Code
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Code"
                  value={ward.code}
                  onChange={(e) => setWard({ ...ward, code: e.target.value })}
                >
                  <MenuItem value="vipRoomCharge">VIP ROOM CHARGE</MenuItem>
                  <MenuItem value="vipRoomCharge">VIP ROOM CHARGE</MenuItem>
                  <MenuItem value="vipRoomCharge">VIP ROOM CHARGE</MenuItem>
                  <MenuItem value="vipRoomCharge">VIP ROOM CHARGE</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                sx={{ m: 1, width: '25ch' }}
                value={ward.roomRent}
                onChange={(e) => setWard({ ...ward, roomRent: e.target.value })}
                fullWidth
                label="Room Rent Per Day"
              />
              <TextField
                sx={{ m: 1, width: '25ch' }}
                value={ward.consultation}
                onChange={(e) =>
                  setWard({ ...ward, consultation: e.target.value })
                }
                fullWidth
                label="Consultation Fee"
              />
              <TextField
                sx={{ m: 1, width: '25ch' }}
                value={ward.emergencyConsultation}
                onChange={(e) =>
                  setWard({ ...ward, emergencyConsultation: e.target.value })
                }
                fullWidth
                label="Emergency Consultation Fee"
              />
            </Box>
          </Stack>
          <Button onClick={addNewWard} color="success" variant="contained">
            Add
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default AddWards;
