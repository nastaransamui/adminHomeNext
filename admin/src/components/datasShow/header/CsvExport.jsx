import PropTypes from 'prop-types';
import { forwardRef, useState, Fragment } from 'react';
import cardsShowStyles from '../cards-show-styles';

import {
  Tooltip,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  Divider,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { useTheme } from '@mui/styles';

import { GetApp, Check } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const exportCsvUrl = `/admin/api/users/export`;

const CsvExport = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const { t, rtlActive, dataFields, alertCall } = props;
  const { usersCardView, adminAccessToken } = useSelector((state) => state);

  const exportCsv = async () => {
    try {
      const res = await fetch(exportCsvUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          download: '',
          downloadKey: '',
          finalFolder: 'download',
        }),
      });
      const { status, ok } = res;
      console.log(res);
      if (status !== 200 && !ok) {
        alertCall('error', res.Error, () => {});
      }
      const { fileLink } = await res.json();
      var link = document.createElement('a');
      link.href = fileLink;
      link.download = 'Users.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alertCall('error', error.toString(), () => {});
    }
  };

  return (
    <Fragment ref={ref}>
      {usersCardView && (
        <>
          <Tooltip title={t('csvExport')} arrow placement='bottom'>
            <IconButton
              disableRipple
              disableFocusRipple
              onClick={(e) => {
                exportCsv();
              }}>
              <GetApp fontSize='small' />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Fragment>
  );
});

CsvExport.propTypes = {
  t: PropTypes.func.isRequired,
  rtlActive: PropTypes.bool.isRequired,
};

export default CsvExport;
