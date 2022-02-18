import {
  AppBar,
  Button,
  Container,
  Divider,
  Hidden,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import useStyles from './header-style';
import clsx from 'clsx';
import { useTheme } from '@mui/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Scrollspy from 'react-scrollspy';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import routeLink from '../../../public/text/link';
import navMenu from '../../../public/text/menu';
import { useTranslation } from 'next-i18next';
import MobileMenu from './MobileMenu';
import Settings from './Settings';
import { checkCookies, getCookie, setCookies, removeCookies } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { useSelector, useDispatch } from 'react-redux';

let counter = 0;
export function createData(name, url, offset) {
  counter += 1;
  return {
    id: counter,
    en_name: name.en,
    fa_name: name.fa,
    url,
    offset,
  };
}

export const LinkBtn = forwardRef((props, ref) => {
  const { href, children } = props;
  return (
    <AnchorLink href={href} {...props} style={{ cursor: 'pointer' }}>
      {children}
    </AnchorLink>
  );
});

export default function Header(props) {
  const { invert } = props;
  const router = useRouter();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('home');
  const [fixed, setFixed] = useState(false);
  let flagFixed = false;
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  const handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagFixed = scroll > 50;
    if (flagFixed !== newFlagFixed) {
      setFixed(newFlagFixed);
      flagFixed = newFlagFixed;
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
  const [openDrawer, setOpenDrawer] = useState(false);
  const [menuList, setMenuList] = useState([]);

  // Add navMenu to menu List
  useEffect(() => {
    let isMount = true;
    if (isMount && menuList.length == 0) {
      setMenuList([]);
      for (let index = 0; index < navMenu.length; index++) {
        const element = navMenu[index];
        menuList.push(createData(element, '#' + element.en, 50));
        setMenuList(menuList);
      }
    }
    return () => {
      isMount = false;
    };
  }, []);

  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };


  return (
    <Fragment>
      {isMobile && (
        <MobileMenu
          t={t}
          toggleDrawer={handleOpenDrawer}
          open={openDrawer}
          router={router}
        />
      )}
      <AppBar
        component='header'
        position='relative'
        id='header'
        className={clsx(
          classes.header,
          fixed && classes.fixed,
          invert && classes.invert,
          openDrawer && classes.openDrawer
        )}>
        <Container fixed={isDesktop} className={classes.headerContainer}>
          <div className={classes.headerContent}>
            <nav
              className={clsx(
                classes.navMenu,
                classes.navLogo,
                invert && classes.invert,
                openDrawer && classes.openDrawer
              )}>
              {isMobile && (
                <IconButton
                  onClick={() => handleOpenDrawer()}
                  className={clsx(
                    'hamburger hamburger--spin',
                    classes.mobileMenu,
                    openDrawer && 'is-active'
                  )}>
                  <span className='hamburger-box'>
                    <span className={clsx(classes.bar, 'hamburger-inner')} />
                  </span>
                </IconButton>
              )}
              <div className={classes.logo}>
                <Link href='/'>
                  <img
                    src='/images/logo.svg'
                    alt='logo'
                    style={{ cursor: 'pointer' }}
                  />
                </Link>
              </div>
              {isDesktop && (
                <>
                  {router.asPath == '/' || router.asPath.includes('#') ? (
                    <Scrollspy
                      items={navMenu.map((t) => t.en)}
                      currentClassName='active'>
                      {menuList.map((item) => {
                        return (
                          <li key={item.id.toString()}>
                            <Button
                              component={LinkBtn}
                              offset={item.offset}
                              href={item.url}
                              router={router}>
                              {item[`${router.locale}_name`]}
                            </Button>
                          </li>
                        );
                      })}
                    </Scrollspy>
                  ) : (
                    <>
                      {menuList.map((item, index) => {
                        return (
                          <Button
                            key={item.id.toString()}
                            style={{
                              color:
                                theme.palette.mode === 'light'
                                  ? theme.palette.common.black
                                  : theme.palette.common.white,
                            }}
                            onClick={() => {
                              localStorage.setItem('scrollTo', index);
                              router.replace(`/${item.url}`, '/', {
                                shallow: true,
                                scroll: false,
                                locale: router.locale,
                              });
                            }}>
                            {item[`${router.locale}_name`]}
                          </Button>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </nav>
            <Hidden mdDown>
              <Divider className={classes.divider} />
            </Hidden>
            <nav className={clsx(classes.navMenu, classes.navAuth)}>
              <Hidden xsDown>
                <Button
                  href={routeLink.panel[`contact_${router.locale}`]}
                  variant='contained'
                  className={classes.button}>
                  {t('header.header_contact')}
                </Button>
                {checkCookies('accessToken') ? (
                  <Button
                    onClick={() => {
                      dispatch({ type: 'ACCESS_TOKEN', payload: null });
                      removeCookies('accessToken');
                    }}
                    style={{
                      color:
                        theme.palette.mode === 'light'
                          ? theme.palette.common.black
                          : theme.palette.common.white,
                    }}>
                    {t('header.header_logout')}
                  </Button>
                ) : (
                  <>
                    <Button href={routeLink.panel[`login_${router.locale}`]}>
                      {t('header.header_login')}
                    </Button>
                    <Button href={routeLink.panel[`register_${router.locale}`]}>
                      {t('header.header_register')}
                    </Button>
                  </>
                )}
              </Hidden>
              <Settings invert={invert} t={t} router={router} />
            </nav>
          </div>
        </Container>
      </AppBar>
    </Fragment>
  );
}

Header.defaultProps = {
  sticky: false,
  invert: false,
};
