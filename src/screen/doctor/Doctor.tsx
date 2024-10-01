import { Delete } from '@mui/icons-material';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { getDoctorsHandler } from '../../api/doctor/doctorHandler';
import useServiceStore from '../../store/serviceStore';
import { iDepartment, iDoctor } from '../../types/store/service';
import AddDoctor from './widgets/AddDoctor';

type Props = {};

const Doctor = (props: Props) => {
  const { doctors, departments } = useServiceStore();
  const departmentMap = new Map<string, string>(
    departments.map((department: iDepartment) => [
      department._id!,
      department.name
    ])
  );
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'name',
      headerName: 'Name',
      width: 400,
      renderCell: (params) => {
        return <Typography fontWeight="500">{params.row.name}</Typography>;
      }
    },
    {
      field: 'departments',
      headerName: 'Departments',
      width: 500,
      editable: true,
      renderCell: (params) =>
        params.row.departments?.map((item: string) => {
          return (
            <Chip
              sx={{ marginRight: '0.8rem', textTransform: 'uppercase' }}
              label={item}
            />
          );
        })
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
  const rows = doctors.map((doctor: iDoctor, index: number) => {
    return {
      name: doctor.name.toUpperCase(),
      departments: doctor.departments.map((id) => departmentMap.get(id)),
      id: index + 1
    };
  });

  useEffect(() => {
    (async function () {
      await getDoctorsHandler();
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
        <Typography variant="h4">Doctors</Typography>
        <AddDoctor />
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

export default Doctor;
