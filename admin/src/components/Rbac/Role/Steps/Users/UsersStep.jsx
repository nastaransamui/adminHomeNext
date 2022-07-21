import { Fragment, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { CircleToBlockLoading } from 'react-loadingg';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Table from '../../../../Tables/UserTable/Table';

const UsersStep = (props) => {
  const { values, t, totalUsers, getRole, role_id, setValues } = props;
  const { rolesUserDataPageNumber } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { usersData } = values;
  const [mainData, setMainData] = useState(undefined);
  const theme = useTheme();
  const [rowsPerPage, setRowsPerPage] = useState(
    JSON.parse(localStorage.getItem('roleUsersDataRowsPerPage')) || 5
  );
  const [dense, setDense] = useState(
    JSON.parse(localStorage.getItem('roleUsersDataDense') || false)
  );
  const [order, setOrder] = useState(
    localStorage.getItem('roleUsersDataOrder') || 'asc'
  );
  const [orderBy, setOrderBy] = useState(
    localStorage.getItem('roleUsersDataOrderBy') || 'userName'
  );

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      setMainData(usersData);
    }
    return () => {
      isMount = false;
    };
  }, [usersData]);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      getRole();
    }
    return () => {
      isMount = false;
    };
  }, [rolesUserDataPageNumber]);

  const columns = useMemo(() => {
    return [
      {
        id: 'userName',
        label: 'User Name',
        align: 'center',
        minWidth: 180,
        disablePadding: true,
        type: 'string',
      },
      {
        id: 'isAdmin',
        label: 'Admin Access',
        minWidth: 70,
        align: 'center',
        disablePadding: true,
        type: 'boolean',
      },
      {
        id: 'firstName',
        label: 'Name',
        minWidth: 70,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
      {
        id: 'lastName',
        label: 'Last Name',
        minWidth: 70,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
      {
        id: 'position',
        label: 'Position',
        minWidth: 70,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
      {
        id: 'cityName',
        label: 'City',
        minWidth: 70,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
      {
        id: 'provinceName',
        label: 'Province',
        minWidth: 70,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
      {
        id: 'countryName',
        label: 'Country',
        minWidth: 70,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
      {
        id: 'aboutMe',
        label: 'About Me',
        minWidth: 120,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
    ];
  });

  const deleteSX = (row) => {
    return {
      textDecoration: !values.users_id.includes(row._id) ? 'line-through' : '',
      ...(!values.users_id.includes(row._id) && {
        bgcolor: (theme) =>
          alpha(
            theme.palette.secondary.main,
            theme.palette.action.activatedOpacity
          ),
      }),
    };
  };

  const deleteIconClicked = (selected, setSelected) => {
    const idsToDeleteSet = new Set(selected);
    const newArr = values.users_id.filter((id) => {
      return !idsToDeleteSet.has(id);
    });
    setValues((oldValues) => ({ ...oldValues, users_id: newArr }));
    setSelected([]);
  };


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    localStorage.setItem('roleUsersDataOrder', isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    localStorage.setItem('roleUsersDataOrderBy', property);
    getRole();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    localStorage.setItem(
      'roleUsersDataRowsPerPage',
      parseInt(event.target.value, 10)
    );
    dispatch({
      type: 'ROLES_USER_DATA_PAGENUMBER',
      payload: 0,
    });
    localStorage.setItem('roleUsersDataPage', 0);
    getRole();
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
    localStorage.setItem(
      'roleUsersDataDense',
      JSON.stringify(event.target.checked)
    );
  };

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: 'ROLES_USER_DATA_PAGENUMBER',
      payload: newPage,
    });
    getRole();
  };

  const emptyRows =
    rolesUserDataPageNumber > 0
      ? Math.max(0, (1 + rolesUserDataPageNumber) * rowsPerPage - totalUsers)
      : 0;

  return (
    <Fragment>
      {mainData == undefined ? (
        <CircleToBlockLoading color={theme.palette.secondary.main} />
      ) : (
        <Fragment>
          <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden', borderRadius: 0 }}>
            <Table
              tableName={t('usersData')}
              columns={columns}
              mainData={mainData}
              setMainData={setMainData}
              originalData={usersData}
              deleteSX={deleteSX}
              arrayOfIds={values.users_id}
              deleteIconClicked={deleteIconClicked}
              dense={dense}
              order={order}
              orderBy={orderBy}
              handleRequestSort={handleRequestSort}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              emptyRows={emptyRows}
              handleChangePage={handleChangePage}
              total={totalUsers}
              rowsPerPage={rowsPerPage}
              pageNumber={rolesUserDataPageNumber}
              _id={role_id}
              canDelete={false}
              modelName='Roles'
              lookupFrom='users'
            />
          </Paper>{' '}
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label='Dense padding'
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default UsersStep;
