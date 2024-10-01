import { Delete } from '@mui/icons-material';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { getNodeConnectorHandler } from '../../../api/flow/flowHandler';
import { getAllServicesHandler } from '../../../api/service/serviceHandler';
import useNodeStore from '../../../store/nodeStore';
import useServiceStore from '../../../store/serviceStore';
import { iNodeConnector } from '../../../types/store/node';
import { iService } from '../../../types/store/service';
import AddNewNodeConnector from './AddNewNodeConnector';

type Props = {};

const NodeConnector = (props: Props) => {
  const { nodeConnector } = useNodeStore();
  const { services } = useServiceStore();

  const serviceSetter = (id: string) => {
    return services.find((service: iService) => service._id === id)?.name;
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'templateName',
      headerName: 'Template Name',
      width: 300,
      renderCell: (params) => {
        return (
          <Typography fontWeight="500" textTransform="capitalize">
            {params.row.templateName}
          </Typography>
        );
      }
    },
    {
      field: 'templateLanguage',
      headerName: 'Template Language',
      width: 150,
      renderCell: (params) => {
        return (
          <Typography fontWeight="500" textTransform="uppercase">
            {params.row.templateLanguage}
          </Typography>
        );
      }
    },
    {
      field: 'templateIdentifier',
      headerName: 'Template Identifier',
      width: 150,
      renderCell: (params) => {
        return <Chip label={params.row.templateIdentifier} />;
      }
    },
    {
      field: 'serviceId',
      headerName: 'Service Name',
      width: 200,
      renderCell: (params) => {
        return (
          <Typography fontWeight="500" textTransform="capitalize">
            {params.row.serviceId}
          </Typography>
        );
      }
    },
    {
      field: 'nodeIdentifier',
      headerName: 'Node Identifier',
      width: 200,
      renderCell: (params) => {
        return (
          <Typography fontWeight="500" textTransform="capitalize">
            {params.row.nodeIdentifier}
          </Typography>
        );
      }
    },

    {
      field: 'actions',
      headerName: 'Action',
      width: 170,
      editable: false,
      sortable: false,
      renderCell: () => (
        <Box display="flex" justifyContent="space-around">
          <Delete color="action" />
        </Box>
      ),
      filterable: false
    }
  ];
  const rows = nodeConnector.map((item: iNodeConnector, index) => {
    return {
      id: index + 1,
      serviceId: serviceSetter(item.serviceId),
      templateName: item.templateName,
      templateLanguage: item.templateLanguage,
      templateIdentifier: item.templateIdentifier,
      nodeId: item.nodeId,
      nodeIdentifier: item.nodeIdentifier
    };
  });

  useEffect(() => {
    (async function () {
      await getNodeConnectorHandler();
      await getAllServicesHandler(0, 50);
    })();
  }, []);
  return (
    <Stack height="85vh">
      <Box
        display="flex"
        justifyContent="space-between"
        marginY={3}
        sx={{ height: '5vh' }}
      >
        <Typography variant="h4">Node Connector</Typography>
        <AddNewNodeConnector />
      </Box>
      <DataGrid
        checkboxSelection
        sx={{ background: 'white', p: 3 }}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        rows={rows}
      />
    </Stack>
  );
};

export default NodeConnector;
