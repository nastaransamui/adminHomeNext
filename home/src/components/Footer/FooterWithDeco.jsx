import useStyles from './footer-style';
import { Typography, Button, Hidden } from '@mui/material';
import Footer from './Footer';
import { useText } from '../../../theme/common';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import { useTheme } from '@mui/styles';

export default function FooterWithDeco() {
  const classes = useStyles();
  const text = useText();
  const { t } = useTranslation('home');
  const theme = useTheme();

  return (
    <div className={classes.footerDeco}>
      <Hidden smDown>
        <div
          className={
            theme.direction === 'rtl'
              ? classes.decorationFa
              : classes.decoration
          }>
          <svg
            className={
              theme.direction === 'rtl' ? classes.leftDecoFa : classes.leftDeco
            }>
            <use xlinkHref='/images/svg/deco-bg-left.svg#main' />
          </svg>
          <div
            className={
              theme.direction === 'rtl' ? classes.lineDecoFa : classes.lineDeco
            }>
            <svg
              className={
                theme.direction === 'rtl'
                  ? classes.rightDecoBeforeFa
                  : classes.rightDecoBefore
              }>
              <use xlinkHref='/images/svg/deco-bg-right.svg#main' />
            </svg>
            <svg
              className={
                theme.direction === 'rtl'
                  ? classes.rightDecoFa
                  : classes.rightDeco
              }>
              <use xlinkHref='/images/svg/deco-bg-right.svg#main' />
            </svg>
          </div>
        </div>
      </Hidden>
      <div className={classes.action}>
        <Typography variant='h4' className={text.title2}>
          {t('footer.footer_waiting')}
        </Typography>
        <Button variant='contained' color='secondary' size='large'>
          {t('footer.getstarted')}
        </Button>
      </div>
      <Footer />
    </div>
  );
}
