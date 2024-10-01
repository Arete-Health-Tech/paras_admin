import { Box, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { getAllServicesHandler } from '../../api/service/serviceHandler';
import useServiceStore from '../../store/serviceStore';
import { iDepartment, iService } from '../../types/store/service';
import AddServiceManually from './widgets/AddServiceManually';
import BulkServiceUpload from './widgets/BulkServiceUpload';
import SearchServicesWidget from './widgets/SearchServicesWidget';

type Props = {};

const Services = (props: Props) => {
  const { allServices, departments } = useServiceStore();
  const [pageState, setPageState] = useState({
    isLoading: false,
    total: 0,
    page: 0,
    pageSize: 10
  });

  useEffect(() => {
    (async function () {
      setPageState((prev) => ({ ...prev, isLoading: true }));
      await getAllServicesHandler(pageState.page, pageState.pageSize);
      setPageState((prev) => ({ ...prev, isLoading: false }));
    })();
  }, [pageState.page, pageState.pageSize]);

  const departmentNameReturner = (id: string) => {
    const departmentName = departments.find(
      (department: iDepartment) => department._id === id
    );
    return departmentName!.name;
  };

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
      headerName: 'Department',
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <Typography fontWeight="400" textTransform="uppercase">
            {params.row.departments}
          </Typography>
        );
      }
    },
    {
      field: 'departmentType',
      headerName: 'Department Type',
      width: 300
    },
    {
      field: 'tag',
      headerName: 'Tag',
      width: 170,
      editable: false,
      sortable: false,
      renderCell: (params) => <Chip label={params.row.tag} />,
      filterable: false
    }
  ];

  const rows = allServices.services.map((item: iService, index: number) => {
    return {
      name: item.name.toUpperCase(),
      departments: departmentNameReturner(item.department),
      departmentType: item.departmentType,
      id: item.serviceId,
      tag: item.tag
    };
  });

  return (
    <Stack height="85vh">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginY={3}
        sx={{ height: '5vh' }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">Services</Typography>
          <SearchServicesWidget />
        </Stack>
        <Box display="flex" width={'40%'} justifyContent="space-around">
          <AddServiceManually />
          <BulkServiceUpload />
        </Box>
      </Box>
      <DataGrid
        rowCount={allServices.total}
        sx={{ background: 'white', p: 3 }}
        columns={columns}
        pagination
        paginationMode="server"
        onPageChange={(newPage) =>
          setPageState((prev) => ({ ...prev, page: newPage }))
        }
        onPageSizeChange={(newPageSize) =>
          setPageState((prev) => ({ ...prev, pageSize: newPageSize }))
        }
        rowsPerPageOptions={[10, 20, 30, 40]}
        pageSize={pageState.pageSize}
        rows={rows}
        page={pageState.page}
      />
    </Stack>
  );
};

export default Services;
