import { forwardRef } from 'react';

import NumberFormat from 'react-number-format';

const NumberInput = forwardRef((props, ref) => {
  const { inputRef, onChange, name, placeholder,defaultValue, [`aria-describedby`]: rtlActive, ...other } = props;

  return (
    <NumberFormat
      {...other}
      thousandSeparator={true}
      // defaultValue={12}
      // prefix={'$'}
      placeholder={placeholder}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: name,
            value: values.floatValue !== undefined ? values?.floatValue : 0,
          },
        });
      }}
      prefix={rtlActive == 'false' ? defaultValue : ''}
      suffix={rtlActive == 'true' ? defaultValue : ''}
      // decimalScale={3}
      allowNegative={false}
    />
  );
});
export default NumberInput;
