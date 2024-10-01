import { AddCircleOutlineOutlined } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  Stack,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createScript } from '../../../api/script/script';
import { searchService } from '../../../api/service/service';
import { getStagesHandler } from '../../../api/stages/stagesHandler';
import useServiceStore from '../../../store/serviceStore';
import { iScript, iService, iStage } from '../../../types/store/service';

type Props = {};

const drawerWidth = 600;

const AddScript = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { stages } = useServiceStore();
  const [loading, setLoading] = useState(false);
  const [searchServiceValue, setSearchServiceValue] = useState('');
  const [services, setServices] = useState<iService[]>();
  const [script, setScript] = useState<iScript>({
    text: '',
    service: '',
    stage: ''
  });

  const handleAddScript = async () => {
    await createScript(script);
    setScript({
      text: '',
      service: '',
      stage: ''
    });
  };

  const handleServiceSearch = async (value: string) => {
    setLoading(true);

    setLoading(false);
  };

  useEffect(() => {
    (async function () {
      await getStagesHandler();
      const services = await searchService(
        searchServiceValue,
        '63bbae206cf5f7cd69ef6ddc'
      );
      setServices(services);
    })();
  }, [searchServiceValue]);

  return (
    <Box>
      <Button
        variant="contained"
        color="success"
        onClick={() => setIsOpen(true)}
        endIcon={<AddCircleOutlineOutlined />}
      >
        Add New
      </Button>
      <Drawer
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box borderBottom={1} borderColor="#f5f5f5" p={2}>
          <Typography variant="h6" fontWeight={500}>
            Create Agent Script
          </Typography>
        </Box>
        <Stack p={2} direction="row" spacing={2}>
          <Autocomplete
            aria-required={true}
            options={services ? services : []}
            id="combo-box-demo"
            isOptionEqualToValue={(option, value) => option.name === value.name}
            noOptionsText="No Service Available With This Name"
            getOptionLabel={(option: iService) => option.name}
            onChange={(event, value) =>
              setScript({ ...script, service: value?._id! })
            }
            sx={{ width: 400, textTransform: 'capitalize' }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ textTransform: 'capitalize' }}
                label="Select Surgery"
                onChange={(e) => {
                  setSearchServiceValue((prev) => e.target.value);
                }}
              />
            )}
          />
          <Autocomplete
            aria-required={true}
            options={stages}
            onChange={(event, value) =>
              setScript({ ...script, stage: value?._id! })
            }
            id="combo-box-demo"
            loading={loading}
            loadingText=" Loading Services"
            getOptionLabel={(option: iStage) => option.name}
            sx={{ width: 400, textTransform: 'capitalize' }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ textTransform: 'capitalize' }}
                label="Select Stage"
              />
            )}
          />
        </Stack>
        <Box p={2}>
          <TextareaAutosize
            placeholder="Enter Script"
            minRows={20}
            style={{
              border: '1px solid #999',
              width: '100%',
              padding: '1rem',
              borderRadius: 5
            }}
            onChange={(e) => {
              setScript({ ...script, text: e.target.value });
            }}
          />
        </Box>
        <Box p={2}>
          <Button onClick={handleAddScript} variant="contained">
            Upload Script
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AddScript;
