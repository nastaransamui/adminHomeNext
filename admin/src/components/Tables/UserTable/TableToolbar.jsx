import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';

import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { StyledBox } from '../../datasShow/headerView/MainHeader';
import LookupSearch from '../../LookupSearch/LookupSearch';

const TableToolbar = (props) => {
  const {
    columns,
    tableName,
    numSelected,
    deleteIconClicked,
    selected,
    setSelected,
    setMainData,
    originalData,
    _id,
  } = props;
  const theme = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const { t } = useTranslation('common');
  return (
    <Fragment>
      <StyledBox
        viewpanel='filter'
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          display: 'flex',
          flexDirection: {
            xs: 'column-reverse',
            sm: 'row',
            md: 'row',
            lg: 'row',
          },
          alignItems: 'center',
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
        maxWidth='xl'
        showsearch={showSearch.toString()}
        className={
          showSearch
            ? 'animate__animated animate__zoomIn filter'
            : 'animate__animated animate__zoomOut filter'
        }>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color='inherit'
            variant='subtitle1'
            component='div'>
            {numSelected} {t('selected')}
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant='subtitle1'
            id='tableTitle'
            component='div'>
            <LookupSearch
              columns={columns}
              setMainData={setMainData}
              originalData={originalData}
              _id={_id}
            />
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title={t('delete')} arrow>
            <IconButton
              disableRipple
              onClick={() => {
                deleteIconClicked(selected, setSelected);
              }}>
              <DeleteIcon style={{ color: theme.palette.secondary.main }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={t('closeSearch')} arrow>
            <IconButton
              disableRipple
              onClick={() => {
                setShowSearch(!showSearch);
              }}>
              <Close style={{ color: theme.palette.secondary.main }} />
            </IconButton>
          </Tooltip>
        )}
      </StyledBox>
      <StyledBox
        maxWidth='xl'
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
        viewpanel='view'
        showsearch={showSearch.toString()}
        style={{
          display: 'flex',
          minHeight: 30,
          alignItems: 'center',
        }}
        className={
          showSearch
            ? 'animate__animated animate__zoomOut view'
            : 'animate__animated animate__zoomIn view'
        }>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color='inherit'
            variant='subtitle1'
            component='div'>
            {numSelected} {t('selected')}
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant='subtitle1'
            id='tableTitle'
            component='div'>
            {tableName}
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title={t('delete')} arrow>
            <IconButton
              disableRipple
              onClick={() => {
                deleteIconClicked(selected, setSelected);
              }}>
              <DeleteIcon style={{ color: theme.palette.secondary.main }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={t('search')} arrow>
            <IconButton
              disableRipple
              onClick={() => {
                setShowSearch(!showSearch);
              }}>
              <Search style={{ color: theme.palette.secondary.main }} />
            </IconButton>
          </Tooltip>
        )}
      </StyledBox>
    </Fragment>
  );
};

TableToolbar.propTypes = {
  tableName: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  deleteIconClicked: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
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
  setMainData: PropTypes.func.isRequired,
  originalData: PropTypes.array.isRequired,
};
export default TableToolbar;
