import { Fragment } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Wizard from '../../Wizard/Wizard';
import roleHook from './roleHook';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Name from './Steps/Name/Name';
import RoutesStep from './Steps/Routes/RoutesStep';
import CrudStep from './Steps/CrudStep/CrudStep';
import useButtonActivation from '../../Hooks/useButtonActivation';
import UsersStep from './Steps/Users/UsersStep'
import { useDispatch } from 'react-redux';

const Role = (props) => {
  const { rtlActive, reactRoutes } = props;
  const { t } = useTranslation('roles');
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    formSubmit,
    handleChange,
    values,
    setValues,
    isValidated,
    isRouteValidate,
    roleNameError,
    handleAddRoutes,
    handleRemoveRoutes,
    role_id,
    pushUrl,
    roleRoute,
    routeValidate,
    totalUsers,
    getRole
  } = roleHook(reactRoutes);

  const { createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(roleRoute);


  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <Tooltip title={t('goBack')} arrow placement='bottom'>
          <IconButton
            onClick={() => {
               //Reset pagenumber of agents
               dispatch({
                type: 'ROLES_USER_DATA_PAGENUMBER',
                payload: 0,
              });
              history.push(pushUrl);
            }}>
            {rtlActive ? <ArrowForward /> : <ArrowBack />}
          </IconButton>
        </Tooltip>
        <Grid container justifyContent='center'>
          <Grid item lg={11} xl={10} xs={12} sm={8}>
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
                    handleAddRoutes: handleAddRoutes,
                    handleRemoveRoutes: handleRemoveRoutes,
                    handleChange: handleChange,
                    values: values,
                    roleNameError: roleNameError,
                    setValues: setValues,
                    role_id: role_id,
                    routeValidate: routeValidate,
                    createButtonDisabled: createButtonDisabled,
                    updateButtonDisabled: updateButtonDisabled,
                    totalUsers: totalUsers,
                    getRole:getRole,
                    ...props
                  },
                  {
                    stepName: t('routes'),
                    stepComponent: RoutesStep,
                    stepId: 'routes',
                    isValidated: isRouteValidate,
                    handleAddRoutes: handleAddRoutes,
                    handleRemoveRoutes: handleRemoveRoutes,
                    handleChange: handleChange,
                    values: values,
                    roleNameError: roleNameError,
                    setValues: setValues,
                    role_id: role_id,
                    routeValidate: routeValidate,
                    createButtonDisabled: createButtonDisabled,
                    updateButtonDisabled: updateButtonDisabled,
                    totalUsers: totalUsers,
                    getRole:getRole,
                    ...props
                  },
                  {
                    stepName: t('crud'),
                    stepComponent: CrudStep,
                    stepId: 'crud',
                    isValidated: isRouteValidate,
                    handleAddRoutes: handleAddRoutes,
                    handleRemoveRoutes: handleRemoveRoutes,
                    handleChange: handleChange,
                    values: values,
                    roleNameError: roleNameError,
                    setValues: setValues,
                    role_id: role_id,
                    routeValidate: routeValidate,
                    createButtonDisabled: createButtonDisabled,
                    updateButtonDisabled: updateButtonDisabled,
                    totalUsers: totalUsers,
                    getRole:getRole,
                    ...props
                  },values.users_id !== undefined && {
                    stepName: t('users'),
                    stepComponent: UsersStep,
                    isValidated: isValidated,
                    handleChange: handleChange,
                    stepId: 'users',
                    values: values,
                    setValues: setValues,
                    role_id: role_id,
                    createButtonDisabled: createButtonDisabled,
                    updateButtonDisabled: updateButtonDisabled,
                    totalUsers: totalUsers,
                    getRole:getRole,
                    ...props
                  }
                ].filter(Boolean)}
                title={values.roleName}
                subtitle={t('createRouteSubTitle')}
                finishButtonClick={(e) => formSubmit()}
                previousButtonText={t('previous')}
                nextButtonText={t('next')}
                finishButtonText={
                  role_id == undefined ? t('finish') : t('edit')
                }
              />
            </ValidatorForm>
          </Grid>
        </Grid>
      </Fragment>
    </Container>
  );
};

export default Role;
