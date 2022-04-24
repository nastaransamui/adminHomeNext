import badgeStyle from "./badge-styles"
import PropTypes from 'prop-types';
export default function Badge(props) {
  const classes = badgeStyle();
  const { color, children } = props;
  return (
    <span className={classes.badge + " " + classes[color]}>{children}</span>
  )
}

Badge.defaultProps = {
  color: "gray",
};

Badge.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "secondary",
    "gray",
  ]),
  children: PropTypes.node,
};