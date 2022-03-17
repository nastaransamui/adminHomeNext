import useStyles from './auth-style';
import palette from '../../../theme/palette';
import PaletteIcon from '@mui/icons-material/Palette';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { InputAdornment, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { langName } from '../../../public/text/langNames';
import {
  handleLanguage,
  handleLangSelectChange,
  handleThemeName,
  handleMode,
} from '../../components/auth/functions';

import PropTypes from 'prop-types';

function LanguagePack(props) {
  const classes = useStyles();
  const { t, i18n } = props;
  const dispatch = useDispatch();
  const { adminThemeName, adminThemeType } = useSelector((state) => state);
  const [values, setValues] = useState({
    lang: i18n.language == 'en' ? 'en-US' : i18n.language,
    paletteName: adminThemeName,
    mode: adminThemeType,
  });
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      setValues((oldValues) => ({
        ...oldValues,
        lang: i18n.language == 'en' ? 'en-US' : i18n.language,
        paletteName: adminThemeName,
        mode: adminThemeType,
      }));
    }
    return () => {
      isMount = false;
    };
  }, [adminThemeName, adminThemeType, i18n.language]);

  return (
    <div className={classes.socmedSideLogin}>
      <Select
        value={values.lang}
        onChange={(e) => {
          handleLangSelectChange(setValues, e);
        }}
        startAdornment={
          <InputAdornment position='start'>
            <span></span>
          </InputAdornment>
        }
        className={classes.selectLang}
        classes={{
          selectMenu: classes.selectMenu,
        }}
        input={<OutlinedInput name='lang' id='chang-lang' />}>
        {langName.map((item, i) => {
          return (
            <MenuItem
              key={i.toString()}
              value={item.LangCode}
              onClick={() => {
                handleLanguage(item.LangCode, i18n);
              }}>
              <img
                src={`/admin/images/langs/${item.Flag}`}
                alt={item.Lang}
                className={classes.flag}
              />{' '}
              &nbsp;
              <span className={classes.menuItemText}>
                {item[`title_${values.lang}`]}
              </span>
            </MenuItem>
          );
        })}
      </Select>
      <Select
        value={values.paletteName}
        startAdornment={
          <InputAdornment className={classes.icon} position='start'>
            <span></span>
          </InputAdornment>
        }
        className={classes.selectLang}
        classes={{ selectMenu: classes.selectMenu }}
        input={<OutlinedInput name='theme' id='change-theme' />}>
        {Object.keys(palette).map(function (key, index) {
          return (
            <MenuItem
              key={index}
              value={key}
              onClick={() => {
                handleThemeName(key, dispatch);
              }}
              style={{ background: palette[key].palette.primary.main }}>
              <PaletteIcon
                style={{ color: palette[key].palette.secondary.light }}
              />
              &nbsp;
              <span className={classes.menuItemText}>{t(`${key}`)}</span>
            </MenuItem>
          );
        })}
      </Select>
      <Select
        value={adminThemeType}
        onChange={(e) => {
          handleLangSelectChange(setValues, e);
        }}
        startAdornment={
          <InputAdornment position='start'>
            <span></span>
          </InputAdornment>
        }
        className={classes.selectLang}
        classes={{
          selectMenu: classes.selectMenu,
        }}
        input={<OutlinedInput name='mode' id='chang-mode' />}>
        {['dark', 'light'].map((item, i) => {
          return (
            <MenuItem
              key={i}
              value={item}
              onClick={(e) => {
                handleMode(item, dispatch);
              }}>
              {adminThemeType == 'light' ? <LightModeIcon /> : <DarkModeIcon />}
              &nbsp;
              <span className={classes.menuItemText}>{t(`${item}`)}</span>
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}

export default LanguagePack;
