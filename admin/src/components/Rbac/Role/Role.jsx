import { Fragment  } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { pushUrl } from './roleStatic';
import Wizard from '../../Wizard/Wizard';
import roleHook from './roleHook';
import {
  ValidatorForm,
} from 'react-material-ui-form-validator';
import Name from './Steps/Name/Name';
import RoutesStep from './Steps/Routes/RoutesStep';
import CrudStep from './Steps/CrudStep/CrudStep';


const Role = (props) => {
  const { rtlActive } = props;
  const { t } = useTranslation('roles');
  const history = useHistory();
  const {
    formSubmit,
    handleChange,
    values,
    setValues,
    isValidated,
    roleNameError,
    handleAddRoutes,
    handleRemoveRoutes,
    role_id
  } = roleHook();

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <Tooltip title={t('goBack')} arrow placement='bottom'>
          <IconButton
            onClick={() => {
              history.push(pushUrl);
            }}>
            {rtlActive ? <ArrowForward /> : <ArrowBack />}
          </IconButton>
        </Tooltip>
        <Grid container justifyContent='center'>
          <Grid item xs={12} sm={8}>
            <ValidatorForm onSubmit={formSubmit}>
              <Wizard
                rtlActive={rtlActive}
                validate
                steps={[
                  {
                    stepName: t('name'),
                    stepComponent: Name,
                    stepId: 'name',
                    isValidated: isValidated,
                    handleChange: handleChange,
                    values: values,
                    roleNameError: roleNameError,
                    setValues: setValues,
                    role_id: role_id
                  },
                  {
                    stepName: t('routes'),
                    stepComponent: RoutesStep,
                    stepId: 'routes',
                    isValidated: isValidated,
                    handleAddRoutes: handleAddRoutes,
                    handleRemoveRoutes: handleRemoveRoutes,
                    handleChange: handleChange,
                    values: values,
                    roleNameError: roleNameError,
                    role_id: role_id
                  },
                  {
                    stepName: t('curd'),
                    stepComponent: CrudStep,
                    stepId: 'curd',
                    isValidated: isValidated,
                    handleChange: handleChange,
                    values: values,
                    setValues: setValues,
                    roleNameError: roleNameError,
                    role_id: role_id
                  },
                ]}
                title={t('createRouteTitle')}
                subtitle={t('createRouteSubTitle')}
                finishButtonClick={(e) => formSubmit()}
                previousButtonText={t('previous')}
                nextButtonText={t('next')}
                finishButtonText={t('finish')}
              />
            </ValidatorForm>
          </Grid>
        </Grid>
      </Fragment>
    </Container>
  );
};

export default Role;
