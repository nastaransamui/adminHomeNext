import formStyles from './form-style';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Hidden,
  IconButton,
  Paper,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import brand from '../../../public/text/brand';
import link from '../../../public/text/link';
import { useText } from '../../../theme/common';
import LoadingOverlay from 'react-loading-overlay';
import { CircleToBlockLoading } from 'react-loadingg';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';

export default function AuthFrame(props) {
  const classes = formStyles();
  const text = useText();
  const theme = useTheme();
  const { children, title, subtitle, router } = props;
  const { formSubmit } = useSelector((state) => state);
  return (
    <div className={classes.pageWrap} >
      <Hidden mdUp>
        <div className={clsx(classes.logo, classes.logoHeader)}>
          <a href={link.panel[`home_${router.locale}`]}>
            <img src='/images/logo.svg' alt='' />
            <Typography component='span' className={text.subtitle2}>
              {brand[`projectName_${router.locale}`]}
            </Typography>
          </a>
        </div>
      </Hidden>
      <LoadingOverlay
        styles={{
          overlay: (base) => ({
            ...base,
            borderRadius: 40,
            width: '96%',
            marginLeft: '2%',
          }),
        }}
        active={formSubmit}
        spinner={<CircleToBlockLoading color={theme.palette.secondary.main} />}>
        <Container maxWidth='lg' className={classes.innerWrap} >
          <Paper className={classes.formBox} >
            <IconButton
              href={`/${router.locale}/`}
              className={classes.backtohome}>
              <i className='ion-ios-home-outline' />
              {router.locale !== 'fa' ? (
              <i className='ion-ios-arrow-thin-left' />
            ) : (
              <i className='ion-ios-arrow-thin-right' />
            )}
            </IconButton>
            <div className={classes.authFrame}>
              <Grid container spacing={0}>
                <Grid item md={5} xs={12}>
                  <Hidden smDown>
                    <div className={classes.greeting} >
                      <div className={classes.deco}>
                        <div className={classes.primaryLight} />
                        <div className={classes.secondaryMain} />
                        <div className={classes.secondaryLight} />
                      </div>
                      <div className={classes.logo}>
                        <img src='/images/logo.svg' alt='logo' />
                        <Typography className={text.subtitle2}>
                          {brand[`projectName_${router.locale}`]}
                        </Typography>
                      </div>
                      <Typography gutterBottom variant='h4'>
                        {title}
                      </Typography>
                      <Typography variant='h6' className={text.subtitle2}>
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
        </Container>
      </LoadingOverlay>
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
