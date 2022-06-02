import {
  AddLocation,
  ArrowBack,
  ArrowForward,
  Apartment,
  LocationOn,
} from '@mui/icons-material';
import {
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../../Heading/Heading';
import { useTranslation } from 'react-i18next';
import { pushUrl } from './cityStatic';
import cityHook from './cityHook';
import Card from '../../Card/Card';
import CardHeader from '../../Card/CardHeader';
import CardIcon from '../../Card/CardIcon';
import {
  TextValidator,
  ValidatorForm,
  SelectValidator,
} from 'react-material-ui-form-validator';
import CardBody from '../../Card/CardBody';
import cityStyle from './city-style';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

export default function City(props) {
  const history = useHistory();
  const classes = cityStyle();
  const { t } = useTranslation('geoLocations');
  const { rtlActive } = props;
  const {
    values,
    formSubmit,
    formValueChanged,
    setValues,
    RegularMap,
    objIsEmpty,
    theme,
  } = cityHook();
  console.log(values);
  // console.log(childArray);

  return (
    <div style={{ minWidth: '100%' }}>
      <Tooltip title={t('goBack')} arrow placement='bottom'>
        <IconButton
          onClick={() => {
            history.push(pushUrl);
          }}>
          {rtlActive ? <ArrowForward /> : <ArrowBack />}
        </IconButton>
      </Tooltip>
      <Heading
        title={!objIsEmpty(values) && `${values.name}  ${values.emoji}`}
        textAlign='center'
      />
      <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
        {!objIsEmpty(values) && (
          <ValidatorForm onSubmit={formSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <Card style={{ minHeight: '368px' }}>
                  <CardHeader color='rose' icon>
                    <CardIcon color='rose'>{values.emoji}</CardIcon>
                    <h4 className={classes.cardIconTitle}>
                      {t('cityInformation')}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <Grid container spacing={4} style={{ marginTop: 10 }}>
                      <Grid item xs={12} sm={12} lg={3} md={6}>
                        <TextValidator
                          className={classes.input}
                          variant='standard'
                          label={t('countryName')}
                          name='country'
                          fullWidth
                          disabled
                          value={values.country}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={3} md={6}>
                        <TextValidator
                          className={classes.input}
                          variant='standard'
                          label={t('country_id')}
                          name='countryId'
                          fullWidth
                          disabled
                          value={values.countryId}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={4} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t('provinceName')}
                          disabled
                          name='state_name'
                          value={values.state_name}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={2} md={6}>
                        <TextValidator
                          className={classes.input}
                          fullWidth
                          variant='standard'
                          label={t('state_id')}
                          name='stateId'
                          disabled
                          value={values.stateId}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={2} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t('cityId')}
                          name='id'
                          disabled
                          value={values.id}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={4} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t('cityName')}
                          name='name'
                          value={values.name}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={3} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          type='number'
                          onKeyDown={(e) =>
                            e.keyCode === 69 && e.preventDefault()
                          }
                          label={t('latitude')}
                          name='latitude'
                          value={values.latitude}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={3} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          type='number'
                          onKeyDown={(e) =>
                            e.keyCode === 69 && e.preventDefault()
                          }
                          label={t('longitude')}
                          name='longitude'
                          value={values.longitude}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                    </Grid>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Card>
                  <CardHeader color='rose' icon>
                    <CardIcon color='rose'>
                      <LocationOn />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>{t('cityMap')}</h4>
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

            <Button
              fullWidth
              variant='contained'
              color='secondary'
              type='submit'
              sx={{ mb: 5 }}>
              {t('submit')}
            </Button>
          </ValidatorForm>
        )}
      </Container>
    </div>
  );
}
