import titleStyles from './title-style';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import clsx from 'clsx';

export default function Title(props) {
  const classes = titleStyles();
  const { primary, secondary, align } = props;
  const setAlign = (alignment) => {
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
  return (
    <div className={clsx(classes.title, setAlign(align))}>
      <Typography variant="h4" className={classes.primary}>
        {primary}
      </Typography>
      <Typography variant='h4' className={classes.secondary}>
        {secondary}
      </Typography>
    </div>
  );
}

Title.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  align: PropTypes.string,
};

Title.defaultProps = {
  align: 'left',
};
