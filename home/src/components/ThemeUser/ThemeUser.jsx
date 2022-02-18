import { Fragment } from 'react';
import useStyles from './palette-style';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Hidden,
  useMediaQuery,
  SwipeableDrawer,
  IconButton,
  Button,
  Typography,
  Grid,
  Paper,
  AppBar,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import themeList from '../../../theme/palette';
import { useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import PaletteIcon from '@mui/icons-material/Palette';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { removeCookies, setCookies } from 'cookies-next';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import DashboardIcon from '@mui/icons-material/Dashboard';
import jwt from 'jsonwebtoken';
import { useTranslation } from 'next-i18next';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      <Box p={3}>{children}</Box>
    </div>
  );
}

function ProviderIcon(props) {
  const { provider, ...others } = props;
  return (
    <>
      {provider == 'twitter' ? (
        <TwitterIcon {...others} style={{ fill: '#28aae1' }} />
      ) : provider == 'facebook' ? (
        <FacebookIcon {...others} style={{ fill: '#3b579d' }} />
      ) : provider == 'google' ? (
        <GoogleIcon {...others} style={{ fill: '#dd493c' }} />
      ) : (
        <LibraryBooksIcon {...others} />
      )}
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function ThemeUser(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tab, setTab] = useState(0);
  const { themeName, accessToken } = useSelector((state) => state);
  const { router } = props;
  const { t } = useTranslation('home');

  const handleToggleOpen = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleToggleOpenTheme = () => {
    setOpenDrawer(!openDrawer);
    setTab(0);
  };

  const handleToggleOpenProfile = () => {
    setOpenDrawer(!openDrawer);
    setTab(1);
  };

  const handleChangeTab = (e, selectedTab) => {
    setTab(selectedTab);
  };

  const handleClose = () => {
    setOpenDrawer(false);
  };

  const changeTheme = (clr) => {
    localStorage.setItem('themeName', clr);
    dispatch({ type: 'THEMENAME', payload: clr });
    setCookies('themeName', clr);
  };

  const profile = jwt.verify(
    accessToken,
    process.env.SECRET_KEY,
    (err, user) => {
      if (!err) {
        return user;
      } else {
        removeCookies('accessToken');
      }
    }
  );

  return (
    <Fragment>
      <SwipeableDrawer
        anchor={router.locale == 'fa' ? 'left' : 'right'}
        open={openDrawer}
        onClose={handleClose}
        onOpen={handleToggleOpen}
        SlideProps={{
          direction: router.locale !== 'fa' ? 'left' : 'right',
        }}
        classes={{
          paper: classes.draweBg,
        }}>
        <div className={classes.optWrap}>
          <AppBar
            position='fixed'
            color='default'
            classes={{ root: classes.appbar }}>
            <Hidden smUp>
              <IconButton onClick={handleClose} className={classes.mobileBack}>
                <ArrowBackIcon />
              </IconButton>
            </Hidden>
            <Tabs
              value={tab}
              className={classes.tab}
              onChange={handleChangeTab}
              textColor='inherit'
              indicatorColor='secondary'
              centered>
              <Tab
                label={t('themeUser.theme')}
                icon={isDesktop ? <PaletteIcon /> : ''}
                classes={{ root: classes.wrapper }}
              />
              <Tab
                icon={
                  isDesktop ? <ProviderIcon provider={profile?.provider} /> : ''
                }
                label={t('themeUser.profile')}
                classes={{ root: classes.wrapper }}
                disabled={accessToken == null}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            <div className={classes.themeColor}>
              <Paper className={classes.paper}>
                <Typography variant='h6'>
                  {t('themeUser.combination')}
                </Typography>
                <Grid container className={classes.swatchWrapper}>
                  {Object.keys(themeList).map((clr, index) => {
                    return (
                      <Grid key={index.toString()} item sm={3} xs={4}>
                        <Tooltip title={clr} placement='top' arrow>
                          <Button
                            className={clsx(
                              classes.swatch,
                              themeName === clr && classes.active
                            )}
                            onClick={() => changeTheme(clr)}>
                            <span
                              className={classes.primary}
                              style={{
                                background: themeList[clr].palette.primary.main,
                                boxShadow: `0 0 0 6px ${themeList[clr].palette.primary.light}, 0 0 0 12px ${themeList[clr].palette.primary.dark}, rgba(0, 0, 0, 0.45) 0px 0px 6px 12px`,
                              }}>
                              &nbsp;
                            </span>
                            <span
                              className={classes.secondary}
                              style={{
                                background:
                                  themeList[clr].palette.secondary.main,
                                boxShadow: `0 0 0 4px ${themeList[clr].palette.secondary.light}, 0 0 0 8px ${themeList[clr].palette.secondary.dark}, rgba(0, 0, 0, 0.30) 0px 0px 5px 9px`,
                              }}>
                              &nbsp;
                            </span>
                          </Button>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </div>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <div className={classes.profile}>Profile</div>
          </TabPanel>
        </div>
      </SwipeableDrawer>
      <div className={clsx(classes.btn, openDrawer && classes.active)}>
        <Tooltip arrow title={t('themeUser.theme')} placement='top'>
          <IconButton onClick={handleToggleOpenTheme}>
            <PaletteIcon />
          </IconButton>
        </Tooltip>
        {accessToken !== null && profile !== undefined && (
          <Tooltip title={t('themeUser.profile')} placement='left'>
            <IconButton onClick={handleToggleOpenProfile}>
              <ProviderIcon provider={profile.provider} />
            </IconButton>
          </Tooltip>
        )}
        {accessToken !== null && profile !== undefined && profile.isAdmin && (
          <Tooltip arrow title={t('themeUser.adminPanel')} placement='bottom'>
            <IconButton>
              <a href={process.env.NEXT_PUBLIC_ADMIN_URL} target='_blank'>
                <DashboardIcon />
              </a>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Fragment>
  );
}
