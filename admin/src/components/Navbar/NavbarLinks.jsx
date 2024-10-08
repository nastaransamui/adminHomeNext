import {
  MenuItem,
  MenuList,
  ClickAwayListener,
  Paper,
  Grow,
  Hidden,
  Popper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';

import { removeCookies, setCookies, getCookies } from 'cookies-next';
import { useTheme } from '@mui/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import navbarLinksStyle from './navbar-links-style';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import classNames from 'classnames';
import { langName } from '../../../public/text/langNames';
import jwt from 'jsonwebtoken';
import Alert from 'react-s-alert';

export default function NavbarLinks(props) {
  const classes = navbarLinksStyle();
  const history = useHistory();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { i18n, t, handleDrawerToggle } = props;
  const rtlActive = i18n.language == 'fa';
  const dispatch = useDispatch();
  const [openNotification, setOpenNotification] = useState(false);
  const { adminAccessToken } = useSelector((state) => state);
  const profile = jwt.verify(
    adminAccessToken,
    process.env.NEXT_PUBLIC_SECRET_KEY,
    (err, user) => {
      if (!err) {
        return user;
      }
    }
  );
  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
    isMobile && handleDrawerToggle()
  };

  const [openProfile, setOpenProfile] = useState(null);
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  const [openSettings, setOpenSettings] = useState(null);
  const handleClickSettings = (event) => {
    if (openSettings && openSettings.contains(event.target)) {
      setOpenSettings(null);
    } else {
      setOpenSettings(event.currentTarget);
    }
  };

  const handleCloseSetting = () => {
    setOpenSettings(null);
  };
  const handleChangeMode = (e) => {
    localStorage.setItem(
      'adminThemeType',
      theme.palette.type == 'light' ? 'dark' : 'light'
    );
    dispatch({
      type: 'ADMIN_THEMETYPE',
      payload: theme.palette.type == 'light' ? 'dark' : 'light',
    });
    setCookies(
      'adminThemeType',
      theme.palette.type == 'light' ? 'dark' : 'light'
    );
  };
  const handleChangeLang = (lang) => {
    isMobile && handleDrawerToggle()
    localStorage.setItem('i18nextLng', lang);
    setCookies('i18nextLng', lang.LangCode);
    i18n.changeLanguage(lang.LangCode);
  };
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    [classes.dropdownItemRTL]: rtlActive,
  });
  const wrapper =
    classes.wrapper +
    ' ' +
    classNames({
      [classes.wrapperRTL]: rtlActive,
    });
  const managerClasses = classNames({
    [classes.managerClasses]: true,
  });

  const logOut = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_URL}/api/auth/logout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: profile.id }),
      }
    );
    const { status, statusText } = res;
    if (status == 200) {
      handleCloseProfile();
      removeCookies('adminAccessToken');
      dispatch({
        type: 'ADMIN_ACCESS_TOKEN',
        payload: null,
      });
      router.push('/');
    } else {
      Alert.error('', {
        customFields: {
          message: statusText,
          styles: {
            backgroundColor: theme.palette.error.dark,
            zIndex: 99999,
          },
        },
        onClose: function () {
          console.log(res.status);
        },
        timeout: 'none',
        position: 'bottom',
        effect: 'bouncyflip',
      });
    }
  };


  return (
    <div className={wrapper}>
      <div className={managerClasses}>
        <IconButton
          aria-label='Notifications'
          aria-owns={openNotification ? 'notification-menu-list' : null}
          aria-haspopup='true'
          onClick={handleClickNotification}
          className={classes.buttonLink}
          classes={{ label: rtlActive ? classes.labelRTL : '' }}>
          <NotificationsIcon
            className={
              classes.headerLinksSvg +
              ' ' +
              (rtlActive
                ? classes.links + ' ' + classes.linksRTL
                : classes.links)
            }
          />
          <span className={classes.notifications}>5</span>
          <Hidden smUp implementation='css'>
            <span
              onClick={(e) => {
                handleClickNotification(e);
              }}
              className={classes.linkText}>
              {t('notification')}
            </span>
          </Hidden>
        </IconButton>
        <Popper
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          placement='bottom-end'
          className={classNames({
            [classes.popperClose]: !openNotification,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}>
          {({ TransitionProps }) => {
            return (
              <Grow
                {...TransitionProps}
                id='notification-menu-list'
                style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleCloseNotification}>
                    <MenuList role='menu'>
                      <MenuItem
                        onClick={handleCloseNotification}
                        className={dropdownItem}>
                        {rtlActive
                          ? 'مایک جان به ایمیل شما پاسخ داد'
                          : 'Mike John responded to your email'}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            );
          }}
        </Popper>
      </div>
      <div className={managerClasses}>
        <IconButton
          aria-owns={openProfile ? 'profile-menu-list' : null}
          aria-haspopup='true'
          onClick={handleClickProfile}
          className={classes.buttonLink}
          classes={{ label: rtlActive ? classes.labelRTL : '' }}>
          <PersonIcon
            className={
              classes.headerLinksSvg +
              ' ' +
              (rtlActive
                ? classes.links + ' ' + classes.linksRTL
                : classes.links)
            }
          />
          <Hidden smUp implementation='css'>
            <span onClick={handleClickProfile} className={classes.linkText}>
              {t('MyProfile')}
            </span>
          </Hidden>
        </IconButton>
        <Popper
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          placement='bottom-end'
          className={classNames({
            [classes.popperClose]: !openProfile,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}>
          {({ TransitionProps }) => {
            return (
              <Grow
                {...TransitionProps}
                id='profile-menu-list'
                className={classes.langGrow}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleCloseProfile}>
                    <List
                      component='nav'
                      className={classes.langMenu}
                      aria-label='profile-menu-list'>
                      <ListItem
                        style={{ display: 'flex', flexDirection: 'row' }}
                        role={undefined}
                        dense
                        button
                        className={dropdownItem + ' ' + classes.languagePack}
                        onClick={() => {
                          handleCloseProfile();
                          isMobile && handleDrawerToggle()
                          history.push({
                            pathname: '/admin/dashboard/user-page',
                            search: `?_id=${profile.id}`,
                            profile: profile,
                          });
                        }}>
                        {profile?.profileImage !== '' ? (
                          <img
                            src={profile?.profileImage}
                            className={classes.avatarImg}
                            alt='...'
                          />
                        ) : (
                          <AccountCircleIcon color='primary' />
                        )}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <ListItemText primary={t('Profile')} />
                      </ListItem>
                      <ListItem
                        style={{ display: 'flex', flexDirection: 'row' }}
                        role={undefined}
                        dense
                        button
                        className={dropdownItem + ' ' + classes.languagePack}
                        onClick={() => {
                          isMobile && handleDrawerToggle()
                          logOut();
                        }}>
                        <LogoutIcon color='primary' />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <ListItemText primary={t('Log out')} />
                      </ListItem>
                    </List>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            );
          }}
        </Popper>
      </div>
      <div className={managerClasses}>
        <IconButton
          aria-owns={openSettings ? 'settings-menu-list' : null}
          aria-haspopup='true'
          onClick={handleClickSettings}
          className={classes.buttonLink}
          classes={{ label: rtlActive ? classes.labelRTL : '' }}>
          <LanguageIcon
            className={
              classes.headerLinksSvg +
              ' ' +
              (rtlActive
                ? classes.links + ' ' + classes.linksRTL
                : classes.links)
            }
          />
          <Hidden smUp implementation='css'>
            <span onClick={handleClickSettings} className={classes.linkText}>
              {t('header').header_language}
            </span>
          </Hidden>
        </IconButton>
        <Popper
          open={Boolean(openSettings)}
          anchorEl={openSettings}
          transition
          disablePortal
          placement='bottom'
          className={classNames({
            [classes.popperClose]: !openSettings,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}>
          {({ TransitionProps }) => {
            return (
              <Grow
                {...TransitionProps}
                id='Language-menu'
                className={classes.langGrow}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleCloseSetting}>
                    <List
                      className={classes.langMenu}
                      aria-label='Language-menu'>
                      {langName.map((item, i) => {
                        return (
                          <ListItem
                            secondaryAction={
                              i18n.language === item.LangCode && (
                                <IconButton
                                  edge='end'
                                  aria-label='comments'
                                  className={classes.checkIcon}>
                                  <CheckIcon color='primary' />
                                </IconButton>
                              )
                            }
                            key={i.toString()}
                            role={undefined}
                            dense
                            button
                            className={
                              dropdownItem + ' ' + classes.languagePack
                            }
                            onClick={() => handleChangeLang(item)}
                            style={{}}>
                            <img
                              src={`/admin/images/langs/${item.Flag}`}
                              alt={item.Lang}
                              style={{ width: 20, height: 20 }}
                            />{' '}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <ListItemText
                              primary={item[`title_${i18n.language}`]}
                            />
                            {/* {i18n.language === item.LangCode && (
                              <ListItemSecondaryAction>
                                <CheckIcon color='primary' />
                              </ListItemSecondaryAction>
                            )} */}
                          </ListItem>
                        );
                      })}
                    </List>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            );
          }}
        </Popper>
      </div>
      <IconButton
        className={classes.buttonLink}
        classes={{ label: rtlActive ? classes.labelRTL : '' }}
        onClick={handleChangeMode}>
        {theme.palette.type == 'dark' ? (
          <DarkModeIcon
            className={
              classes.headerLinksSvg + ' ' + rtlActive
                ? classes.links + ' ' + classes.linksRTL
                : classes.links
            }
          />
        ) : (
          <LightModeIcon
            className={
              classes.headerLinksSvg + ' ' + rtlActive
                ? classes.links + ' ' + classes.linksRTL
                : classes.links
            }
          />
        )}
        <Hidden smUp implementation='css'>
          <span className={classes.linkText}>
            {i18n.language !== 'fa'
              ? t('header').header_dark
              : t('header').header_light}
          </span>
        </Hidden>
      </IconButton>
    </div>
  );
}
