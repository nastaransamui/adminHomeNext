import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';

import TableContainer from '@mui/material/TableContainer';
import { Table as MuiTable } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableToolbar from './TableToolbar';
import TableHead from './TableHead';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Close from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';

import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import TablePagination from './TablePagination';

const tableStyle = makeStyles((theme) => {
  return {
    table: {
      '& .MuiTableCell-root': {
        borderLeft: '1px solid rgba(81, 81, 81, 1)',
      },
    },
  };
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const phoneTooltip = (phones, theme) => {
  return (
    <Fragment>
      {phones.map((p, i) => {
        const keys = Object.keys(p);
        return (
          <Typography
            key={i}
            variant='subtitle1'
            sx={{
              borderBottom:
                i !== phones.length - 1
                  ? `1px solid ${theme.palette.secondary.main}`
                  : 'none',
            }}>
            {`${keys[1]}`}: {p.number}-{p.tags[0]}-{p.remark}
          </Typography>
        );
      })}
    </Fragment>
  );
};

const Table = (props) => {
  const {
    columns,
    tableName,
    mainData,
    deleteSX,
    arrayOfIds,
    deleteIconClicked,
    dense,
    order,
    orderBy,
    handleRequestSort,
    handleChangeRowsPerPage,
    handleChangePage,
    emptyRows,
    total,
    rowsPerPage,
    pageNumber,
    setMainData,
    originalData,
    _id
  } = props;

  const theme = useTheme();
  const classes = tableStyle();
  const [selected, setSelected] = useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = mainData.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const MainRows = ({ labelId, row }) => {
    return columns.map((col, i) => {
      switch (col.type) {
        case 'string':
          return (
            <Tooltip
              key={i}
              arrow
              title={row[col.id].length > 40 ? row[col.id] : ''}>
              <TableCell
                id={labelId}
                scope='row'
                padding='none'
                align={col.align}>{`${row[col.id].slice(0, 40)} ${
                row[col.id].length > 40 ? '...' : ''
              }`}</TableCell>
            </Tooltip>
          );
        case 'boolean':
          return (
            <TableCell
              key={i}
              align={col.align}
              component='th'
              id={labelId}
              scope='row'
              padding='none'>
              {row.isActive ? (
                <Done style={{ color: theme.palette.success.main }} />
              ) : (
                <Close style={{ color: theme.palette.error.main }} />
              )}
            </TableCell>
          );
        case 'phonesArray':
          return (
            <Tooltip
              key={i}
              title={phoneTooltip(row[col.id], theme)}
              placement='top'
              arrow>
              <TableCell component='th' scope='row' align={col.align}>
                {row[col.id][0].number}
              </TableCell>
            </Tooltip>
          );
        case 'number':
          return (
            <TableCell key={i} component='th' scope='row' align={col.align}>
              {row[col.id].toLocaleString('en-US')} {row.currencyCode}
            </TableCell>
          );
      }
    });
  };

  return (
    <Fragment>
      <TableToolbar
        tableName={tableName}
        numSelected={selected.length}
        deleteIconClicked={deleteIconClicked}
        selected={selected}
        setSelected={setSelected}
        columns={columns}
        setMainData={setMainData}
        originalData={originalData}
        _id={_id}
      />
      <TableContainer sx={{ maxHeight: 420 }}>
        <MuiTable
          stickyHeader
          sx={{ minWidth: 750 }}
          aria-labelledby='tableTitle'
          size={dense ? 'small' : 'medium'}>
          <TableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={mainData.length}
            columns={columns}
          />
          <TableBody className={classes.table}>
            {stableSort(mainData, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={(event) => {
                      arrayOfIds.includes(row._id) &&
                        handleRowClick(event, row._id);
                    }}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    sx={deleteSX(row)}>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        disabled={!arrayOfIds.includes(row._id)}
                        color='primary'
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <MainRows row={row} labelId={labelId} />
                  </TableRow>
                );
              }
            )}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <TablePagination
        total={total}
        rowsPerPage={rowsPerPage}
        pageNumber={pageNumber}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Fragment>
  );
};

Table.propTypes = {
  tableName: PropTypes.string.isRequired,
  mainData: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      align: PropTypes.string.isRequired,
      disablePadding: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      minWidth: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  deleteSX: PropTypes.func.isRequired,
  arrayOfIds: PropTypes.array.isRequired,
  deleteIconClicked: PropTypes.func.isRequired,
  dense: PropTypes.bool.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  handleRequestSort: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  emptyRows: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  setMainData: PropTypes.func.isRequired,
  originalData: PropTypes.array.isRequired,
_id: PropTypes.string.isRequired,
};

export default Table;
