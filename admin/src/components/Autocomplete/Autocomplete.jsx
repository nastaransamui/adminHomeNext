import { Fragment } from 'react';
import MuiAutocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import useAutoComplete from '../Hooks/useAutoComplete';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { TextValidator } from 'react-material-ui-form-validator';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { PropTypes } from 'prop-types';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const autoStyle = makeStyles((theme) => {
  return {
    inputAutocomplete: {
      color: theme.palette.text.color,
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(3),
      },
    },
    autocompleteIconDone: {
      color: theme.palette.success.main,
      marginLeft: 'auto',
    },
    autocompleteIconClose: {
      color: theme.palette.error.main,
      marginLeft: 'auto',
    },
  };
});

const Autocomplete = (props) => {
  props
  const {
    required,
    modelName,
    optionsUrl,
    disabled,
    nameValue,
    value,
    setValues,
    values,
    arrayIdName,
    roleNameError,
    setRoleNameError,
    updateRoleName,
    setUpdateRoleName,
    componentName,
    componentInUse
  } = props
  const {
    openOption,
    setOpenOption,
    stateOptions,
    loadingOption,
    sleep,
    setStateFilter,
    handleAutocomplete,
    _id,
    renderBox,
    getLabels,
    onBlurFunc,
  } = useAutoComplete(
    modelName,
    optionsUrl,
    setValues,
    values,
    arrayIdName,
    setRoleNameError,
    setUpdateRoleName,
    componentName,
    nameValue,
    componentInUse
  );
  const { t } = useTranslation('common');
  const theme = useTheme();
  const classes = autoStyle();
  return (
    <MuiAutocomplete
      id={`${modelName}_select`}
      disabled={disabled}
      options={stateOptions}
      loading={loadingOption}
      loadingText={t('autocompleteLoading')}
      noOptionsText={t('autocompleteNoOptions')}
      inputValue={value}
      autoHighlight
      onChange={(event, newValue) => {
        handleAutocomplete(nameValue, newValue);
      }}
      open={openOption}
      onOpen={() => {
        setOpenOption(true);
      }}
      onClose={() => {
        setOpenOption(false);
      }}
      getOptionLabel={(stateOptions) => getLabels(stateOptions)}
      getOptionDisabled={(stateOptions) => {
        if (stateOptions?.isActive == undefined) {
          return false;
        } else {
          return !stateOptions.isActive;
        }
      }}
      isOptionEqualToValue={(stateOptions, value) => {
        return stateOptions[nameValue] === value;
      }}
      filterOptions={(options, state) => {
        const searchRegex = new RegExp(escapeRegExp(value), 'i');
        const filterdData = options.filter((row) => {
          return Object.keys(row).some((field) => {
            if (row[field] !== null) {
              return searchRegex.test(row[field].toString());
            }
          });
        });
        return filterdData;
      }}
      renderOption={(props, stateOptions) => (
        <Box component='li' {...props} key={stateOptions._id}>
          {renderBox(theme, stateOptions, classes)}
        </Box>
      )}
      renderInput={(params) => (
        <TextValidator
          {...params}
          label={t(`${nameValue}`)}
          variant='standard'
          error={
            required
              ? roleNameError ||
                (updateRoleName?.changed &&
                  updateRoleName?.roleName !== values.roleName)
              : null
          }
          helperText={
            required
              ? roleNameError
                ? t('required')
                : updateRoleName?.changed &&
                  updateRoleName?.roleName !== values.roleName
                ? t('routeChanged')
                : ' '
              : ''
          }
          validators={
            required
              ? values?.role_id?.length == 0
                ? ['required']
                : _id == null
                ? ['required']
                : []
              : []
          }
          errorMessages={[t('required')]}
          value={value}
          onBlur={() => {
            onBlurFunc();
          }}
          onChange={(e) => {
            setValues({ ...values, [nameValue]: e.target.value });
            (async () => {
              await sleep(1e3);
              setStateFilter(e.target.value);
            })();
          }}
          className={classes.inputAutocomplete}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loadingOption ? (
                  <CircularProgress color='inherit' size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

Autocomplete.propTypes = {
  required: PropTypes.bool.isRequired,
  modelName: PropTypes.string.isRequired,
  optionsUrl: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  nameValue: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValues: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  arrayIdName: PropTypes.string.isRequired,
  roleNameError: PropTypes.bool,
  setRoleNameError: PropTypes.func,
  updateRoleName: PropTypes.object,
  setUpdateRoleName: PropTypes.func,
  componentInUse: PropTypes.string.isRequired
};

export default Autocomplete;
