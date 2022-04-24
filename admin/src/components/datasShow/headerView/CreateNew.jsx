import PropTypes from 'prop-types';
import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip, IconButton } from '@mui/material';

import { useHistory } from 'react-router-dom';
import { Add } from '@mui/icons-material';

const CreateNew = forwardRef((props, ref) => {
  const { usersCardView } = useSelector((state) => state);
  const { t, createUrl } = props;
  const history = useHistory();

  return (
    <Fragment ref={ref}>
          <Tooltip title={t('createNew')} arrow placement='bottom'>
            <IconButton
              disableFocusRipple
              disableRipple
              onClick={(e) => {
                e.preventDefault();
                history.push({
                  pathname: createUrl ,
                });
              }}>
              <Add fontSize='small' />
            </IconButton>
          </Tooltip>
    </Fragment>
  );
});

CreateNew.propTypes = {
  t: PropTypes.func.isRequired,
  createUrl : PropTypes.string.isRequired
};

export default CreateNew;
