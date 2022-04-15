import React, { forwardRef, Fragment } from 'react';
import tableBodyStyles from './table-body-styles';

import PropTypes from 'prop-types';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';

import { useTheme } from '@mui/styles';
import { CustomNoRowsOverlay, CustomToolbar } from './RenderCell';
import CustomPagination from '../cardsbody/CustomPagination';

import { createColumns, LocateText, CustomFilterInputs } from './function';

const TableBody = forwardRef((props, ref) => {
  const classes = tableBodyStyles();
  const theme = useTheme();
  const history = useHistory();
  const { perPageArray, usersPageNumber, totalUsers } = useSelector(
    (state) => state
  );
  const { t, mainData, perPage, editUrl, deleteAlert, dataGridColumns } = props;

  const columns = [
    ...createColumns(dataGridColumns, t),
    {
      field: 'actions',
      type: 'actions',
      headerName: t('actions'),
      headerAlign: 'center',
      width: 100,
      cellClassName: 'actions',
      filterable: false,
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<Edit style={{ color: theme.palette.primary.main }} />}
            label={t('Edit')}
            className='textPrimary'
            onClick={() => {
              gotToEdit(params.id);
            }}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<Delete style={{ color: theme.palette.error.main }} />}
            label={t('Delete')}
            onClick={() => {
              deleteAlert(params.row);
            }}
            color='inherit'
          />,
        ];
      },
    },
  ];

  if (columns.length > 0) {
    CustomFilterInputs(columns);
  }

  const gotToEdit = (_id) => {
    history.push({
      pathname: editUrl,
      search: `?_id=${_id}`,
    });
  };

  return (
    <Fragment ref={ref}>
      <CustomPagination {...props} />
      <Box
        sx={{
          height: '63vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          mb: 2,
          mt: 2,
        }}>
        <DataGrid
          density='compact'
          localeText={LocateText()}
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{ borderRadius: 2 }}
          columns={columns}
          getRowId={(row) => row._id}
          rows={mainData}
          rowHeight={100}
          pageSize={perPage}
          paginationMode='server'
          rowCount={totalUsers}
          page={usersPageNumber - 1}
          rowsPerPageOptions={perPageArray}
          initialState={{
            pagination: {
              page: usersPageNumber,
            },
          }}
          onRowDoubleClick={(params) => {
            gotToEdit(params.id);
          }}
        />
      </Box>
      <CustomPagination {...props} />
    </Fragment>
  );
});

TableBody.propTypes = {
  t: PropTypes.func.isRequired,
  mainData: PropTypes.array.isRequired,
  perPage: PropTypes.number.isRequired,
  rtlActive: PropTypes.bool.isRequired,
  editUrl: PropTypes.string.isRequired,
  deleteAlert: PropTypes.func.isRequired,
};

export default TableBody;
