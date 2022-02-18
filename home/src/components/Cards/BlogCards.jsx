import blogCardsStyles from './blog-cards-style';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import moment from 'moment';

export default function BlogCards(props) {
  const classes = blogCardsStyles();
  const { category, title, date, router } = props;
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  const farsiDate = new Date(date).toLocaleTimeString('fa-IR', options);

  var check = moment(date, 'YYYY/MM/DD');
  var month =
    router.locale == 'fa' ? farsiDate.split(' ')[1] : check.format('MMM');
  var day =
    router.locale == 'fa' ? farsiDate.split(' ')[0] : check.format('DD');
  var year =
    router.locale == 'fa' ? farsiDate.split(' ')[2].replace('،', '') : check.format('YYYY');
 
  return (
    <div className={classes.blogCard}>
      <div className={classes.text}>
        <Button href='#'>{category}</Button>
        <Typography variant='h4'>
          <Button href='#'>{title}</Button>
        </Typography>
      </div>
      <div className={classes.date}>
        <Typography variant='h3'>{month}</Typography>
        <Typography variant='h2'>{day}</Typography>
        <Typography variant='h4'>{year}</Typography>
      </div>
    </div>
  );
}

BlogCards.propTyps = {
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
};
