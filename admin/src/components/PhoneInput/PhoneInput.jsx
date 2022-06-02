import { Fragment } from 'react';
import ReactPhoneInput from 'react-phone-input-material-ui';
import { TextField } from '@mui/material';
import { withStyles } from '@mui/styles';

const styles = (theme) => {
  return {
    field: {
      margin: '10px 0',
      '& input': {
        marginLeft: theme.direction == 'ltr' ? 0 : 46,
        position: 'relative',
      },
      '& label': {
        position: 'absolute',
        left: theme.direction == 'ltr' ? 0 : 56,
        top: -5,
      },
      '& .MuiInputLabel-shrink': {
        position: 'absolute',
        left: 0,
      },
    },
    countryList: {
      ...theme.typography.body1,
      background: theme.palette.background.paper + '!important',
      color:
        theme.palette.mode == 'dark'
          ? theme.palette.secondary.contrastText
          : theme.palette.primary.contrastText,
      '&  .country.highlight': {
        backgroundColor: theme.palette.primary.main + '!important',
      },
      '& .dial-code': {
        color: theme.palette.secondary.main + '!important',
      },
      '& .country:hover': {
        background: theme.palette.primary.main + '!important',
      },
    },
    button: {
      '& .selected-flag': {
        marginLeft: theme.direction == 'ltr' ? 0 : 23,
        '& .arrow': {
          color: 'blue !important',
        },
      },
    },
    search: {
      background: theme.palette.background.paper + '!important',
    },
  };
};

function PhoneInput(props) {
  const {
    value,
    defaultCountry,
    onChange,
    classes,
    label,
    name,
    type,
    error,
    id,
  } = props;
  // console.log(props)
  return (
    <Fragment>
      <ReactPhoneInput
        value={value}
        inputProps={{
          name: name,
          id: id,
          autoFocus: false,
          error: error,
          variant: 'standard',
          label: label,
          type: type,
        }}
        country={defaultCountry}
        onChange={onChange}
        inputClass={classes.field}
        dropdownClass={classes.countryList}
        searchClass={classes.search}
        component={TextField}
        buttonClass={classes.button}
        countryCodeEditable={false}
        enableSearch
      />
    </Fragment>
  );
}

export default withStyles(styles)(PhoneInput);
