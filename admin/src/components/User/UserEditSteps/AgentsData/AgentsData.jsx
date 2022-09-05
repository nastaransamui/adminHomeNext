import { Fragment, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { useSelector, useDispatch } from 'react-redux';
import { CircleToBlockLoading } from 'react-loadingg';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Table from '../../../Tables/UserTable/Table';

const AgentsData = (props) => {
  const { values, t, totalAgents, getUser, _id, setValues } = props;
  const { dataAgentPageNumber } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { agentsData } = values;
  const [mainData, setMainData] = useState(undefined);
  const theme = useTheme();
  const [rowsPerPage, setRowsPerPage] = useState(
    JSON.parse(localStorage.getItem('agentDataRowsPerPage')) || 5
  );
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

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      getUser();
    }
    return () => {
      isMount = false;
    };
  }, [dataAgentPageNumber]);

  const columns = useMemo(() => {
    return [
      {
        id: 'agentName',
        label: 'Agent Name',
        align: 'center',
        minWidth: 180,
        disablePadding: true,
        type: 'string',
      },
      {
        id: 'isActive',
        label: 'Activation',
        minWidth: 70,
        align: 'center',
        disablePadding: true,
        type: 'boolean',
      },
      {
        id: 'email',
        label: 'Email',
        align: 'center',
        minWidth: 300,
        disablePadding: true,
        type: 'string',
      },
      {
        id: 'phones',
        label: 'Phones',
        align: 'center',
        minWidth: 180,
        disablePadding: true,
        type: 'phonesArray',
      },
      {
        id: 'agentId',
        label: 'Agent Id',
        minWidth: 120,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
      {
        id: 'creditAmount',
        label: 'Credit',
        minWidth: 170,
        align: 'center',
        disablePadding: false,
        type: 'number',
      },
      {
        id: 'depositAmount',
        label: 'Deposit',
        minWidth: 170,
        align: 'center',
        disablePadding: false,
        type: 'number',
      },
      {
        id: 'remainCreditAmount',
        label: 'Remain Credit',
        minWidth: 170,
        align: 'center',
        disablePadding: false,
        type: 'number',
      },
      {
        id: 'remainDepositAmount',
        label: 'Remain Deposit',
        minWidth: 170,
        align: 'center',
        disablePadding: false,
        type: 'number',
      },
      {
        id: 'address',
        label: 'Address',
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
        id: 'remark',
        label: 'Remark',
        minWidth: 120,
        align: 'center',
        disablePadding: false,
        type: 'string',
      },
    ];
  });

  const deleteSX = (row) => {
    return {
      textDecoration: !values.agents_id.includes(row._id) ? 'line-through' : '',
      ...(!values.agents_id.includes(row._id) && {
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
    const newArr = values.agents_id.filter((id) => {
      return !idsToDeleteSet.has(id);
    });
    setValues((oldValues) => ({ ...oldValues, agents_id: newArr }));
    setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    localStorage.setItem('agentDataOrder', isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    localStorage.setItem('agentDataOrderBy', property);
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

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: 'DATA_AGENT_PAGENUMBER',
      payload: newPage,
    });
    getUser();
  };

  const emptyRows =
    dataAgentPageNumber > 0
      ? Math.max(0, (1 + dataAgentPageNumber) * rowsPerPage - totalAgents)
      : 0;
  return (
    <Fragment>
      {mainData == undefined ? (
        <CircleToBlockLoading color={theme.palette.secondary.main} />
      ) : (
        <Fragment>
          <Paper
            sx={{ width: '100%', mb: 2, overflow: 'hidden', borderRadius: 0 }}>
            <Table
              tableName={t('agentData')}
              columns={columns}
              mainData={mainData}
              setMainData={setMainData}
              originalData={agentsData}
              deleteSX={deleteSX}
              arrayOfIds={values.agents_id}
              deleteIconClicked={deleteIconClicked}
              dense={dense}
              order={order}
              orderBy={orderBy}
              handleRequestSort={handleRequestSort}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              emptyRows={emptyRows}
              handleChangePage={handleChangePage}
              total={totalAgents}
              rowsPerPage={rowsPerPage}
              pageNumber={dataAgentPageNumber}
              _id={_id}
              canDelete={true}
              modelName='Users'
              lookupFrom='agencies'
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

AgentsData.propTypes = {
  values: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  totalAgents: PropTypes.number.isRequired,
  getUser: PropTypes.func.isRequired,
  _id: PropTypes.string.isRequired,
  setValues: PropTypes.func.isRequired,
};

export default AgentsData;
