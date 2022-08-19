import { Fragment } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { pushUrl } from './hotelStatic';

import Wizard from '../../../Wizard/Wizard';
import hotelHook from './hotelHook';
import { ValidatorForm } from 'react-material-ui-form-validator';
import PublicData from './Steps/PublicData/PublicData';
import LocationData from './Steps/LocationData/LocationData';
import Images from './Steps/Images/Images';
import useButtonActivation from '../../../Hooks/useButtonActivation';
// import UsersStep from './Steps/Users/UsersStep'
import { useDispatch } from 'react-redux';

const Hotel = (props) => {
  const { rtlActive, reactRoutes } = props;
  const { t } = useTranslation('roles');
  const history = useHistory();
  // const dispatch = useDispatch();
  const {
    formSubmit,
    values,
    setValues,
    _id,
    isPublicDataValidated,
    hotelRoute,
    handleChange,
    errorRequied,
    setErrorRequied,
    isLocationDataValidated,
    RegularMap,
    isImageValidate,
    fileObjects,
    onImageAdd,
    onImageDelete,
    onThumbButtonClick,
    onDeleteButtonClick,
  } = hotelHook(reactRoutes);

  const { createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(hotelRoute);
  // console.log(values)

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <Tooltip title={t('goBack', { ns: 'common' })} arrow placement='bottom'>
          <IconButton
            onClick={() => {
              //Reset pagenumber of agents
              // dispatch({
              console.log('Reset pagenumber of lookup');
              //   type: 'DATA_AGENT_PAGENUMBER',
              //   payload: 0,
              // });
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
                    stepName: t('publicData'),
                    stepComponent: PublicData,
                    stepId: 'publicData',
                    isValidated: isPublicDataValidated,
                    handleChange: handleChange,
                    values: values,
                    setValues: setValues,
                    errorRequied: errorRequied,
                    setErrorRequied: setErrorRequied,
                    createButtonDisabled: createButtonDisabled,
                    updateButtonDisabled: updateButtonDisabled,
                    RegularMap: RegularMap,
                    ...props,
                  },
                  {
                    stepName: t('locationData'),
                    stepComponent: LocationData,
                    stepId: 'locationData',
                    isValidated: isLocationDataValidated,
                    handleChange: handleChange,
                    values: values,
                    setValues: setValues,
                    errorRequied: errorRequied,
                    setErrorRequied: setErrorRequied,
                    RegularMap: RegularMap,
                    ...props,
                  },
                  {
                    stepName: t('Images'),
                    stepComponent: Images,
                    stepId: 'Images',
                    isValidated: isImageValidate,
                    values: values,
                    errorRequied: errorRequied,
                    createButtonDisabled: createButtonDisabled,
                    updateButtonDisabled: updateButtonDisabled,
                    handleChange: handleChange,
                    fileObjects: fileObjects,
                    onImageAdd: onImageAdd,
                    onImageDelete: onImageDelete,
                    onThumbButtonClick: onThumbButtonClick,
                    onDeleteButtonClick: onDeleteButtonClick,
                    ...props,
                  },
                ].filter(Boolean)}
                title={values.hotelName}
                subtitle={values?.countryName}
                finishButtonClick={(e) => {
                  //Validate last form
                  isImageValidate() && formSubmit()
                }}
                previousButtonText={t('previous')}
                nextButtonText={t('next')}
                finishButtonText={t('finish')}
                nextButtonClick={(e) => isPublicDataValidated()}
              />
            </ValidatorForm>
          </Grid>
        </Grid>
      </Fragment>
    </Container>
  );
};

export default Hotel;
