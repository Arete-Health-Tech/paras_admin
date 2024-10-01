import { Box, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { getServiceTagsHandler } from '../../api/service/serviceHandler';

import useServiceStore from '../../store/serviceStore';
import { iServiceTag } from '../../types/store/service';
import AddTags from './widgets/AddTags';

type Props = {};

const Tags = (props: Props) => {
  const { serviceTags } = useServiceStore();
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'name',
      headerName: 'Name',
      width: 500,
      renderCell: (params) => {
        return <Typography fontWeight="500">{params.row.name}</Typography>;
      }
    }
  ];
  const rows = serviceTags.map((item: iServiceTag, index: number) => {
    return {
      name: item.name.toUpperCase(),
      id: index + 1
    };
  });

  useEffect(() => {
    (async function () {
      await getServiceTagsHandler();
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
        <Typography variant="h4">Tags</Typography>
        <AddTags />
      </Box>
      <DataGrid
        checkboxSelection
        sx={{ background: 'white', p: 3 }}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8]}
        rows={rows}
      />
    </Stack>
  );
};
export default Tags;
