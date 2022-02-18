import cardsStyles from './cards-style';
import PropsType from 'prop-types';
import { Typography, ButtonBase, Paper } from '@mui/material';
import link from '../../../public/text/link';

export default function MovieThumb(props) {
  const classes = cardsStyles();
  const { t, item, router, onPlayClick } = props;
  const img = item.thumb;
  const text = item[`title_${router.locale}`];

  return (
    <Paper className={classes.movieThumb}>
      <ButtonBase
        component='a'
        href={link[`detail_${router.locale}`]}
        className={classes.btnWrap}>
        <figure>
          <i
            className='ion-arrow-right-b play'
            onClick={() => {
              onPlayClick(item);
            }}
          />
          <img src={img} alt={text} />
          <figcaption>{t('featured.thumbCaption')}</figcaption>
        </figure>
        <Typography component='span' className={classes.text}>
          {text}
        </Typography>
      </ButtonBase>
    </Paper>
  );
}

MovieThumb.propsType = {
  img: PropsType.string.isRequired,
  text: PropsType.string.isRequired,
  t: PropsType.func.isRequired,
};
