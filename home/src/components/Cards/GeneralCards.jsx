import PropTypes from 'prop-types';
import { Paper, Button, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useText } from '../../../theme/common';
import useStyles from './general-cards-style';
import { useTranslation } from 'next-i18next';

export default function GeneralCards(props) {
  const classes = useStyles();
  const text = useText();
  const { img, title, desc, rating, price } = props;
  const {t} = useTranslation("home")

  return (
    <Paper className={classes.generalCard}>
      <figure>
        <img src={img} alt={title} />
      </figure>
      <div className={classes.desc}>
        <Typography variant='h6' gutterBottom>
          {title}
        </Typography>
        <Typography className={text.paragraph}>{desc}</Typography>
        <div className={classes.property}>
          <div className={classes.rating}>
            {[...Array(rating)].map((e, index) => {
              return (
                <StarIcon className={classes.starIcon} key={index.toString()} />
              );
            })}
          </div>
          <strong>$ {price}</strong>
        </div>
        <Button className={classes.button} color='primary' variant='outlined'>
          {t('trending.explore')}
        </Button>
      </div>
    </Paper>
  );
}

GeneralCards.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
};
