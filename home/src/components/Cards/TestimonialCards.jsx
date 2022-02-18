import testiStyles from "./testi-styles";
import PropTypes from 'prop-types'
import { Typography,  } from "@mui/material";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
const TestimonialCards = (props) => {
  const classes = testiStyles();
  const {text, name, title} = props
  return (
    <div className={classes.testimonial}>
      <div className={classes.icon}>
        <FormatQuoteIcon />
      </div>
      <Typography className={classes.text} display="block">
        {text}
      </Typography>
      <Typography variant="h6">
        {name}
      </Typography>
      <Typography variant="caption" className={classes.caption}>
        {title}
      </Typography>
    </div>
  );
}

TestimonialCards.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default TestimonialCards;
