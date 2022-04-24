import headingStyles from "./heading-styles"
import cx from "classnames";
import PropTypes from "prop-types";

export default function Heading(props) {
  const { textAlign, category, title } = props;
  const classes = headingStyles();
  const heading =
  classes.heading +
  " " +
  cx({
    [classes[textAlign + "TextAlign"]]: textAlign !== undefined,
  });
if (title !== undefined || category !== undefined) {
  return (
    <div className={heading}>
      {title !== undefined ? (
        <h3 className={classes.title}>{title}</h3>
      ) : null}
      {category !== undefined ? (
        <p className={classes.category}>{category}</p>
      ) : null}
    </div>
  );
}
return null;
}

Heading.propTypes = {
  title: PropTypes.node,
  category: PropTypes.node,
  textAlign: PropTypes.oneOf(["right", "left", "center"]),
};