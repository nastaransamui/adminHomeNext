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
import { pushUrl } from './countryStatic';
import countryHook from './countryHook';
import Card from '../../Card/Card';
import CardHeader from '../../Card/CardHeader';
import CardIcon from '../../Card/CardIcon';
import {
  TextValidator,
  ValidatorForm,
  SelectValidator,
} from 'react-material-ui-form-validator';
import CardBody from '../../Card/CardBody';
import countryStyle from './country-style';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

export default function Country(props) {
  const history = useHistory();
  const classes = countryStyle();
  const { t, i18n } = useTranslation('geoLocations');
  const languagesArray = Object.keys(i18n.options.resources);
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
    timeExpanded,
    handleTimeExpand,
    childExpanded,
    handleChildExpand,
    topRef,
    executeScroll,
  } = countryHook();
  
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
        title={!objIsEmpty(values) && 
          rtlActive ? `${values.emoji} ${values.translations.fa} ` : `${values.name}  ${values.emoji}`}
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
                      {t('countryInformation')}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <Grid container spacing={4} style={{ marginTop: 10 }}>
                      <Grid item xs={12} sm={12} lg={2} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t('countryId')}
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
                      <Grid item xs={12} sm={12} lg={2} md={6}>
                        <TextValidator
                          className={classes.input}
                          variant='standard'
                          label={t('iso2')}
                          name='iso2'
                          fullWidth
                          disabled
                          value={values.iso2}
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
                          variant='standard'
                          label={t('iso3')}
                          name='iso3'
                          fullWidth
                          disabled
                          value={values.iso3}
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
                          variant='standard'
                          label={t('numeric_code')}
                          name='numeric_code'
                          fullWidth
                          disabled
                          value={values.numeric_code}
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
                          variant='standard'
                          label={t('phone_code')}
                          name='phone_code'
                          fullWidth
                          value={values.phone_code}
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
                          variant='standard'
                          label={t('tld')}
                          name='tld'
                          fullWidth
                          value={values.tld}
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
                          label={t('currency')}
                          name='currency'
                          value={values.currency}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={4} md={6}>
                        <TextValidator
                          className={classes.input}
                          fullWidth
                          variant='standard'
                          label={t('currency_name')}
                          name='currency_name'
                          value={values.currency_name}
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
                          label={t('region')}
                          name='region'
                          fullWidth
                          value={values.region}
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
                          label={t('subregion')}
                          name='subregion'
                          fullWidth
                          value={values.subregion}
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
                          variant='standard'
                          label={t('currency_symbol')}
                          name='currency_symbol'
                          fullWidth
                          value={values.currency_symbol}
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
                          label={t('capital')}
                          name='capital'
                          value={values.capital}
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
                          type="number"
                          onKeyDown={(e) => e.keyCode === 69 && e.preventDefault()}
                          variant='standard'
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
                          label={t('longitude')}
                          name='longitude'
                          value={values.longitude}
                          type="number"
                          onKeyDown={(e) => e.keyCode === 69 && e.preventDefault()}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                      {Object.keys(values.translations).map(function (key) {
                        if (languagesArray.includes(key)) {
                          return (
                            <Grid item xs={12} sm={12} lg={4} md={6} key={key}>
                              <TextValidator
                                fullWidth
                                className={classes.input}
                                variant='standard'
                                label={t(`${key}`)}
                                name={`${key}`}
                                value={values.translations[key]}
                                onChange={(e) => {
                                  values.translations[key] = e.target.value;
                                  setValues((oldValues) => ({ ...oldValues }));
                                }}
                                validators={['required']}
                                errorMessages={[t('required')]}
                              />
                            </Grid>
                          );
                        }
                      })}
                      <Grid item xs={12} sm={12} lg={4} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t(`name`)}
                          name='name'
                          value={values.name}
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
                          label={t(`native`)}
                          name='native'
                          value={values.native}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                          validators={['required']}
                          errorMessages={[t('required')]}
                        />
                      </Grid>
                    </Grid>
                    <Accordion
                      expanded={timeExpanded == 'panel2'}
                      sx={{ mt: 3 }}
                      onChange={handleTimeExpand('panel2')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel2a-content'
                        id='panel2a-header'>
                        <Typography>
                          {values?.timezones?.length} {t('timezones')}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {values?.timezones.map((time, i) => {
                          return (
                            <Accordion key={i.toString()}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel2a-content'
                                id='panel2a-header'>
                                <Typography>{time.zoneName}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={1}>
                                  <Grid item xs={12} sm={12} lg={2} md={6}>
                                    <TextValidator
                                      fullWidth
                                      className={classes.input}
                                      variant='standard'
                                      label={t('abbreviation')}
                                      name='abbreviation'
                                      disabled
                                      value={time.abbreviation}
                                      // onChange={childValueChange(city)}
                                      validators={['required']}
                                      errorMessages={[t('required')]}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} lg={4} md={6}>
                                    <TextValidator
                                      fullWidth
                                      className={classes.input}
                                      variant='standard'
                                      label={t('tzName')}
                                      name='tzName'
                                      disabled
                                      value={time.tzName}
                                      // onChange={childValueChange(city)}
                                      validators={['required']}
                                      errorMessages={[t('required')]}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} lg={3} md={6}>
                                    <TextValidator
                                      fullWidth
                                      className={classes.input}
                                      variant='standard'
                                      label={t('gmtOffsetName')}
                                      name='gmtOffsetName'
                                      disabled
                                      value={time.gmtOffsetName}
                                      // onChange={childValueChange(city)}
                                      validators={['required']}
                                      errorMessages={[t('required')]}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={12} lg={3} md={6}>
                                    <TextValidator
                                      fullWidth
                                      className={classes.input}
                                      variant='standard'
                                      label={t('zoneName')}
                                      name='zoneName'
                                      disabled
                                      value={time.zoneName}
                                      // onChange={childValueChange(city)}
                                      validators={['required']}
                                      errorMessages={[t('required')]}
                                    />
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Card>
                  <CardHeader color='rose' icon>
                    <CardIcon color='rose'>
                      <LocationOn ref={topRef}/>
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
                      {t('statesInformation')}
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
                          {values.totalStates} {t('states')}
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
                                childArray.length < values.totalStates &&
                                loadMore();
                            }}
                            hasMore={
                              childArray == null ||
                              childArray.length < values.totalStates
                                ? true
                                : false
                            }
                            loader={
                              <CircleToBlockLoading
                                style={{ position: 'relative',  right: rtlActive ? '60%' : 0, left: rtlActive ? 0 : '40%' }}
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
                              childArray.map((state, i) => {
                                return (
                                  <Accordion
                                    key={i.toString()}
                                    expanded={childExpanded == `panel3_${i}`}
                                    onChange={handleChildExpand(`panel3_${i}`)}>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls={`panel3_${i}a-content`}
                                      id={`panel3_${i}a-header`}>
                                      <Typography>{state.name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Grid container spacing={1}>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={2}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            className={classes.input}
                                            variant='standard'
                                            label={t('stateId')}
                                            name='stateId'
                                            disabled
                                            value={state.id}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={5}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            disabled
                                            className={classes.input}
                                            variant='standard'
                                            label={t('stateName')}
                                            name='name'
                                            value={state.name}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={5}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            disabled
                                            className={classes.input}
                                            variant='standard'
                                            label={t('type')}
                                            name='type'
                                            value={state.type !== null ? state.type : t('notDefine')}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={4}
                                          md={6}>
                                          <TextValidator
                                            type='number'
                                            fullWidth
                                            disabled
                                            className={classes.input}
                                            variant='standard'
                                            label={t('latitude')}
                                            name='latitude'
                                            value={state.latitude}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={4}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            disabled
                                            className={classes.input}
                                            variant='standard'
                                            label={t('longitude')}
                                            name='longitude'
                                            value={state.longitude}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          lg={4}
                                          md={6}>
                                          <TextValidator
                                            fullWidth
                                            className={classes.input}
                                            disabled
                                            variant='standard'
                                            label={t('totalCities')}
                                            name='totalCities'
                                            value={state.totalCities}
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
                          childArray.length >= values.totalStates && (
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
