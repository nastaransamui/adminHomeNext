import { Fragment, forwardRef } from 'react';
import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import publicStyle from './public-style';
import SelectValidator from 'react-material-ui-form-validator/lib/SelectValidator';
import TextValidator from 'react-material-ui-form-validator/lib/TextValidator';
import PhoneInput from '../../../../../PhoneInput/PhoneInput';
import MuiRating from '@mui/material/Rating';
import cx from "classnames";

const Rating = forwardRef(function Alert(props, ref) {
  return <MuiRating ref={ref} {...props} />;
});

const PublicData = (props) => {
  const { values, handleChange, setValues, errorRequied, setErrorRequied } =
    props;
  const classes = publicStyle();
  const theme = useTheme();
  const { t } = useTranslation('hotels');
  return (
    <Fragment>
      <div className={classes.div}>
        <Grid container spacing={5} style={{ flex: 1 }}>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <SelectValidator
              className={classes.input}
              autoComplete='off'
              label={t('isActive')}
              onClick={handleChange('isActive')}
              value={values.isActive ? t('active') : t('notActive')}
              name='isActive'
              variant='standard'
              validators={['required']}
              errorMessages={[t('required')]}
              fullWidth>
              {[t('active'), t('notActive')].map((d, i) => {
                return (
                  <MenuItem key={i} value={d}>
                    {d}
                  </MenuItem>
                );
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <TextValidator
              className={classes.input}
              autoComplete='off'
              InputProps={{
                style: {
                  WebkitTextFillColor: theme.palette.text.color,
                },
              }}
              label={t('Giataid')}
              id='GiataId'
              onKeyDown={(e) => {
                var x = e.which || e.keycode;
                if (
                  (x >= 48 && x <= 57) ||
                  x == 8 ||
                  (x >= 35 && x <= 40) ||
                  (x >= 96 && x <= 105) ||
                  x == 46 ||
                  x == 9
                ) {
                  return true;
                } else {
                  e.preventDefault();
                }
              }}
              fullWidth
              onChange={handleChange('Giataid')}
              value={values.Giataid}
              name='Giataid'
              variant='standard'
              validators={['required']}
              errorMessages={[t('required')]}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <TextValidator
              className={classes.input}
              autoComplete='off'
              InputProps={{
                style: {
                  WebkitTextFillColor: theme.palette.text.color,
                },
              }}
              label={t('hotelId')}
              id='hotelId'
              onKeyDown={(e) => {
                var x = e.which || e.keycode;
                if (
                  (x >= 48 && x <= 57) ||
                  x == 8 ||
                  (x >= 35 && x <= 40) ||
                  (x >= 96 && x <= 105) ||
                  x == 46 ||
                  x == 9
                ) {
                  return true;
                } else {
                  e.preventDefault();
                }
              }}
              fullWidth
              disabled
              onChange={handleChange('hotelId')}
              value={values.hotelId}
              name='hotelId'
              variant='standard'
              error={errorRequied.hotelId}
              helperText={errorRequied.hotelId ? t('required') : ' '}
              validators={['required']}
              errorMessages={[t('required')]}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <TextValidator
              className={classes.input}
              autoComplete='off'
              error={errorRequied.hotelRating}
              helperText={errorRequied.hotelRating ? t('required') : ' '}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: {
                  WebkitTextFillColor: theme.palette.text.color,
                },
                classes:{root: cx({
                  [classes.inputRoot]: errorRequied.hotelRating,
                })},
                inputComponent: forwardRef(function Alert(props, ref) {
                  return (
                    <MuiRating
                      sx={{ marginTop: 1 }}
                      value={parseInt(values.hotelRating)}
                      name='hotelRating'
                      onChange={(event, newValue) => {
                        values.hotelRating = newValue.toString();
                        setErrorRequied((oldValue) => ({
                          ...oldValue,
                          hotelRating: false,
                        }));
                        setValues({ ...values });
                      }}
                      ref={ref}
                    />
                  );
                }),
              }}
              label={t('hotelRating')}
              id='hotelRating'
              fullWidth
              value={values.hotelRating}
              name='hotelRating'
              variant='standard'
              validators={['required']}
              errorMessages={[t('required')]}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TextValidator
              className={classes.input}
              autoComplete='off'
              InputProps={{
                style: {
                  WebkitTextFillColor: theme.palette.text.color,
                },
                classes:{root: cx({
                  [classes.inputRoot]: errorRequied.hotelName,
                })}
              }}
              label={t('hotelName')}
              id='hotelName'
              error={errorRequied.hotelName}
              helperText={errorRequied.hotelName ? t('required') : ' '}
              fullWidth
              onChange={handleChange('hotelName')}
              value={values.hotelName}
              name='hotelName'
              variant='standard'
              validators={['required']}
              errorMessages={[t('required')]}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={3}>
            <TextValidator
              className={classes.input}
              autoComplete='off'
              InputProps={{
                style: {
                  WebkitTextFillColor: theme.palette.text.color,
                },
                classes:{root: cx({
                  [classes.inputRoot]: errorRequied.email,
                })}
              }}
              label={t('email')}
              error={errorRequied.email}
              helperText={errorRequied.email ? t('required') : ' '}
              id='email'
              fullWidth
              onChange={handleChange('email')}
              value={values.email == 'NULL' ? '' : values.email}
              name='email'
              variant='standard'
              validators={['required', 'isEmail']}
              errorMessages={[t('required'), t('emailRequire')]}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={3}>
            <TextValidator
              className={classes.input}
              autoComplete='off'
              InputProps={{
                style: {
                  WebkitTextFillColor: theme.palette.text.color,
                },
              }}
              label={t('url')}
              id='url'
              fullWidth
              onChange={handleChange('url')}
              value={values.url == 'NULL' ? '' : values.url}
              name='url'
              variant='standard'
              validators={['required']}
              errorMessages={[t('required')]}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={3}>
            <PhoneInput
              type='text'
              value={values.phones}
              name='phones'
              id='phoneNumber'
              label={t('phones')}
              onChange={(value, country, e, formattedValue) => {
                values.phones = formattedValue;
                setValues({ ...values });
              }}
              defaultCountry={values?.countryIso2.toLowerCase() || 'th'}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={3}>
            <PhoneInput
              type='text'
              value={values.fax}
              name='fax'
              id='faxNumber'
              label={t('fax')}
              onChange={(value, country, e, formattedValue) => {
                values.fax = formattedValue;
                setValues({ ...values });
              }}
              defaultCountry={values?.countryIso2.toLowerCase() || 'th'}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
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
      </div>
    </Fragment>
  );
};

export default PublicData;
