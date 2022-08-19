import { Fragment, forwardRef } from 'react';
import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import locationStyle from './location-style';
import SelectValidator from 'react-material-ui-form-validator/lib/SelectValidator';
import TextValidator from 'react-material-ui-form-validator/lib/TextValidator';
import Card from '../../../../../Card/Card';
import CardHeader from '../../../../../Card/CardHeader';
import CardIcon from '../../../../../Card/CardIcon';
import CardBody from '../../../../../Card/CardBody';
import LocationOn from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import Autocomplete from '../../../../../Autocomplete/Autocomplete';

import { countryUrl, provinceUrl, cityUrl } from '../../hotelStatic';

const LocationData = (props) => {
  const {
    values,
    handleChange,
    setValues,
    errorRequied,
    setErrorRequied,
    topRef,
    RegularMap,
  } = props;
  const classes = locationStyle();
  const theme = useTheme();
  const { t } = useTranslation('hotels');
  return (
    <Fragment>
      <div className={classes.div}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <Card style={{ minHeight: '489px' }}>
              <CardHeader color='rose' icon>
                <CardIcon color='rose'>
                  <PublicIcon ref={topRef} />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  {t('countryInformation')}
                </h4>
              </CardHeader>
              <CardBody>
                <Grid container spacing={3} style={{ marginTop: 10 }}>
                  <Grid item xs={12} sm={12} lg={4} md={6}>
                    <Autocomplete
                      required
                      modelName='Countries'
                      componentName='Cities'
                      optionsUrl={cityUrl}
                      nameValue='cityName'
                      value={values.cityName}
                      setValues={setValues}
                      values={values}
                      arrayIdName='city_id'
                      roleNameError={errorRequied.cityName}
                      componentInUse='Hotel'
                      setRoleNameError={setErrorRequied}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4} md={6}>
                    <Autocomplete
                      required
                      modelName='Countries'
                      componentName='Provinces'
                      optionsUrl={provinceUrl}
                      nameValue='provinceName'
                      value={values.provinceName}
                      setValues={setValues}
                      values={values}
                      arrayIdName='province_id'
                      roleNameError={errorRequied.provinceName}
                      componentInUse='Hotel'
                      setRoleNameError={setErrorRequied}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4} md={6}>
                    <Autocomplete
                      required
                      modelName='Countries'
                      componentName='Countries'
                      optionsUrl={countryUrl}
                      nameValue='countryName'
                      value={values.countryName}
                      setValues={setValues}
                      values={values}
                      arrayIdName='country_id'
                      roleNameError={errorRequied.countryName}
                      componentInUse='Hotel'
                      setRoleNameError={setErrorRequied}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6} md={6}>
                    <TextValidator
                      fullWidth
                      className={classes.input}
                      variant='standard'
                      // disabled={updateButtonDisabled}
                      type='number'
                      onKeyDown={(e) => e.keyCode === 69 && e.preventDefault()}
                      label={t('latitude')}
                      name='latitude'
                      value={values.latitude}
                      onChange={handleChange('latitude')}
                      validators={['required']}
                      errorMessages={[t('required')]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6} md={6}>
                    <TextValidator
                      fullWidth
                      className={classes.input}
                      variant='standard'
                      // disabled={updateButtonDisabled}
                      type='number'
                      onKeyDown={(e) => e.keyCode === 69 && e.preventDefault()}
                      label={t('longitude')}
                      name='longitude'
                      value={values.longitude}
                      onChange={handleChange('longitude')}
                      validators={['required']}
                      errorMessages={[t('required')]}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={12}
                    md={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 2,
                      color: theme.palette.text.color,
                    }}>
                    <Typography variant='subtitle1'>{t('mapCoordinate')}</Typography>
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color='rose' icon>
                <CardIcon color='rose'>
                  <LocationOn ref={topRef} />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>{t('countryMap')}</h4>
              </CardHeader>
              <CardBody>
                <RegularMap
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_KEY}`}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div className={classes.mapDiv} />}
                  mapElement={<div style={{ height: `100%` }} />}
                />
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};
export default LocationData;
