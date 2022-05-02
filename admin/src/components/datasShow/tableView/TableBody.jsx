import React, { forwardRef, Fragment } from 'react';
import tableBodyStyles from './table-body-styles';

import PropTypes from 'prop-types';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete, ToggleOff, ToggleOn } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';

import { useTheme } from '@mui/styles';
import { CustomNoRowsOverlay, CustomToolbar } from './RenderCell';
import Pagination from '../cardsView/Pagination';

import { createColumns, LocateText, CustomFilterInputs } from './function';

const TableBody = forwardRef((props, ref) => {
  const classes = tableBodyStyles();
  const theme = useTheme();
  const history = useHistory();
  const { perPageArray, profile } = useSelector((state) => state);
  const {
    t,
    mainData,
    perPage,
    editUrl,
    deleteAlert,
    dataGridColumns,
    pageNumber,
    total,
    modelName,
    activesId,
    activeAlert,
    diactiveAlert,
  } = props;

  const columns = [
    ...createColumns(dataGridColumns, props, t),
    {
      field: 'actions',
      type: 'actions',
      headerName: t('actions'),
      headerAlign: 'center',
      width: 100,
      cellClassName: 'actions',
      filterable: false,
      cellClassName: 'super-app-theme--cell',
      getActions: (params) => {
        const hideDelete =
          modelName == 'Users' ? params.id == profile._id : params.row.isActive;
        const hideEdit = editUrl == '';
        if (editUrl !== '') {
          return [
            <GridActionsCellItem
              icon={<Edit style={{ color: theme.palette.primary.main }} />}
              label={t('Edit')}
              className='textPrimary'
              onClick={() => {
                doubleClickFunc(params);
              }}
              style={{
                visibility: hideEdit ? 'hidden' : 'visible',
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
              style={{
                visibility: hideDelete ? 'hidden' : 'visible',
              }}
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={
                activesId == undefined ? (
                  <ToggleOn style={{ color: theme.palette.success.main }} />
                ) : activesId?.filter((e) => e.id == params.id).length > 0 ? (
                  <ToggleOff style={{ color: theme.palette.success.main }} />
                ) : (
                  <ToggleOn style={{ color: theme.palette.error.main }} />
                )
              }
              label={t('Edit')}
              className='textPrimary'
              onClick={() => {
                if(activesId == undefined){
                  diactiveAlert(params.row);
                }else{
                  if (activesId?.filter((e) => e.id == params.id).length > 0) {
                    diactiveAlert(params.row);
                  } else {
                    activeAlert(params.row);
                  }
                }
              }}
              color='inherit'
            />,
          ];
        }
      },
    },
  ];

  if (columns.length > 0) {
    CustomFilterInputs(columns);
  }

  const doubleClickFunc = (params) => {
    if (editUrl !== '') {
      history.push({
        pathname: editUrl,
        search: `?_id=${params.id}`,
        state: params.row,
      });
    }else{
      if(activesId == undefined){
        diactiveAlert(params.row);
      }else{
        if (activesId?.filter((e) => e.id == params.id).length > 0) {
          diactiveAlert(params.row);
        } else {
          activeAlert(params.row);
        }
      }
    }
  };

  return (
    <Fragment ref={ref}>
      <Pagination {...props} />
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
          showCellRightBorder
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
          rowCount={total}
          page={pageNumber - 1}
          rowsPerPageOptions={perPageArray}
          initialState={{
            pagination: {
              page: pageNumber,
            },
          }}
          onRowDoubleClick={(params) => {
            doubleClickFunc(params);
          }}
        />
      </Box>
      <Pagination {...props} />
    </Fragment>
  );
});

TableBody.propTypes = {
  t: PropTypes.func.isRequired,
  mainData: PropTypes.array.isRequired,
  perPage: PropTypes.number.isRequired,
  rtlActive: PropTypes.bool.isRequired,
  editUrl: PropTypes.string.isRequired,
  deleteAlert: PropTypes.func,
  activeAlert: PropTypes.func,
  diactiveAlert: PropTypes.func,
};

export default TableBody;
