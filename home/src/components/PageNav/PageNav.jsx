import pageNavStyles from './pagenav-style';
import { useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Scrollspy from 'react-scrollspy';
import { Button, Fab, Tooltip } from '@mui/material';
import navMenu from '../../../public/text/menu';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useTranslation } from 'next-i18next';

function createData(id, name, url) {
  return {
    id,
    en_name: name.en,
    fa_name: name.fa,
    url,
  };
}
const LinkBtn = forwardRef((props, ref) => {
  const { href, children } = props;
  return (
    <AnchorLink href={href} {...props} style={{ cursor: 'pointer' }}>
      {children}
    </AnchorLink>
  );
});

export default function PageNav(props) {
  const { router } = props;
  const classes = pageNavStyles();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('home');
  let flagShow = false;
  const handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagShow = scroll > 500;
    if (flagShow !== newFlagShow) {
      setShow(newFlagShow);
      flagShow = newFlagShow;
    }
  };
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      isMount = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const [menuList, setMenuList] = useState([]);

  // Add navMenu to menu List
  useEffect(() => {
    let isMount = true;
    if (isMount && menuList.length == 0) {
      for (let index = 0; index < navMenu.length; index++) {
        const element = navMenu[index];
        menuList.push(
          createData(index, element, '#' + element.en.replace(/ /g, '_'))
        );
        setMenuList(menuList);
      }
    }
    return () => {
      isMount = false;
    };
  }, []);

  return (
    <div className={clsx(classes.pageNav, show && classes.show)}>
      <nav className={classes.sectionNav}>
        <Scrollspy items={navMenu.map((t) => t.en)} currentClassName='active'>
          {menuList.map((item) => {
            return (
              <li
                key={item.id.toString()}
                style={{top: 30 * (navMenu.length - item.id)}}
                data-id={item.id}>
                <Tooltip
                  title={item[`${router.locale}_name`]}
                  placement={router.locale == 'fa' ? 'right' : 'left'}
                  classes={{ tooltip: classes.tooltip }}>
                  <LinkBtn href={item.url}></LinkBtn>
                </Tooltip>
              </li>
            );
          })}
        </Scrollspy>
      </nav>
      <Tooltip
        title={t('header.pageNav_top')}
        placement={router.locale == 'fa' ? 'right' : 'left'}
        classes={{ tooltip: classes.tooltip }}>
        <Fab
          color='secondary'
          aria-label='To top'
          component={LinkBtn}
          href='#home'
          className={classes.fab}>
          <ArrowUpwardIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}
