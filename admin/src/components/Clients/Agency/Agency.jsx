import { Fragment } from 'react';
import agencyStyle from './agency-style';
import customerAvatar from '../../../../public/images/faces/Customer.png';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Card from '../../Card/Card';
import CardBody from '../../Card/CardBody';
import CardHeader from '../../Card/CardHeader';
import CardIcon from '../../Card/CardIcon';
import CardAvatar from '../../Card/CardAvatar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Autocomplete from '../../Autocomplete/Autocomplete';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from 'react-material-ui-form-validator';

import { useQuery } from '../../../pages/dashboard/ReactRouter';
import agencyHook from './agencyHook';

import PhoneInput from '../../PhoneInput/PhoneInput';
import NumberInput from '../../NumberInput/NumberInput';

import useButtonActivation from '../../Hooks/useButtonActivation';

import {
  cityUrl,
  countryUrl,
  provinceUrl,
  userUrl,
  currencyUrl,
} from './agencyStatic';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function Agency(props) {
  const { rtlActive, reactRoutes } = props;
  let query = useQuery();
  const client_id = query.get('client_id');
  const classes = agencyStyle();
  const { t, i18n } = useTranslation('agencies');
  const theme = useTheme();
  const history = useHistory();
  const lang = i18n.language == 'fa' ? 'fa' : 'en';
  const {
    values,
    setValues,
    handleChange,
    logoImageBlob,
    uploadImage,
    deleteImage,
    formSubmit,
    countryPhoneCode,
    numbersRef,
    phoneTags,
    phoneNumberError,
    setPhoneNumberError,
    pushUrl,
    clientRoute,
  } = agencyHook(reactRoutes);

  const { createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(clientRoute);

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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color='rose' icon>
                <CardIcon color='rose' style={{ cursor: 'pointer' }}>
                  <input
                    type='file'
                    id='logoImageBlob'
                    name='logoImage'
                    hidden
                    onChange={(e) => {
                      uploadImage(e);
                    }}
                    accept='image/png, image/jpeg'
                  />
                  <Tooltip
                    title={
                      logoImageBlob == '' ? t('uploadlogo') : t('changelogo')
                    }
                    arrow>
                    {logoImageBlob == '' ? (
                      <label htmlFor='logoImageBlob'>
                        <img
                          src={customerAvatar.src}
                          alt='..'
                          className={classes.smallAvatar}
                        />
                      </label>
                    ) : (
                      <label htmlFor='logoImageBlob'>
                        <img
                          src={logoImageBlob}
                          alt='..'
                          className={classes.smallAvatar}
                        />
                      </label>
                    )}
                  </Tooltip>
                </CardIcon>
                <span className={classes.deleteIcon}>
                  <h4 className={classes.cardIconTitle}>
                    {t('editAgent')} - <small>{t('completeAgent')} </small>
                  </h4>
                  {logoImageBlob !== '' && (
                    <Tooltip title={t('deleteLogo')} arrow>
                      <IconButton
                        onClick={() => {
                          deleteImage();
                        }}
                        style={{ marginTop: 10 }}
                        disableRipple>
                        <Delete color='error' />
                      </IconButton>
                    </Tooltip>
                  )}
                </span>
              </CardHeader>
              <ValidatorForm
                onSubmit={formSubmit}
                onError={(errors) => {
                  for (let index = 0; index < errors.length; index++) {
                    const element = errors[index];
                    if (
                      element.props.id !== undefined &&
                      !isNaN(Number(element.props.id))
                    ) {
                      const phoneIndex = Number(element.props.id);
                      phoneNumberError[phoneIndex][phoneIndex] = true;
                      setPhoneNumberError((prevState) => [...prevState]);
                    }
                  }
                }}>
                <CardBody>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={2}>
                      <SelectValidator
                        className={classes.input}
                        autoComplete='off'
                        label={t('isActive')}
                        onClick={handleChange('isActive')}
                        value={
                          values.isActive ? t('isActive') : t('isNotActive')
                        }
                        name='isActive'
                        variant='standard'
                        validators={['required']}
                        errorMessages={[t('required')]}
                        fullWidth>
                        {[t('isActive'), t('isNotActive')].map((d, i) => {
                          return (
                            <MenuItem key={i} value={d}>
                              {d}
                            </MenuItem>
                          );
                        })}
                      </SelectValidator>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                      <TextValidator
                        className={classes.input}
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                        label={t('agentId')}
                        disabled={client_id !== null}
                        fullWidth
                        onChange={handleChange('agentId')}
                        value={values.agentId}
                        name='agentId'
                        variant='standard'
                        validators={['required']}
                        errorMessages={[t('required')]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        label={t('agentName')}
                        onChange={handleChange('agentName')}
                        value={values.agentName}
                        name='agentName'
                        variant='standard'
                        validators={['required']}
                        errorMessages={[t('required')]}
                        fullWidth
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={5}>
                      <TextValidator
                        className={classes.input}
                        fullWidth
                        label={t('agentEmail')}
                        onChange={handleChange('email')}
                        value={values.email}
                        name='email'
                        variant='standard'
                        validators={['required', 'isEmail']}
                        errorMessages={[t('required'), t('emailRequire')]}
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextValidator
                        className={classes.input}
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                        fullWidth
                        label={t('address')}
                        onChange={handleChange('address')}
                        value={values.address}
                        name='address'
                        variant='standard'
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6}>
                      <Autocomplete
                        required={false}
                        modelName='Users'
                        componentName='AccountManager'
                        optionsUrl={userUrl}
                        nameValue='accountManager'
                        value={values.accountManager}
                        setValues={setValues}
                        values={values}
                        arrayIdName='accountManager_id'
                        componentInUse='Agency'
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={3}>
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
                        componentInUse='Agency'
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
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
                        componentInUse='Agency'
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
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
                        componentInUse='Agency'
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <Autocomplete
                        required
                        modelName='Currencies'
                        componentName='Currencies'
                        optionsUrl={currencyUrl}
                        nameValue='currencyCode'
                        value={values.currencyCode}
                        setValues={setValues}
                        values={values}
                        arrayIdName='currencyCode_id'
                        componentInUse='Agency'
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        variant='standard'
                        autoComplete='off'
                        placeholder='0'
                        onKeyDown={(e) => e.key === 69 && e.preventDefault()}
                        value={
                          values.creditAmount == 0 ? '' : values.creditAmount
                        }
                        onChange={handleChange('creditAmount')}
                        // validators={['required']}
                        InputProps={{
                          inputComponent: NumberInput,
                          defaultValue:
                            values.currencyCode == ''
                              ? `${t('selectCurrencyFirst')}  `
                              : `${values.currencyCode}  `,
                          [`aria-describedby`]: `${rtlActive}`,
                        }}
                        // errorMessages={[t('required')]}
                        name='creditAmount'
                        label={t('creditAmount')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        variant='standard'
                        autoComplete='off'
                        placeholder='0'
                        onKeyDown={(e) => e.key === 69 && e.preventDefault()}
                        value={
                          values.depositAmount == 0 ? '' : values.depositAmount
                        }
                        onChange={handleChange('depositAmount')}
                        // validators={['required']}
                        InputProps={{
                          inputComponent: NumberInput,
                          defaultValue:
                            values.currencyCode == ''
                              ? `${t('selectCurrencyFirst')}  `
                              : `${values.currencyCode}  `,
                          [`aria-describedby`]: `${rtlActive}`,
                        }}
                        // errorMessages={[t('required')]}
                        name='depositAmount'
                        label={t('depositAmount')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        variant='standard'
                        autoComplete='off'
                        placeholder='0'
                        onKeyDown={(e) => e.key === 69 && e.preventDefault()}
                        value={values.remainCreditAmount}
                        onChange={handleChange('remainCreditAmount')}
                        // validators={['required']}
                        errorMessages={[t('required')]}
                        disabled
                        InputProps={{
                          inputComponent: NumberInput,
                          defaultValue:
                            values.currencyCode == ''
                              ? `${t('selectCurrencyFirst')}  `
                              : `${values.currencyCode}  `,
                          [`aria-describedby`]: `${rtlActive}`,
                        }}
                        name='remainCreditAmount'
                        label={t('remainCreditAmount')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        variant='standard'
                        autoComplete='off'
                        placeholder='0'
                        onKeyDown={(e) => e.key === 69 && e.preventDefault()}
                        value={values.remainDepositAmount}
                        onChange={handleChange('remainDepositAmount')}
                        // validators={['required']}
                        errorMessages={[t('required')]}
                        disabled
                        InputProps={{
                          inputComponent: NumberInput,
                          defaultValue:
                            values.currencyCode == ''
                              ? `${t('selectCurrencyFirst')}  `
                              : `${values.currencyCode}  `,
                          [`aria-describedby`]: `${rtlActive}`,
                        }}
                        name='remainDepositAmount'
                        label={t('remainDepositAmount')}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    {values?.phones.map((value, index) => {
                      return (
                        <Fragment key={index}>
                          <Grid item xs={12} sm={12} md={3}>
                            <PhoneInput
                              type='text'
                              value={value.number}
                              name='number'
                              id={`phoneNumber_${index}`}
                              error={phoneNumberError[index][index]}
                              label={t('phoneNumber')}
                              onChange={(value, country, e, formattedValue) => {
                                values.phones[index][e.target.name] =
                                  formattedValue;
                                setValues({ ...values });
                                phoneNumberError[index][index] = false;
                                setPhoneNumberError((prevState) => [
                                  ...prevState,
                                ]);
                              }}
                              defaultCountry={countryPhoneCode}
                            />
                            <TextValidator
                              validators={['required']}
                              className={classes.root}
                              variant='standard'
                              id={`${index}`}
                              type='hidden'
                              fullWidth
                              InputProps={{
                                classes: {
                                  root: classes.root,
                                },
                              }}
                              ref={numbersRef}
                              errorMessages={[t('required')]}
                              value={value.number}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={3}>
                            <SelectValidator
                              className={classes.inputAutocomplete}
                              autoComplete='off'
                              label={t('phonesTags')}
                              value={value.tags[0]}
                              variant='standard'
                              validators={['required']}
                              errorMessages={[t('required')]}
                              fullWidth>
                              {phoneTags.map((d, i) => {
                                return (
                                  <MenuItem
                                    key={i}
                                    value={d[`${lang}_name`]}
                                    onClick={(e) => {
                                      value.tags[0] = d[`${lang}_name`];
                                      setValues({ ...values });
                                    }}>
                                    {d[`${lang}_name`]}
                                  </MenuItem>
                                );
                              })}
                            </SelectValidator>
                          </Grid>
                          <Grid item xs={12} sm={12} md={3}>
                            <TextValidator
                              className={classes.input}
                              InputProps={{
                                style: {
                                  WebkitTextFillColor: theme.palette.text.color,
                                },
                              }}
                              label={t('phoneRemark')}
                              fullWidth
                              onChange={(e) => {
                                values.phones[index][e.target.name] =
                                  e.target.value;
                                setValues({ ...values });
                              }}
                              value={value.remark}
                              name='remark'
                              variant='standard'
                              validators={['required']}
                              errorMessages={[t('required')]}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={3}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 2,
                              }}>
                              <Tooltip
                                title={
                                  index == 0
                                    ? t('addPhones')
                                    : t('removePhones')
                                }
                                arrow>
                                <Fab
                                  color={index == 0 ? 'secondary' : 'primary'}
                                  size='small'
                                  aria-label='add'
                                  onClick={() => {
                                    if (index == 0) {
                                      if (values.phones.length < 5) {
                                        values.phones.push({
                                          tags: [''],
                                          number: '',
                                          remark: '',
                                        });
                                        setValues({ ...values });
                                        phoneNumberError.push({
                                          [values.phones.length - 1]: false,
                                        });
                                        setPhoneNumberError((prevState) => [
                                          ...prevState,
                                        ]);
                                      }
                                    } else {
                                      values.phones.splice(index, 1);
                                      setValues({ ...values });
                                      phoneNumberError.splice(index, 1);
                                      setPhoneNumberError((prevState) => [
                                        ...prevState,
                                      ]);
                                    }
                                  }}
                                  style={{ alignItems: 'center', zIndex: 1 }}>
                                  {index == 0 ? <Add /> : <Remove />}
                                </Fab>
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Fragment>
                      );
                    })}
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextValidator
                        className={classes.input}
                        multiline
                        rows={4}
                        fullWidth
                        label={t('remark')}
                        onChange={handleChange('remark')}
                        value={values.remark}
                        name='remark'
                        variant='standard'
                      />
                    </Grid>
                  </Grid>
                  <Button
                    color='primary'
                    variant='contained'
                    type='submit'
                    fullWidth
                    disabled={
                      client_id == null
                        ? createButtonDisabled
                        : updateButtonDisabled
                    }
                    className={classes.updateProfileButton}>
                    {client_id == null
                      ? t('createAgencyProfile')
                      : t('editAgencyProfile')}
                  </Button>
                </CardBody>
              </ValidatorForm>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card profile>
              {logoImageBlob == '' ? (
                <CardHeader color='rose' icon>
                  <CardAvatar profile>
                    <img src={customerAvatar.src} alt='..' />
                  </CardAvatar>
                  <h6 className={classes.cardCategory}>{values.agentId} </h6>
                  <h5 className={classes.cardCategory}>
                    {values.cityName} {values.provinceName} {values.countryName}
                  </h5>
                  <h5 className={classes.cardTitle}>{values.currencyCode}</h5>
                  <h4 className={classes.cardIconTitle}>{values.agentName}</h4>
                  <h4 className={classes.cardIconTitle}>{values.email}</h4>
                  <h4 className={classes.cardIconTitle}>{values.address}</h4>
                </CardHeader>
              ) : (
                <>
                  <CardAvatar profile>
                    <img src={logoImageBlob} alt='..' />
                  </CardAvatar>
                  <h6 className={classes.cardCategory}>{values.agentId}</h6>
                  <h5 className={classes.cardCategory}>
                    {values.cityName} {values.provinceName} {values.countryName}
                  </h5>
                  <h5 className={classes.cardTitle}>{values.currencyCode}</h5>
                  <h4 className={classes.cardIconTitle}>{values.agentName}</h4>
                  <h4 className={classes.cardIconTitle}>{values.email}</h4>
                  <h4 className={classes.cardIconTitle}>{values.address}</h4>
                </>
              )}
              <CardBody profile>
                <h4 className={classes.cardTitle}>
                  {values.phones.map((p, i) => {
                    return (
                      <p key={i}>
                        {p.number} {p.tags[0]} {p.remark}
                      </p>
                    );
                  })}
                </h4>
                <p
                  className={classes.description}
                  style={{ whiteSpace: 'pre-wrap' }}>
                  {values.remark}
                </p>
                <h6 className={classes.cardCategory}>
                  {values.accountManager}
                </h6>

                {values.creditAmount !== 0 && (
                  <p className={classes.cardCategory}>
                    {t('creditAmount')}: {values.creditAmount?.toLocaleString()}{' '}
                    {values.currencyCode !== '' && values.currencyCode}
                  </p>
                )}
                {values.depositAmount !== 0 && (
                  <p className={classes.cardCategory}>
                    {t('depositAmount')}:{' '}
                    {values.depositAmount?.toLocaleString()}{' '}
                    {values.currencyCode !== '' && values.currencyCode}
                  </p>
                )}
                {values.remainCreditAmount !== 0 && (
                  <p className={classes.cardCategory}>
                    {t('remainCreditAmount')}:{' '}
                    {values.remainCreditAmount?.toLocaleString()}{' '}
                    {values.currencyCode !== '' && values.currencyCode}
                  </p>
                )}
                {values.remainDepositAmount !== 0 && (
                  <p className={classes.cardCategory}>
                    {t('remainDepositAmount')}:{' '}
                    {values.remainDepositAmount?.toLocaleString()}{' '}
                    {values.currencyCode !== '' && values.currencyCode}
                  </p>
                )}
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </Fragment>
    </Container>
  );
}
