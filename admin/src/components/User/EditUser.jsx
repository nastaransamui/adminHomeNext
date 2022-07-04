import { Fragment, useState, useEffect } from 'react';
import Wizard from '../Wizard/Wizard';
import CreateUser from './CreateUser';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Close, Done, Search } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { CircleToBlockLoading } from 'react-loadingg';

import cardsShowStyles from '../datasShow/cards-show-styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { MuiTelInput } from 'mui-tel-input';
import { checkCookies } from 'cookies-next';
import alertCall from '../Hooks/useAlert';
import customerAvatar from '../../../public/images/faces/Customer.png';

const getDataUrl = '/admin/api/autocomplete/lookup';

const columns = [
  {
    id: 'agentName',
    label: 'Agent Name',
    align: 'center',
    minWidth: 180,
    numeric: false,
    disablePadding: true,
  },
  {
    id: 'isActive',
    label: 'Activation',
    minWidth: 70,
    align: 'center',
    numeric: false,
    disablePadding: true,
  },
  {
    id: 'email',
    label: 'Email',
    align: 'center',
    minWidth: 70,
    numeric: false,
    disablePadding: true,
  },
  {
    id: 'phones',
    label: 'Phones',
    align: 'center',
    minWidth: 180,
    numeric: false,
    disablePadding: true,
  },
  {
    id: 'agentId',
    label: 'Agent Id',
    minWidth: 120,
    align: 'center',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'creditAmount',
    label: 'Credit',
    minWidth: 170,
    align: 'center',
    numeric: true,
    disablePadding: false,
  },
  {
    id: 'depositAmount',
    label: 'Deposit',
    minWidth: 170,
    align: 'center',
    numeric: true,
    disablePadding: false,
  },
  {
    id: 'remainCreditAmount',
    label: 'Remain Credit',
    minWidth: 170,
    align: 'center',
    numeric: true,
    disablePadding: false,
  },
  {
    id: 'remainDepositAmount',
    label: 'Remain Deposit',
    minWidth: 170,
    align: 'center',
    numeric: true,
    disablePadding: false,
  },
  {
    id: 'address',
    label: 'Address',
    minWidth: 70,
    align: 'center',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'cityName',
    label: 'City',
    minWidth: 70,
    align: 'center',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'provinceName',
    label: 'Province',
    minWidth: 70,
    align: 'center',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'countryName',
    label: 'Country',
    minWidth: 70,
    align: 'center',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'remark',
    label: 'Remark',
    minWidth: 120,
    align: 'center',
    numeric: false,
    disablePadding: false,
  },
];

const phoneTooltip = (phones, t, theme) => {
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
            {t(`${keys[1]}`)}: {p.number}-{p.tags[0]}-{p.remark}
          </Typography>
        );
      })}
    </Fragment>
  );
};

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'>
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </StyledTableCell>
        {columns.map((column) => {
          return (
            <StyledTableCell
              key={column.id}
              align={column.align}
              padding={column.disablePadding ? 'none' : 'normal'}
              style={{ minWidth: column.minWidth }}
              sortDirection={orderBy === column.id ? order : false}>
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}>
                {column.label}
                {orderBy === column.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </StyledTableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
function copy(arr1, arr2) {
  for (var i = 0; i < arr1.length; i++) {
    arr2[i] = arr1[i];
  }
}
const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    tableName,
    _id,
    selected,
    setSelected,
    setValues,
    setMainData,
    agentsData,
    mainData,
    values,
    getUser,
  } = props;
  const [showSearch, setShowSearch] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [fieldValue, setFieldValue] = useState(columns[0]?.id);
  const [dataOptions, setDataOptions] = useState([]);
  const [openField, setOpenField] = useState(false);
  let loadingField = openField && dataOptions.length === 0;
  const { adminAccessToken } = useSelector((state) => state);

  const classes = cardsShowStyles();
  const theme = useTheme();
  const { t } = useTranslation('common');
  const handleAutocomplete = (newValue) => {
    if (fieldValue !== 'phones') {
      setFilterValue(newValue !== null ? newValue[`${fieldValue}`] || '' : '');
    } else {
      setFilterValue(
        newValue !== null ? newValue[`${fieldValue}`][0].number || '' : ''
      );
    }
  };

  const showValuesData = (dataOptions) => {
    if (typeof dataOptions[fieldValue] == 'number') {
      return (
        <>
          <img
            height={30}
            width={30}
            style={{ borderRadius: '50%' }}
            src={`${dataOptions.logoImage || customerAvatar.src}`}
            alt=''
          />
          &nbsp;&nbsp;&nbsp;
          {`${dataOptions.agentName} ${dataOptions[
            fieldValue
          ].toLocaleString()} ${dataOptions?.currencyCode}`}
        </>
      );
    }
    if (fieldValue !== 'phones') {
      return (
        <>
          <img
            height={30}
            width={30}
            style={{ borderRadius: '50%' }}
            src={`${dataOptions.logoImage || customerAvatar.src}`}
            alt=''
          />
          &nbsp;&nbsp;&nbsp;
          {`${dataOptions.agentName} ${dataOptions[fieldValue]}`}
        </>
      );
    } else {
      const phoneValue = dataOptions[fieldValue].map((a, i) => {
        return `${dataOptions.agentName} ${a.number} ${a.tags[0]} ${a.remark} \n`;
      });
      return (
        <>
          <img
            height={30}
            width={30}
            style={{ borderRadius: '50%' }}
            src={`${dataOptions.logoImage || customerAvatar.src}`}
            alt=''
          />
          &nbsp;&nbsp;&nbsp;
          {phoneValue}
        </>
      );
    }
  };

  const getLabels = (dataOptions) => {
    return dataOptions.agentName;
  };
  const getData = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(getDataUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: 'Users',
          lookupFrom: 'agencies',
          fieldValue: fieldValue,
          filterValue: filterValue,
          _id: _id,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setDataOptions([
          {
            [`${fieldValue}`]: response.Error,
            emoji: '⚠️',
            error: true,
            _id: 0,
          },
        ]);
        if (!checkCookies('adminAccessToken')) {
          alertCall(theme, 'error', response.Error, () => {
            router.push('/', undefined, { shallow: true });
          });
        }
      } else {
        setMainData([...response.data]);
        setDataOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
  };


  useEffect(() => {
    let isMount = true;
    if (isMount && filterValue !== '') {
      getData();
    }
    if (filterValue == '') {
      setDataOptions([]);
      setMainData(agentsData);
    }
    return () => {
      isMount = false;
    };
  }, [filterValue]);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        pt: 2,
        pb: 2,
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}>
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'>
          {numSelected} {t('selected')}
        </Typography>
      ) : (
        <>
          {showSearch ? (
            <Grid container sx={{ flex: '1 1 100%' }} spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                <FormControl fullWidth>
                  <InputLabel className={classes.select} id='search-fields'>
                    {t('Field')}
                  </InputLabel>
                  <Select
                    labelId='search-fields-label'
                    className={classes.textfield}
                    id='search-fields'
                    value={fieldValue}
                    label={t('Field')}>
                    {columns
                      .filter((a) => a.id !== 'isActive')
                      .map((d, i) => {
                        return (
                          <MenuItem
                            key={i}
                            value={d.id}
                            onClick={(e) => {
                              setFieldValue(d.id);
                              setFilterValue('');
                            }}>
                            {t(`${d.label}`)}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <Autocomplete
                  id='data-select'
                  clearIcon=''
                  options={dataOptions}
                  loading={loadingField}
                  loadingText={t('loadingField')}
                  noOptionsText={t('fieldNoOptions')}
                  inputValue={filterValue}
                  autoHighlight
                  onChange={(event, newValue) => {
                    handleAutocomplete(newValue);
                  }}
                  open={openField}
                  onOpen={() => {
                    setOpenField(true);
                  }}
                  onClose={() => {
                    setOpenField(false);
                  }}
                  getOptionLabel={(dataOptions) => getLabels(dataOptions)}
                  getOptionDisabled={(dataOptions) => dataOptions.error}
                  isOptionEqualToValue={(dataOptions, value) => {
                    return dataOptions.name === value.name;
                  }}
                  filterOptions={(x, s) => {
                    const searchRegex = new RegExp(
                      escapeRegExp(filterValue),
                      'i'
                    );
                    const filterdData = x.filter((row) => {
                      if (fieldValue !== 'phones') {
                        return Object.keys(row).some((field) => {
                          if (row[field] !== null) {
                            return searchRegex.test(row[field].toString());
                          }
                        });
                      } else {
                        return Object.keys(row).some((field) => {
                          if (row[field] !== null) {
                            if (field == 'phones') {
                              return row[field].map((a, i) => {
                                return searchRegex.test(a.number.toString());
                              });
                            }
                          }
                        });
                      }
                    });
                    return filterdData;
                  }}
                  renderOption={(props, dataOptions) => (
                    <Box component='li' {...props} key={dataOptions._id}>
                      {showValuesData(dataOptions)}
                    </Box>
                  )}
                  renderInput={(params) => {
                    return (
                      <>
                        {fieldValue !== 'phones' ? (
                          <TextField
                            {...params}
                            label={t('labelSearch')}
                            className={classes.textfield}
                            value={filterValue}
                            onChange={(e) => {
                              setFilterValue(e.target.value);
                            }}
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {loadingField ? (
                                    <CircularProgress
                                      color='inherit'
                                      size={20}
                                    />
                                  ) : (
                                    filterValue !== '' && (
                                      <IconButton
                                        disableFocusRipple
                                        disableRipple
                                        disableTouchRipple
                                        onClick={() => {
                                          setFilterValue('');
                                        }}>
                                        <Close color='secondary' size={20} />
                                      </IconButton>
                                    )
                                  )}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        ) : (
                          <MuiTelInput
                            {...params}
                            label={t('labelSearch')}
                            className={classes.phone}
                            MenuProps={{
                              PaperProps: {
                                className: classes.phoneMenu,
                              },
                            }}
                            value={filterValue}
                            onChange={(e) => {
                              setFilterValue(e);
                            }}
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {loadingField ? (
                                    <CircularProgress
                                      color='primary'
                                      size={20}
                                    />
                                  ) : (
                                    filterValue !== '' && (
                                      <IconButton
                                        disableFocusRipple
                                        disableRipple
                                        disableTouchRipple
                                        onClick={() => {
                                          setFilterValue('');
                                        }}>
                                        <Close color='secondary' size={20} />
                                      </IconButton>
                                    )
                                  )}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        )}
                      </>
                    );
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant='subtitle1'
              id='tableTitle'
              component='div'>
              {t(`${tableName}`)}
            </Typography>
          )}
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete' arrow>
          <IconButton
            onClick={() => {
              // make a Set to hold values from namesToDeleteArr
              const idsToDeleteSet = new Set(selected);

              // use filter() method
              // to filter only those elements
              // that need not to be deleted from the array
              const newArr = values.agents_id.filter((id) => {
                // return those elements not in the namesToDeleteSet
                return !idsToDeleteSet.has(id);
              });
              setValues((oldValues) => ({ ...oldValues, agents_id: newArr }));
              setSelected([])
            }}>
            <DeleteIcon style={{ color: theme.palette.secondary.main }} />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          {showSearch ? (
            <Tooltip title={t('closeSearch')} arrow>
              <IconButton
                onClick={() => {
                  setShowSearch(!showSearch);
                }}>
                <Close style={{ color: theme.palette.secondary.main }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={t('search')} arrow>
              <IconButton
                onClick={() => {
                  setShowSearch(!showSearch);
                }}>
                <Search style={{ color: theme.palette.secondary.main }} />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableName: PropTypes.string.isRequired,
  mainData: PropTypes.array.isRequired,
  _id: PropTypes.string.isRequired,
};

const Step2 = (props) => {
  const { values, t, classes, totalAgents, getUser, _id, setValues } = props;

  const { dataAgentPageNumber } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { agentsData } = values;
  const [mainData, setMainData] = useState(undefined);
  const theme = useTheme();
  // const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    JSON.parse(localStorage.getItem('agentDataRowsPerPage')) || 5
  );
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(
    JSON.parse(localStorage.getItem('agentDataDense') || false)
  );
  const [order, setOrder] = useState(
    localStorage.getItem('agentDataOrder') || 'asc'
  );
  const [orderBy, setOrderBy] = useState(
    localStorage.getItem('agentDataOrderBy') || 'agentName'
  );

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      setMainData(agentsData);
    }
    return () => {
      isMount = false;
    };
  }, [agentsData]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = mainData.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  // console.log(selected);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    localStorage.setItem('agentDataOrder', isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    localStorage.setItem('agentDataOrderBy', property);
    getUser();
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    dataAgentPageNumber > 0
      ? Math.max(0, (1 + dataAgentPageNumber) * rowsPerPage - totalAgents)
      : 0;

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: 'DATA_AGENT_PAGENUMBER',
      payload: newPage,
    });
    getUser();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    localStorage.setItem(
      'agentDataRowsPerPage',
      parseInt(event.target.value, 10)
    );
    dispatch({
      type: 'DATA_AGENT_PAGENUMBER',
      payload: 0,
    });
    localStorage.setItem('agentDataPage', 0);
    getUser();
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
    localStorage.setItem(
      'agentDataDense',
      JSON.stringify(event.target.checked)
    );
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      getUser();
    }
    return () => {
      isMount = false;
    };
  }, [dataAgentPageNumber]);
  return (
    <Fragment>
      {mainData == undefined ? (
        <CircleToBlockLoading color={theme.palette.secondary.main} />
      ) : (
        <Fragment>
          <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
            <EnhancedTableToolbar
              numSelected={selected.length}
              tableName={t(`agentData`)}
              mainData={mainData}
              setMainData={setMainData}
              agentsData={agentsData}
              setValues={setValues}
              selected={selected}
              setSelected={setSelected}
              values={values}
              getUser={getUser}
              _id={_id}
            />
            <TableContainer sx={{ maxHeight: 420 }}>
              <Table
                stickyHeader
                sx={{ minWidth: 750 }}
                aria-labelledby='tableTitle'
                size={dense ? 'small' : 'medium'}>
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={mainData.length}
                />
                <TableBody className={classes.table}>
                  {stableSort(mainData, getComparator(order, orderBy))
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row._id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => {
                            values.agents_id.includes(row._id) && handleRowClick(event, row._id)
                          }}
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          sx={{
                            textDecoration:!values.agents_id.includes(row._id) ? 'line-through' : '',
                            ...(!values.agents_id.includes(row._id) && {
                              bgcolor: (theme) =>
                                alpha(
                                  theme.palette.secondary.main,
                                  theme.palette.action.activatedOpacity
                                ),
                            }),
                          }}
                          selected={isItemSelected}>
                          <TableCell padding='checkbox'>
                            <Checkbox
                              disabled={!values.agents_id.includes(row._id)}
                              color='primary'
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component='th'
                            id={labelId}
                            scope='row'
                            padding='none'
                            align='center'>
                            {row.agentName}
                          </TableCell>
                          <TableCell
                            component='th'
                            id={labelId}
                            scope='row'
                            padding='none'
                            align='center'>
                            {row.isActive ? (
                              <Done
                                style={{ color: theme.palette.success.main }}
                              />
                            ) : (
                              <Close
                                style={{ color: theme.palette.error.main }}
                              />
                            )}
                          </TableCell>
                          <TableCell align='center'>{row.email}</TableCell>
                          <Tooltip
                            title={phoneTooltip(row.phones, t, theme)}
                            placement='top'
                            arrow>
                            <TableCell align='center'>
                              {row.phones[0].number}
                            </TableCell>
                          </Tooltip>
                          <TableCell align='center'>{row.agentId}</TableCell>
                          <TableCell align='center'>
                            {row.creditAmount.toLocaleString('en-US')}{' '}
                            {row.currencyCode}
                          </TableCell>
                          <TableCell align='center'>
                            {row.depositAmount.toLocaleString('en-US')}{' '}
                            {row.currencyCode}
                          </TableCell>
                          <TableCell align='center'>
                            {row.remainCreditAmount.toLocaleString('en-US')}{' '}
                            {row.currencyCode}
                          </TableCell>
                          <TableCell align='center'>
                            {row.remainDepositAmount.toLocaleString('en-US')}{' '}
                            {row.currencyCode}
                          </TableCell>
                          <TableCell align='center'>{row.address}</TableCell>
                          <TableCell align='center'>{row.cityName}</TableCell>
                          <TableCell align='center'>
                            {row.provinceName}
                          </TableCell>
                          <TableCell align='center'>
                            {row.countryName}
                          </TableCell>
                          <Tooltip
                            arrow
                            title={row.remark.length > 20 ? row.remark : ''}>
                            <TableCell align='left'>{`${row.remark.slice(
                              0,
                              20
                            )} ...`}</TableCell>
                          </Tooltip>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage={t('rowsPerPage')}
              labelDisplayedRows={({ from, to, count, page }) => {
                return `page: ${page}  ${from}–${to} ${t('of')}  ${
                  count !== -1 ? count : `more than ${to}`
                }`;
              }}
              component='div'
              count={totalAgents}
              rowsPerPage={rowsPerPage}
              page={dataAgentPageNumber}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label='Dense padding'
          />
        </Fragment>
      )}
    </Fragment>
  );
};

const EditUser = (props) => {
  const {
    rtlActive,
    t,
    isValidated,
    handleChange,
    values,
    passwordError,
    setValues,
    formSubmit,
    _id,
  } = props;
  return (
    <Fragment>
      <Wizard
        rtlActive={rtlActive}
        validate
        steps={[
          {
            stepName: t('userdata'),
            stepComponent: CreateUser,
            stepId: 'CreateUser',
            isValidated: isValidated,
            handleChange: handleChange,
            values: values,
            passwordError: passwordError,
            setValues: setValues,
            _id: _id,
            ...props,
          },
          {
            stepName: t('step2'),
            stepComponent: Step2,
            stepId: 'Step2',
            isValidated: isValidated,
            handleChange: handleChange,
            values: values,
            passwordError: passwordError,
            setValues: setValues,
            _id: _id,
            ...props,
          },
        ]}
        title={t('createRouteTitle')}
        subtitle={t('createRouteSubTitle')}
        finishButtonClick={(e) => formSubmit()}
        previousButtonText={t('previous')}
        nextButtonText={t('next')}
        finishButtonText={t('finish')}
      />
    </Fragment>
  );
};

export default EditUser;
