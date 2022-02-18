import aboutStyles from './about-style';
import { Container, Hidden, Button, Typography, Grid } from '@mui/material';
import clsx from 'clsx';
import { useText } from '../../../theme/common';
import { useTranslation } from 'next-i18next';

export default function About(props) {
  const { router } = props;
  const classes = aboutStyles();
  const text = useText();
  const { t } = useTranslation('home');
  return (
    <div className={classes.root}>
      <Container fixed>
        <Grid container justify='center' spacing={8}>
          <Grid item md={6} xs={12} className={classes.illuWrap}>
            <Hidden smDown>
              <div className={clsx(classes.illustration, classes.one)} />
              <figure className={clsx(classes.illustration, classes.two)}>
                <img src='https://unsplash.it/456/304/?random' alt='about' />
              </figure>
              <figure className={clsx(classes.illustration, classes.three)}>
                <img src='https://unsplash.it/237/158/?random' alt='about' />
              </figure>
              <figure className={clsx(classes.illustration, classes.four)}>
                <img src='https://unsplash.it/317/211/?random' alt='about' />
              </figure>
              <div className={clsx(classes.illustration, classes.fiv)} />
            </Hidden>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className={`animate__animated animate__fadeIn${router.locale == 'fa' ? 'Right' : 'Left'}`}>
              <div className={classes.title}>
                <Typography variant='h3' className={text.title}>
                  <span>{t('about.title')}</span>
                </Typography>
              </div>
              <Typography className={text.paragraph}>
                {t('about.desc')}
              </Typography>
              <Button className={classes.white} variant='contained'>
                {t('about.join')}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
