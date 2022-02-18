import React from 'react';
import { red } from '@mui/material/colors';
import { Checkbox } from '@mui/material';
import { ValidatorComponent } from 'react-material-ui-form-validator';

const red300 = red['500'];

const style = {
  right: 'auto',
  fontSize: '12px',
  color: red300,
  position: 'absolute',
  left: 'auto',
  marginLeft: '25px',
};

class CheckboxValidatorElement extends ValidatorComponent {
  renderValidatorComponent() {
    const {
      errorMessages,
      validators,
      requiredError,
      value,
      validatorListener: validatorlistener,
      ...rest
    } = this.props;

    return (
      <div>
        <Checkbox
          {...rest}
          ref={(r) => {
            this.input = r;
          }}
        />
        {this.errorText()}
      </div>
    );
  }

  errorText() {
    const { isValid } = this.state;

    if (isValid) {
      return null;
    }

    return <div style={style}>{this.getErrorMessage()}</div>;
  }
}

export default CheckboxValidatorElement;
