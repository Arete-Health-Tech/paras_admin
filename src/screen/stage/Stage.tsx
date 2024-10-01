import { Delete } from '@mui/icons-material';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { getStagesHandler } from '../../api/stages/stagesHandler';
import useServiceStore from '../../store/serviceStore';
import { iStage } from '../../types/store/service';
import AddStage from './widgets/AddStage';

type Props = {};

const Stage = (props: Props) => {
  const { stages } = useServiceStore();
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => {
        return <Typography fontWeight="500">{params.row.name}</Typography>;
      }
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 500,
      renderCell: (params) => {
        return (
          <Typography variant="body1" textTransform="capitalize">
            {params.row.description}
          </Typography>
        );
      }
    },
    {
      field: 'parent',
      headerName: 'Parent',
      width: 100,
      editable: true,
      renderCell: (params) =>
        params.row.parent && (
          <Chip
            sx={{ marginRight: '0.8rem', textTransform: 'uppercase' }}
            label={params.row.parent}
          />
        )
    },
    {
      field: 'code',
      headerName: 'Stage Code',
      width: 100,
      editable: true,
      renderCell: (params) => (
        <Chip
          sx={{ marginRight: '0.8rem', textTransform: 'uppercase' }}
          label={params.row.code}
        />
      )
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

  const returnParentName = (id: string | null) => {
    return stages.find((stage: iStage) => stage._id === id)?.name;
  };

  const rows = stages.map((item: iStage, index: number) => {
    return {
      name: item.name.toUpperCase(),
      parent: returnParentName(item.parent),
      code: item.code,
      description: item.description,
      id: index + 1
    };
  });

  useEffect(() => {
    (async function () {
      await getStagesHandler();
    })();
  }, []);
  return (
    <Stack height="85vh">
      <Box></Box>
      <Box
        display="flex"
        justifyContent="space-between"
        marginY={3}
        sx={{ height: '5vh' }}
      >
        <Typography variant="h4">Stages</Typography>
        <AddStage />
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

export default Stage;
