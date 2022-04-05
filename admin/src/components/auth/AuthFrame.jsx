import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import brand from '../../../public/text/brand';
import logo from '../../../public/images/logo.png';
import { useText } from '../../../theme/common';
import useStyles from './auth-style';
import LoadingOverlay from 'react-loading-overlay';
import { CircleToBlockLoading } from 'react-loadingg';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';

function AuthFrame(props) {
  const classes = useStyles();
  const text = useText();
  const { children, title, subtitle, i18n } = props;
  const theme = useTheme()
  const { adminFormSubmit } = useSelector((state) => state);

  return (
    <div className={classes.pageWrap}>
      <Hidden mdUp>
        <div className={clsx(classes.logo, classes.logoHeader)}>
          <a href={process.env.NEXT_PUBLIC_HOME_URL}>
            <img src={logo.src} alt='logo' />
            <Typography component='p' className={text.subtitle2}>
              brand
            </Typography>
          </a>
        </div>
      </Hidden>
        <Container maxWidth='lg' className={classes.innerWrap}>
          <div className={classes.decoration}>
            <svg className={classes.leftDeco}>
              <use xlinkHref='/admin/images/svg/deco-bg-left.svg#main' />
            </svg>
            <svg className={classes.rightDeco}>
              <use xlinkHref='/admin/images/svg/deco-bg-right.svg#main' />
            </svg>
          </div>

      <LoadingOverlay
        styles={{
          overlay: (base) => ({
            ...base,
            borderRadius: 40,
          }),
        }}
        active={adminFormSubmit}
        spinner={<CircleToBlockLoading color={theme.palette.secondary.main} />}>
          <Paper
            sx={{
              borderRadius: 10,
              background: 'transparent',
              boxShadow: '0 1.5px 12px 2px rgba(0, 0, 0, 0.28)',
              overflow: 'hidden',
            }}
            className={clsx(classes.formBox, 'fragment-fadeUp')}>
            <IconButton
              href={process.env.NEXT_PUBLIC_HOME_URL}
              target='_blank'
              className={classes.backtohome}>
              <i className='ion-ios-home-outline' />
              {i18n.language !== 'fa' ? (
                <i className='ion-ios-arrow-thin-left' />
              ) : (
                <i className='ion-ios-arrow-thin-right' />
              )}
            </IconButton>
            <div className={classes.authFrame}>
              <Grid container spacing={0}>
                <Grid item md={5} xs={12}>
                  <Hidden smDown>
                    <div className={classes.greeting}>
                      <div className={classes.logo}>
                        <img src={logo.src} alt='logo' />
                        <Typography className={text.subtitle2}>
                          {brand[`name_${i18n.language}`]}
                        </Typography>
                      </div>
                      <Typography
                        gutterBottom
                        variant='h4'
                        className={text.subtitle}>
                        {title}
                      </Typography>
                      <Typography variant='h6' className={text.paragraph}>
                        {subtitle}
                      </Typography>
                    </div>
                  </Hidden>
                </Grid>
                <Grid item md={7} xs={12}>
                  <div className={classes.formWrap}>{children}</div>
                </Grid>
              </Grid>
            </div>
          </Paper>
      </LoadingOverlay>
        </Container>
    </div>
  );
}

AuthFrame.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

AuthFrame.defaultProps = {
  subtitle: '',
};

export default AuthFrame;
