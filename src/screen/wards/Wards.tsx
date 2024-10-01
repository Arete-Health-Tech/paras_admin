import { Box, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { getWardsHandler } from '../../api/ward/wardHandler';
import useServiceStore from '../../store/serviceStore';
import { IWard } from '../../types/store/service';
import AddWards from './widgets/AddWards';

type Props = {};

const Wards = (props: Props) => {
  const { wards } = useServiceStore();
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
      field: 'code',
      headerName: 'Code',
      width: 200,
      renderCell: (params) => {
        return (
          <Typography textTransform="uppercase" fontSize={12}>
            {params.row.code}
          </Typography>
        );
      }
    },
    {
      field: 'type',
      headerName: 'Ward Type',
      width: 150,
      editable: true,
      renderCell: (params) => {
        return (
          <Chip
            sx={{ marginRight: '0.8rem', textTransform: 'uppercase' }}
            label={params.row.type === 0 ? 'General' : 'ICU'}
          />
        );
      }
    },
    {
      field: 'consultation',
      headerName: 'Consultation',
      width: 150,
      renderCell: (params) => {
        return (
          <Typography textTransform="uppercase">
            {params.row.consultation}
          </Typography>
        );
      }
    },
    {
      field: 'roomRent',
      headerName: 'Room Rent',
      width: 150,
      renderCell: (params) => {
        return (
          <Typography textTransform="uppercase">
            {params.row.roomRent}
          </Typography>
        );
      }
    },
    {
      field: 'emergencyConsultation',
      headerName: 'Emergency Consultation',
      width: 170,
      renderCell: (params) => {
        return (
          <Typography textTransform="uppercase">
            {params.row.emergencyConsultation}
          </Typography>
        );
      }
    }
  ];

  useEffect(() => {
    (async function () {
      await getWardsHandler();
    })();
  }, []);

  const rows = wards.map((item: IWard, index: number) => {
    return {
      name: item.name.toUpperCase(),
      code: item.code,
      type: item.type,
      roomRent: item.roomRent,
      consultation: item.consultation,
      emergencyConsultation: item.emergencyConsultation,
      id: index + 1
    };
  });

  return (
    <Stack height="85vh">
      <Box
        display="flex"
        justifyContent="space-between"
        marginY={3}
        sx={{ height: '5vh' }}
      >
        <Typography variant="h4">Wards</Typography>
        <AddWards />
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

export default Wards;
