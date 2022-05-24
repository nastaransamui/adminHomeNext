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
import { pushUrl } from './currencyStatic';
import currencyHook from './currencyHook';
import Card from '../../Card/Card';
import CardHeader from '../../Card/CardHeader';
import CardIcon from '../../Card/CardIcon';
import {
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator';
import CardBody from '../../Card/CardBody';
import currencyStyle from './currency-style';
export default function Currency(props) {
  const history = useHistory();
  const classes = currencyStyle();
  const { t, i18n } = useTranslation('exchange');
  const { rtlActive } = props;
  const {
    values,
    formSubmit,
    formValueChanged,
    objIsEmpty,
  } = currencyHook();
  
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
        title={!objIsEmpty(values) ? `${values?.emoji} ${values?.currency_name} ` : ''}
        textAlign='center'
      />
      <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
        {!objIsEmpty(values) && (
          <ValidatorForm onSubmit={formSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Card style={{ minHeight: '268px' }}>
                  <CardHeader color='rose' icon>
                    <CardIcon color='rose'>{values.emoji}</CardIcon>
                    <h4 className={classes.cardIconTitle}>
                      {t('currencyInformation')}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <Grid container spacing={4} style={{ marginTop: 10 }}>
                      <Grid item xs={12} sm={12} lg={1} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t('currencyId')}
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
                      <Grid item xs={12} sm={12} lg={1} md={6}>
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
                      <Grid item xs={12} sm={12} lg={1} md={6}>
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
                      <Grid item xs={12} sm={12} lg={1} md={6}>
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
                      <Grid item xs={12} sm={12} lg={1} md={6}>
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
                      <Grid item xs={12} sm={12} lg={2} md={6}>
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
                      <Grid item xs={12} sm={12} lg={3} md={6}>
                        <TextValidator
                          fullWidth
                          className={classes.input}
                          variant='standard'
                          label={t(`country_name`)}
                          name='name'
                          value={values.name}
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
