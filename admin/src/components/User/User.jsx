import { Fragment } from 'react';
import userStyle from './user-style';

import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';

import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useQuery } from '../../pages/dashboard/ReactRouter';

import { pushUrl } from './userStatic';
import CreateUser from './CreateUser';
import userHook from './userHook';
import { ValidatorForm } from 'react-material-ui-form-validator';
import EditUser from './EditUser';
import { useDispatch } from 'react-redux';

export default function User(props) {
  const { rtlActive } = props;
  let query = useQuery();
  const _id = query.get('_id');
  const classes = userStyle();
  const { t } = useTranslation('users');

  const history = useHistory();
  const hookes = userHook();
  const dispatch = useDispatch();

  // console.log(_id);

  // console.log(values);
  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <Tooltip title={t('goBack')} arrow placement='bottom'>
          <IconButton
            onClick={() => {
              //Reset pagenumber of agents
              dispatch({
                type: 'DATA_AGENT_PAGENUMBER',
                payload: 0,
              });
              history.push(pushUrl);
            }}>
            {rtlActive ? <ArrowForward /> : <ArrowBack />}
          </IconButton>
        </Tooltip>
        <ValidatorForm onSubmit={hookes.formSubmit}>
          {_id == null ? (
            <CreateUser {...hookes} classes={classes} t={t} _id={_id} />
          ) : (
            <EditUser
              {...hookes}
              classes={classes}
              t={t}
              _id={_id}
              rtlActive={rtlActive}
            />
          )}
        </ValidatorForm>
      </Fragment>
    </Container>
  );
}
