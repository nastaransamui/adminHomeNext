import React, { forwardRef, Fragment } from 'react';
import tableBodyStyles from './table-body-styles';

import PropTypes from 'prop-types';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete, ToggleOff, ToggleOn } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
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
    deleteButtonDisabled,
    updateButtonDisabled,
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
        const hideEdit = editUrl == '';
        const hideDelete =
          modelName == 'Countries' ||
          modelName == 'Provinces' ||
          modelName == 'Cities' ||
          modelName == 'global_countries' ||
          modelName == 'Currencies' ||
          modelName == 'global_currencies'
            ? true
            : modelName == 'Agencies'
            ? false
            : modelName == 'Roles'
            ? false
            : modelName == 'Users'
            ? params.id == profile._id
            : params.row.isActive;

        const hideToggle =
          modelName == 'Countries' ||
          modelName == 'global_countries' ||
          modelName == 'Currencies' ||
          modelName == 'global_currencies'
            ? false
            : true;
        return [
          <GridActionsCellItem
            icon={
              <Tooltip arrow title={t('editTooltip')}>
                <Edit
                  style={{
                    color: updateButtonDisabled
                      ? theme.palette.text.disabled
                      : theme.palette.primary.main,
                  }}
                />
              </Tooltip>
            }
            label={t('Edit')}
            disabled={updateButtonDisabled}
            className='textPrimary'
            onClick={() => {
              !updateButtonDisabled && doubleClickFunc(params);
            }}
            style={{
              display: hideEdit ? 'none' : 'block',
            }}
            color='inherit'
            disableRipple
            disableFocusRipple
          />,
          <GridActionsCellItem
            icon={
              activesId == undefined ? (
                <Tooltip title={t('ToggleOn')} placement='bottom' arrow>
                  <ToggleOn
                    style={{
                      color: deleteButtonDisabled
                        ? theme.palette.text.disabled
                        : theme.palette.success.main,
                    }}
                  />
                </Tooltip>
              ) : activesId?.filter((e) => e.id == params.id).length > 0 ? (
                <Tooltip title={t('ToggleOff')} placement='bottom' arrow>
                  <ToggleOff
                    style={{
                      color: deleteButtonDisabled
                        ? theme.palette.text.disabled
                        : theme.palette.success.main,
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={t('ToggleOn')} placement='bottom' arrow>
                  <ToggleOn
                    style={{
                      color: deleteButtonDisabled
                        ? theme.palette.text.disabled
                        : theme.palette.error.main,
                    }}
                  />
                </Tooltip>
              )
            }
            label={t('Edit')}
            className='textPrimary'
            onClick={() => {
              if (activesId == undefined) {
                !deleteButtonDisabled && diactiveAlert(params.row);
              } else {
                if (activesId?.filter((e) => e.id == params.id).length > 0) {
                  !deleteButtonDisabled && diactiveAlert(params.row);
                } else {
                  !deleteButtonDisabled && activeAlert(params.row);
                }
              }
            }}
            color='inherit'
            style={{
              display: hideToggle ? 'none' : 'block',
            }}
            disableRipple
            disabled={deleteButtonDisabled}
            disableFocusRipple
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title={t('deleteTooltip')} placement='bottom' arrow>
                <Delete
                  style={{
                    color: deleteButtonDisabled
                      ? theme.palette.text.disabled
                      : theme.palette.error.main,
                  }}
                />
              </Tooltip>
            }
            disabled={deleteButtonDisabled}
            label={t('Delete')}
            onClick={() => {
              deleteAlert(params.row);
            }}
            color='inherit'
            style={{
              display: hideDelete ? 'none' : 'block',
            }}
            disableRipple
            disableFocusRipple
          />,
        ];
      },
    },
  ];

  if (columns.length > 0) {
    CustomFilterInputs(columns);
  }

  const doubleClickFunc = (params) => {
    if (editUrl !== '') {
      if (modelName == 'Provinces') {
        !updateButtonDisabled && history.push({
          pathname: editUrl,
          search: `?state_id=${params?.row?.id}`,
          state: params.row,
        });
      } else if (modelName == 'Countries') {
        !updateButtonDisabled && history.push({
          pathname: editUrl,
          search: `?country_id=${params?.row?.id}`,
          state: params.row,
        });
      } else if (modelName == 'Cities') {
        !updateButtonDisabled && history.push({
          pathname: editUrl,
          search: `?city_id=${params?.row?.id}`,
          state: params.row,
        });
      } else if (modelName == 'Currencies') {
        !updateButtonDisabled && history.push({
          pathname: editUrl,
          search: `?currency_id=${params?.row?._id}`,
          state: params.row,
        });
      } else if (modelName == 'Agencies') {
        !updateButtonDisabled && history.push({
          pathname: editUrl,
          search: `?client_id=${params?.row?._id}`,
          state: params.row,
        });
      } else if (modelName == 'Roles') {
        !updateButtonDisabled && history.push({
          pathname: editUrl,
          search: `?role_id=${params?.row?._id}`,
          state: params.row,
        });
      } else if (!updateButtonDisabled) {
        !updateButtonDisabled && history.push({
          pathname: editUrl,
          search: `?_id=${params.id}`,
          state: params.row,
        });
      }
    } else {
      if (activesId == undefined) {
        !deleteButtonDisabled && diactiveAlert(params.row);
      } else {
        if (activesId?.filter((e) => e.id == params.id).length > 0) {
          !deleteButtonDisabled && diactiveAlert(params.row);
        } else {
          !deleteButtonDisabled && activeAlert(params.row);
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
