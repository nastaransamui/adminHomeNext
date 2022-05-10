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
import { pushUrl } from './provinceStatic';
import provinceHook from './provinceHook';
import Card from '../../Card/Card';
import CardHeader from '../../Card/CardHeader';
import CardIcon from '../../Card/CardIcon';
import {
  TextValidator,
  ValidatorForm,
  SelectValidator,
} from 'react-material-ui-form-validator';
import CardBody from '../../Card/CardBody';
import provinceStyle from './province-style';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

export default function Province(props) {
  const history = useHistory();
  const classes = provinceStyle();
  const { t } = useTranslation('geoLocations');
  const { rtlActive } = props;
  const {
    values,
    formSubmit,
    formValueChanged,
    setValues,
    RegularMap,
    objIsEmpty,
    childArray,
    expanded,
    handleExpand,
    theme,
    loadMore,
    childExpanded,
    handleChildExpand,
    topRef,
    executeScroll,
  } = provinceHook();
  // console.log(values);
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
                      {t('stateInformation')}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <Grid container spacing={4} style={{ marginTop: 10 }}>
                      <Grid item xs={12} sm={12} lg={2} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t('stateId')}
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
                      <Grid item xs={12} sm={12} lg={4} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t('provinceName')}
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
                        <SelectValidator
                          className={classes.input}
                          autoComplete='off'
                          label={t('type')}
                          value={
                            values.type !== null
                              ? t(`${values.type}`)
                              : t('notDefine')
                          }
                          name='type'
                          variant='standard'
                          validators={['required']}
                          errorMessages={[t('required')]}
                          fullWidth>
                          {[t('notDefine'), t('province'), t('state')].map(
                            (d, i) => {
                              return (
                                <MenuItem
                                  onClick={(e) => {
                                    values.type =
                                      d == t('province')
                                        ? 'province'
                                        : d == t('state')
                                        ? 'state'
                                        : null;
                                    setValues((oldValues) => ({
                                      ...oldValues,
                                    }));
                                  }}
                                  key={i}
                                  value={d}>
                                  {d}
                                </MenuItem>
                              );
                            }
                          )}
                        </SelectValidator>
                      </Grid>
                      <Grid item xs={12} sm={12} lg={2} md={6}>
                        <TextValidator
                          className={classes.input}
                          fullWidth
                          variant='standard'
                          label={t('state_code')}
                          name='state_code'
                          disabled
                          value={values.state_code}
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
                          name='country_id'
                          fullWidth
                          disabled
                          value={values.country_id}
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
                      <LocationOn ref={topRef} />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>{t('stateMap')}</h4>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <Card>
                  <CardHeader color='rose' icon>
                    <CardIcon color='rose'>
                      <Apartment />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>
                      {t('citiesInformation')}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <Accordion
                      expanded={expanded === 'panel1'}
                      onChange={handleExpand('panel1')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'>
                        <Typography>
                          {values.totalCities} {t('cities')}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {childArray == null && expanded !== false ? (
                          <CircleToBlockLoading
                            color={theme.palette.secondary.main}
                          />
                        ) : (
                          <InfiniteScroll
                            dataLength={
                              childArray !== null && childArray.length
                            }
                            next={() => {
                              childArray !== null &&
                                childArray.length < values.totalCities &&
                                loadMore();
                            }}
                            hasMore={
                              childArray == null ||
                              childArray.length < values.totalCities
                                ? true
                                : false
                            }
                            loader={
                              <CircleToBlockLoading
                                style={{
                                  position: 'relative',
                                  right: rtlActive ? '60%' : 0,
                                  left: rtlActive ? 0 : '40%',
                                }}
                                color={theme.palette.secondary.main}
                              />
                            }
                            endMessage={
                              <p style={{ textAlign: 'center' }}>
                                <b>{t('loadDone')}</b>
                              </p>
                            }>
                            {childArray == null ? (
                              <CircleToBlockLoading
                                color={theme.palette.secondary.main}
                              />
                            ) : (
                              childArray.map((city, i) => {
                                return (
                                  <Accordion
                                    key={i.toString()}
                                    expanded={childExpanded == `panel3_${i}`}
                                    onChange={handleChildExpand(`panel3_${i}`)}>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls={`panel3_${i}a-content`}
                                      id={`panel3_${i}a-header`}>
                                      <Typography>{city.name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Grid container spacing={1}>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={6}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            className={classes.input}
                                            variant='standard'
                                            label={t('cityId')}
                                            name='cityId'
                                            disabled
                                            value={city.id}
                                            validators={['required']}
                                            errorMessages={[t('required')]}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={6}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            className={classes.input}
                                            variant='standard'
                                            label={t('cityName')}
                                            name='name'
                                            disabled
                                            value={city.name}
                                            validators={['required']}
                                            errorMessages={[t('required')]}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={6}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            className={classes.input}
                                            variant='standard'
                                            label={t('latitude')}
                                            name='latitude'
                                            disabled
                                            value={city.latitude}
                                            validators={['required']}
                                            errorMessages={[t('required')]}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={6}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            className={classes.input}
                                            variant='standard'
                                            label={t('longitude')}
                                            name='longitude'
                                            disabled
                                            value={city.longitude}
                                            validators={['required']}
                                            errorMessages={[t('required')]}
                                          />
                                        </Grid>
                                      </Grid>
                                    </AccordionDetails>
                                  </Accordion>
                                );
                              })
                            )}
                          </InfiniteScroll>
                        )}
                        {childArray !== null &&
                          childArray.length >= values.totalCities && (
                            <Button
                              fullWidth
                              variant='contained'
                              color='secondary'
                              onClick={executeScroll}
                              sx={{ mb: 5 }}>
                              {t('scroll')}
                            </Button>
                          )}
                      </AccordionDetails>
                    </Accordion>
                  </CardBody>
                </Card>
              </Grid>
            </Grid>
          </ValidatorForm>
        )}
      </Container>
    </div>
  );
}
