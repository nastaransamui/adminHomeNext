import PropTypes from 'prop-types';
import { useState,  Fragment, forwardRef } from 'react';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Done from '@mui/icons-material/Done';
import Close from '@mui/icons-material/Close';

import moment from 'moment';


const CustomCollapse = forwardRef((props, ref) => {
  const { open, children } = props;
  return (
    <Collapse in={open} ref={ref} {...props} timeout='auto' unmountOnExit>
      {children}
    </Collapse>
  );
});

const ExpandAbleTable = (props) => {
  const {
    row,
    t,
    theme,
    dense,
    columns,
    mainFieldExpand,
    deepFieldExpand,
    headerTitles,
  } = props;
  const [open, setOpen] = useState({
    [mainFieldExpand]: false,
  });

  const CollapseButton = ({ collapseName, row }) => {
    return (
      <TableCell>
        <IconButton
          aria-label='expand row'
          size='small'
          onClick={() =>
            setOpen((prev) => ({
              ...prev,
              [collapseName]:
                prev[collapseName] == undefined ? true : !prev[collapseName],
            }))
          }>
          {Array.isArray(row) ||
          (row[deepFieldExpand] !== undefined && row[deepFieldExpand]?.length) >
            0 ? (
            open[collapseName] ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )
          ) : null}
        </IconButton>
      </TableCell>
    );
  };

  const MainRow = () => {
    return columns.map((col, i) => {
      switch (col.type) {
        case 'string':
          return (
            <Tooltip
              key={i}
              arrow
              title={row[col.title].length > 20 ? row[col.title] : ''}>
              <TableCell align={col.align}>{`${row[col.title].slice(0, 20)} ${
                row[col.title].length > 20 ? '...' : ''
              }`}</TableCell>
            </Tooltip>
          );
        case 'date':
          return (
            <TableCell key={i} align={col.align}>
              {moment(new Date(row[col.title].slice(0, -1))).format(
                'MMMM Do YYYY, H:mm'
              )}
            </TableCell>
          );
        case 'icon':
          return (
            <TableCell key={i} component='th' scope='row' align={col.align}>
              <SvgIcon
                style={{ color: theme.palette.secondary.main }}
                sx={{ mr: 2 }}>
                <path d={`${row[col.title]}`} />
              </SvgIcon>
            </TableCell>
          );
        case 'arrayTotal':
          return (
            <TableCell key={i} align={col.align}>
              {row[col.title].length}
            </TableCell>
          );
      }
    });
  };

  const CollapseHeader = () => {
    return (
      <Fragment>
        <TableCell />
        <TableCell>{t('routeName')}</TableCell>
        {row[mainFieldExpand][0][headerTitles].map((c, j) => {
          return (
            <TableCell
              align='center'
              key={j}
              sx={{ borderRight: `1px solid rgba(81, 81, 81, 1)` }}>
              {c.name}
            </TableCell>
          );
        })}
      </Fragment>
    );
  };

  const TableCollapseRows = ({ openName, row }) => {
    return (
      <Fragment>
        <CollapseButton collapseName={openName} row={row} />
        <TableCell component='th' scope='row'>
          {row[`name_en-US`]}
        </TableCell>
        {row[headerTitles].map((c, j) => {
          return (
            <TableCell
              align='center'
              key={j}
              sx={{
                borderRight: `1px solid rgba(81, 81, 81, 1)`,
              }}>
              {c.active ? (
                <Done style={{ color: theme.palette.success.main }} />
              ) : (
                <Close style={{ color: theme.palette.error.main }} />
              )}
            </TableCell>
          );
        })}
      </Fragment>
    );
  };

  const CollapseBody = ({ children, name, openName }) => {
    return (
      <TableCell
        style={{
          paddingBottom: 0,
          paddingTop: 0,
          width: '100%',
        }}
        colSpan={8}>
        <CustomCollapse open={open[openName]}>
          <Box sx={{ margin: 1 }}>
            <Typography variant='h6' gutterBottom component='div'>
              {t(name)}
            </Typography>
            <Table size={dense ? 'small' : 'medium'} aria-label='routes'>
              <TableHead sx={{ borderTop: `1px solid rgba(81, 81, 81, 1)` }}>
                <TableRow>
                  <CollapseHeader />
                </TableRow>
              </TableHead>
              {children}
            </Table>
          </Box>
        </CustomCollapse>
      </TableCell>
    );
  };

  return (
    <Fragment>
      <TableRow>
        <CollapseButton
          collapseName={mainFieldExpand}
          row={row[mainFieldExpand]}
        />
        <MainRow />
      </TableRow>
      <TableRow>
        <CollapseBody name='routes' openName={mainFieldExpand}>
          <TableBody>
            {row[mainFieldExpand].map((route, index) => {
              return (
                <Fragment key={index}>
                  <TableRow>
                    <TableCollapseRows
                      row={route}
                      openName={`${route[`name_en-US`]}_${index}`}
                    />
                  </TableRow>
                  <TableRow>
                    <CollapseBody
                      name='view'
                      openName={`${route[`name_en-US`]}_${index}`}>
                      <TableBody>
                        {route[deepFieldExpand].length > 0 &&
                          route[deepFieldExpand].map((second, i) => {
                            return (
                              <Fragment key={i}>
                                <TableRow>
                                  <TableCollapseRows
                                    row={second}
                                    openName={`${second[`name_en-US`]}_${i}`}
                                  />
                                </TableRow>
                                <TableRow>
                                  <CollapseBody
                                    name='view2'
                                    openName={`${second[`name_en-US`]}_${i}`}>
                                    <TableBody>
                                      {second[deepFieldExpand].length > 0 &&
                                        second[deepFieldExpand].map(
                                          (third, j) => {
                                            return (
                                              <Fragment key={j}>
                                                <TableRow>
                                                  <TableCollapseRows
                                                    row={third}
                                                    openName={`${
                                                      third[`name_en-US`]
                                                    }_${j}`}
                                                  />
                                                </TableRow>
                                              </Fragment>
                                            );
                                          }
                                        )}
                                    </TableBody>
                                  </CollapseBody>
                                </TableRow>
                              </Fragment>
                            );
                          })}
                      </TableBody>
                    </CollapseBody>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </CollapseBody>
      </TableRow>
    </Fragment>
  );
};

ExpandAbleTable.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  dense: PropTypes.bool.isRequired,
  mainFieldExpand: PropTypes.string.isRequired,
  deepFieldExpand: PropTypes.string.isRequired,
  headerTitles: PropTypes.string.isRequired,
};

export default ExpandAbleTable