import PropTypes from 'prop-types';
import { forwardRef, Fragment } from 'react';
import {
  Tooltip,
  IconButton,
} from '@mui/material';
import { GetApp } from '@mui/icons-material';



const CsvExport = forwardRef((props, ref) => {
  const { t, exportCsv } = props;


  return (
    <Fragment ref={ref}>
        <>
          <Tooltip title={t('csvExport', { ns: 'common' })} arrow placement='bottom'>
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
    </Fragment>
  );
});

CsvExport.propTypes = {
  t: PropTypes.func.isRequired,
  rtlActive: PropTypes.bool.isRequired,
};

export default CsvExport;
