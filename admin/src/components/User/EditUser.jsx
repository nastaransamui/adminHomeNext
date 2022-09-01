import { Fragment } from 'react';
import Wizard from '../Wizard/Wizard';
import CreateUser from './CreateUser';
import RolesData from './UserEditSteps/RolesData/RolesData';
import AgentsData from './UserEditSteps/AgentsData/AgentsData';

const EditUser = (props) => {
  const {
    rtlActive,
    t,
    isValidated,
    handleChange,
    values,
    passwordError,
    setValues,
    formSubmit,
    _id,
    updateRoleName,
  } = props;

  return (
    <Fragment>
      <Wizard
        rtlActive={rtlActive}
        validate
        steps={[
          {
            stepName: t('userdata'),
            stepComponent: CreateUser,
            stepId: 'CreateUser',
            isValidated: isValidated,
            handleChange: handleChange,
            values: values,
            passwordError: passwordError,
            setValues: setValues,
            _id: _id,
            ...props,
          },
          {
            stepName: t('Rolesdata'),
            stepComponent: RolesData,
            stepId: 'RolesData',
            isValidated: isValidated,
            handleChange: handleChange,
            values: values,
            passwordError: passwordError,
            setValues: setValues,
            _id: _id,
            ...props,
          },
          {
            stepName: t('AgentsData'),
            stepComponent: AgentsData,
            stepId: 'AgentsData',
            isValidated: isValidated,
            handleChange: handleChange,
            values: values,
            passwordError: passwordError,
            setValues: setValues,
            _id: _id,
            ...props,
          },
        ]}
        title={t('editUserTitle')}
        subtitle={t('editUserSubTitle')}
        finishButtonClick={(e) => formSubmit()}
        previousButtonText={t('previous')}
        nextButtonText={
          values.roleName !== '' &&
          updateRoleName.changed &&
          updateRoleName.roleName !== values.roleName
            ? t('finish')
            : t('next')
        }
        finishButtonText={t('finish')}
      />
    </Fragment>
  );
};

export default EditUser;
