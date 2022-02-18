import { ButtonBase, Typography } from '@mui/material';
import categoryCardStyles from './category-cards-style';
import PropTypes from "prop-types"

export default function CategoryCards(props) {
  const classes = categoryCardStyles();
  const { img, title, desc } = props;
  return (
    <div className={classes.cardWrap}>
      <span className={classes.fold} />
        <ButtonBase className={classes.categoryCard} focusRipple >
          <span className={classes.figure}>
            <img src={img} alt='img' />
          </span>
          <span className={classes.property}>
            <Typography component="span" className={classes.title}>
              {title}
            </Typography>
            <Typography component="span" className={classes.descCategory}>
            {desc}
          </Typography>
          </span>
        </ButtonBase>
    </div>
  );
}

CategoryCards.propTypes = {
  img: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
