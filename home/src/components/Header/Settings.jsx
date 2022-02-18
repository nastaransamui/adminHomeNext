import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import useStyles from './header-style';
import { useTranslation } from 'next-i18next';
import { useSelector, useDispatch } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import { langName } from '../../../public/text/langNames';
import { setCookies } from 'cookies-next';
import { useTheme } from '@mui/material/styles';
import {
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Popover,
  Switch,
  Typography,
} from '@mui/material';
import { route } from 'next/dist/server/router';

export default function Settings(props) {
  const { router, t, invert } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { themeType } = useSelector((state) => state);
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const handleChangeMode = (e) => {
    localStorage.setItem(
      'themeType',
      e.target.value == 'light' ? 'dark' : 'light'
    );
    dispatch({
      type: 'THEMETYPE',
      payload: e.target.value == 'light' ? 'dark' : 'light',
    });
    setCookies('themeType', e.target.value == 'light' ? 'dark' : 'light');
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeLang = (lang) => {
    // Handle language from 404 page
    setCookies('lang', lang.LangCode);
    if (router.route == '/404') {
      router.push(`${router.route}`, `${router.route}`, {
        locale: `${lang.LangCode}`,
        scroll: false,
        replace: true,
      });
    } else {
      router.push(`${router.asPath}`, `${router.asPath}`, {
        locale: `${lang.LangCode}`,
        scroll: false,
        replace: true,
      });
    }
  };

  return (
    <div className={classes.setting}>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        className={clsx(
          classes.icon,
          open && classes.active,
          invert && classes.invert
        )}>
        <SettingsIcon fontSize='inherit' />
      </IconButton>
      <Popover
        disableScrollLock
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        classes={{
          paper: classes.paper,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <List
          component='nav'
          className={classes.modeMenu}
          aria-label='Mode-menu'
          subheader={
            <ListSubheader component='div'>
              {t('header.header_theme')}
            </ListSubheader>
          }>
          <ListItem>
            <Typography component='div'>
              <Grid component='label' container alignItems='center' spacing={1}>
                <Grid item>
                  {router.locale == 'en'
                    ? t('header.header_light')
                    : t('header.header_dark')}
                </Grid>
                <Grid item>
                  <Switch
                    checked={themeType == 'dark'}
                    onChange={handleChangeMode}
                    value={themeType}
                    inputProps={{ 'aria-label': 'checkbox' }}
                  />
                </Grid>
                <Grid item>
                  {router.locale == 'en'
                    ? t('header.header_dark')
                    : t('header.header_light')}
                </Grid>
              </Grid>
            </Typography>
          </ListItem>
        </List>
        <Divider />
        <List
          component='nav'
          className={classes.langMenu}
          aria-label='Language-menu'
          subheader={
            <ListSubheader component='div'>
              {t('header.header_language')}
            </ListSubheader>
          }>
          {langName.map((item, i) => {
            return (
              <ListItem
                key={i.toString()}
                role={undefined}
                dense
                button
                onClick={() => handleChangeLang(item)}
                style={{
                  display: 'flex',
                  flexDirection:
                    theme.direction == 'rtl' ? 'row-reverse' : 'row',
                }}>
                <img
                  src={`/images/langs/${item.Flag}`}
                  alt={item.Lang}
                  style={{ width: 20, height: 20 }}
                />{' '}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <ListItemText primary={item[`title_${router.locale}`]} />
                {router.locale === item.LangCode && (
                  <ListItemSecondaryAction>
                    <CheckIcon color='primary' />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          })}
        </List>
      </Popover>
    </div>
  );
}

Settings.propTypes = {
  // toggleDark: PropTypes.func.isRequired,
  // toggleDir: PropTypes.func.isRequired,
  invert: PropTypes.bool,
  t: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};

Settings.defaultProps = {
  invert: false,
};
