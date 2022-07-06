import PropTypes from 'prop-types';
import { useState, useEffect, Fragment, useMemo} from 'react';

import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { CircleToBlockLoading } from 'react-loadingg';

import ExpandAbleTable from '../../../Tables/ExpandAbleTable/ExpandAbleTable';

const RolesData = (props) => {
  const { values, t, classes } = props;
  const theme = useTheme();
  const { roleData } = values;
  const [mainData, setMainData] = useState(undefined);
  const [dense, setDense] = useState(
    JSON.parse(localStorage.getItem('roleDataDense') || false)
  );
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      setMainData(roleData);
    }
    return () => {
      isMount = false;
    };
  }, [roleData]);

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
    localStorage.setItem('roleDataDense', JSON.stringify(event.target.checked));
  };

  const columns = useMemo(() => {
    return [
      { title: 'icon', align: 'center', type: 'icon' },
      { title: 'roleName', align: 'center', type: 'string' },
      { title: 'createdAt', align: 'center', type: 'date' },
      { title: 'updatedAt', align: 'center', type: 'date' },
      { title: 'users_id', align: 'center', type: 'arrayTotal' },
      { title: 'remark', align: 'center', type: 'string' },
    ];
  });

  return (
    <Fragment>
      {mainData == undefined ? (
        <CircleToBlockLoading color={theme.palette.secondary.main} />
      ) : (
        <Fragment>
          <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 420 }}>
              <Table
                stickyHeader
                sx={{ minWidth: 750 }}
                aria-labelledby='tableTitle'
                size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {columns.map((column, i) => {
                      return (
                        <TableCell key={i} align={column.align}>
                          {t(`${column.title}`)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody className={classes.table}>
                  {mainData.map((r, i) => {
                    return (
                      <ExpandAbleTable
                        key={r._id}
                        row={r}
                        columns={columns}
                        t={t}
                        theme={theme}
                        dense={dense}
                        mainFieldExpand='routes'
                        deepFieldExpand='views'
                        headerTitles='crud'
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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

RolesData.propTypes = {
  values: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default RolesData;
