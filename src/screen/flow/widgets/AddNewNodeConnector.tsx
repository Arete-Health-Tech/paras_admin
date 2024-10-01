import { Add } from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { searchNode } from '../../../api/flow/flow';
import { createNodeConnectorHandler } from '../../../api/flow/flowHandler';
import { searchService } from '../../../api/service/service';
import { iNodeConnector, iNodeRepliesFlow } from '../../../types/store/node';
import { iService } from '../../../types/store/service';

type Props = {};

const drawerWidth = 600;

const AddNewNodeConnector = (props: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchServiceResult, setServiceSearchResult] = useState<iService[]>(
    []
  );
  const [message, setMessage] = useState('');
  const [searchNodeResult, setSearchNode] = useState<iNodeRepliesFlow[]>([]);
  const [nodeData, setNodeData] = useState<iNodeConnector>({
    serviceId: '',
    templateName: '',
    templateLanguage: '',
    templateIdentifier: '',
    nodeId: '',
    nodeIdentifier: ''
  });

  const toggleButton = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const searchServiceHandler = async (query: string) => {
    const data: iService[] = await searchService(query);
    setServiceSearchResult(data);
  };

  const searchNodeHandler = async (query: string) => {
    const data = await searchNode(query);
    setSearchNode(data);
  };

  const handleAddNodeConnector = async () => {
    await createNodeConnectorHandler(nodeData);
    setMessage('Node Connector Created Successfully');
    setNodeData({
      serviceId: '',
      templateName: '',
      templateLanguage: '',
      templateIdentifier: '',
      nodeId: '',
      nodeIdentifier: ''
    });
  };

  return (
    <div>
      <Button
        onClick={toggleButton}
        variant="contained"
        endIcon={<Add />}
        color="success"
      >
        Add New Connector
      </Button>
      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={toggleButton}
        anchor="right"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        <Box p={1} borderBottom={1} borderColor="#f5f5f5">
          <Typography variant="h6" fontWeight={500}>
            Create New Connector
          </Typography>
        </Box>
        <Box p={1}>
          <Stack direction="column" spacing={2}>
            <Autocomplete
              options={searchServiceResult}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) =>
                setNodeData({ ...nodeData, serviceId: value?._id! })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ textTransform: 'capitalize' }}
                  value={nodeData.serviceId}
                  label="Search & Select Service"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search'
                  }}
                  onChange={(e) => {
                    if (e.target.value.length > 3) {
                      searchServiceHandler(e.target.value);
                    }
                  }}
                />
              )}
            />
            <TextField
              value={nodeData.templateName}
              onChange={(e) =>
                setNodeData({ ...nodeData, templateName: e.target.value })
              }
              label="Template Name"
            />
            <FormControl>
              <InputLabel id="template-lang">
                Select Template Language
              </InputLabel>
              <Select
                id="template-lang"
                label="Select Template Language"
                onChange={(e) =>
                  setNodeData({ ...nodeData, templateLanguage: e.target.value })
                }
                value={nodeData.templateLanguage}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={nodeData.templateIdentifier}
              label="Template Identifier"
              onChange={(e) => {
                setNodeData({
                  ...nodeData,
                  templateIdentifier: e.target.value
                });
              }}
            />
            <Autocomplete
              options={searchNodeResult}
              getOptionLabel={(option) => option.nodeId}
              onChange={(event, value) =>
                setNodeData({
                  ...nodeData,
                  nodeIdentifier: value?.nodeId!,
                  nodeId: value?._id!
                })
              }
              renderInput={(params) => (
                <TextField
                  value={nodeData.nodeIdentifier}
                  {...params}
                  sx={{ textTransform: 'capitalize' }}
                  label="Search & Select Node"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search'
                  }}
                  onChange={(e) => {
                    if (e.target.value.length >= 1) {
                      searchNodeHandler(e.target.value);
                    }
                  }}
                />
              )}
            />
            <Button
              onClick={handleAddNodeConnector}
              variant="contained"
              color="success"
            >
              Add Connector
            </Button>
            {message.length > 0 && (
              <Alert variant="filled" severity="success">
                {message}
              </Alert>
            )}
          </Stack>
        </Box>
      </Drawer>
    </div>
  );
};

export default AddNewNodeConnector;
