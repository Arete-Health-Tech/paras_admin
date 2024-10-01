import {
  Button,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  Stack,
  FormControl,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { createDepartment } from '../../../api/department/department';
import useServiceStore from '../../../store/serviceStore';
import { iDepartment } from '../../../types/store/service';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '1rem',
  borderWidth: 0,
  p: 4
};
const AddDepartment = () => {
  const { departments } = useServiceStore();
  const [openModal, setOpenModal] = useState(false);
  const [newDept, setNewDept] = useState<iDepartment>({
    name: '',
    parent: ''
  });

  const addNewDepartment = async () => {
    await createDepartment(newDept.name, newDept.parent);
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
            Add New Department
          </Typography>
          <TextField
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            fullWidth
            label="Department Name"
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Parent</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Parent"
              value={newDept.parent}
              onChange={(e) =>
                setNewDept({ ...newDept, parent: e.target.value })
              }
            >
              <MenuItem value={""}>None</MenuItem>
              {departments.map((item: iDepartment) => {
                return (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button
            onClick={addNewDepartment}
            color="success"
            fullWidth
            variant="contained"
          >
            Add
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default AddDepartment;
