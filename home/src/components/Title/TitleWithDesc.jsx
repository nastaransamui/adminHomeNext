import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { useText } from '../../../theme/common';
import useStyles from './title-with-desc-style';

export default function TitleWithDesc(props) {
  const classes = useStyles();
  const text = useText();
  const {
    align, head, desc,
    color, dark
  } = props;
  const setAlign = alignment => {
    switch (alignment) {
      case 'left':
        return classes.left;
      case 'right':
        return classes.right;
      case 'center':
        return classes.center;
      default:
        return classes.left;
    }
  };
  const setColor = clr => {
    if (clr === 'secondary') {
      return classes.secondary;
    }
    return classes.primary;
  };
  return (
    <div className={clsx(setAlign(align), classes.title, dark && classes.dark)}>
      <Typography variant="h4" className={clsx(setColor(color), text.title)}>
        <span>
          {head}
        </span>
      </Typography>
      <Typography className={clsx(classes.desc, text.subtitle2)}>
        {desc}
      </Typography>
    </div>
  );
}

TitleWithDesc.propTypes = {
  align: PropTypes.string,
  head: PropTypes.string.isRequired,
  desc: PropTypes.string,
  color: PropTypes.string,
  dark: PropTypes.bool,
};

TitleWithDesc.defaultProps = {
  align: 'left',
  dark: false,
  desc: '',
  color: 'primary',
};
