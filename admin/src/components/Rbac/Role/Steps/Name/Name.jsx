import { useState } from 'react';
import nameStyle from './name-styles';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '../../../../../pages/dashboard/ReactRouter';
import Grid from '@mui/material/Grid';
import SelectValidator from 'react-material-ui-form-validator/lib/SelectValidator';
import TextValidator from 'react-material-ui-form-validator/lib/TextValidator';
import IconDialog from './IconDialog';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

const Name = (props) => {
  const { values, handleChange, roleNameError, setValues } = props;
  const classes = nameStyle();
  const theme = useTheme();
  const { t } = useTranslation('roles');
  let query = useQuery();
  const role_id = query.get('role_id');
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (Icon) => {
    Icon !== undefined &&
      setValues((oldValue) => ({ ...oldValue, icon: Icon }));
    setOpen(false);
  };
  return (
    <>
      <Grid container justifyContent='center'>
        {open && (
          <IconDialog
            open={open}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          />
        )}
        <h4 className={classes.infoText}>{t('step1Title')}</h4>
      </Grid>
      <div className={classes.div}>
        <Grid container justifyContent='center' style={{ flex: 1 }}>
          <Grid item xs={12} sm={12}>
            <div className={classes.pictureContainer}>
              <div className={classes.picture}>
                {/* <values.icon className={classes.icon} /> */}
                <SvgIcon className={classes.icon}>
                  <path d={`${values.icon}`} />
                </SvgIcon>
                <input onClick={handleClickOpen} />
              </div>
              <h6 className={classes.description}>{t('chooseIcon')}</h6>
            </div>
          </Grid>
        </Grid>
        <Grid container justifyContent='center' style={{ flex: 2 }} spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextValidator
              className={classes.input}
              autoComplete='off'
              InputProps={{
                style: {
                  WebkitTextFillColor: theme.palette.text.color,
                },
              }}
              label={t('roleName')}
              id='roleName'
              error={roleNameError}
              helperText={roleNameError ? t('required') : ' '}
              onKeyDown={(e) => {
                var letters = /^[a-zA-Z\s]*$/g;
                if (!letters.test(e.key)) {
                  e.preventDefault();
                }
              }}
              disabled={role_id !== null}
              fullWidth
              onChange={handleChange('roleName')}
              value={values.roleName}
              name='roleName'
              variant='standard'
              validators={['required']}
              errorMessages={[t('required')]}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectValidator
              className={classes.input}
              autoComplete='off'
              label={t('isActive')}
              onClick={handleChange('isActive')}
              value={values.isActive ? t('isActive') : t('isNotActive')}
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
      </div>
    </>
  );
};

export default Name;
