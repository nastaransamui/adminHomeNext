import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStyles from './header-style';
import routeLink from '../../../public/text/link';
import navMenu from '../../../public/text/menu';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { removeCookies } from 'cookies-next';

const MobileMenu = (props) => {
  const classes = useStyles();
  const { toggleDrawer, open, t, router } = props;
  const { accessToken } = useSelector((state) => state);
  const dispatch = useDispatch();

  const SideList = () => {
    return (
      <div
        className={classes.mobileNav}
        role='presentation'
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}>
        <div className={clsx(classes.menu, open && classes.menuOpen)}>
          <List component='nav'>
            {navMenu.map((item, index) => {
              return (
                <ListItem
                  button
                  component='a'
                  onClick={() => {
                    if (router.route == '/404') {
                      localStorage.setItem('scrollTo', index);
                      router.replace(`/#${item.en}`, '/', {
                        shallow: true,
                        scroll: false,
                        locale: router.locale,
                      });
                    } else {
                      router.push(`#${item.en}`);
                    }
                  }}
                  key={index.toString()}
                  style={{ animationDuration: index * 0.15 + 's' }}>
                  <ListItemText
                    primary={item[`${router.locale}`]}
                    className={classes.menuList}
                  />
                </ListItem>
              );
            })}
            <Divider className={classes.dividerSidebar} />
            {accessToken == null ? (
              [
                {
                  en: 'login',
                  fa: 'وارد شدن',
                },
                {
                  en: 'register',
                  fa: 'ثبت نام',
                },
                {
                  en: 'contact',
                  fa: 'تماس',
                },
              ].map((item, index) => {
                return (
                  <ListItem
                    button
                    component='a'
                    href={routeLink.panel[`${item.en}_${router.locale}`]}
                    key={index.toString()}
                    style={{ animationDuration: navMenu.length * 0.15 + 's' }}>
                    <ListItemText
                      primary={item[`${router.locale}`]}
                      className={classes.menuList}
                    />
                  </ListItem>
                );
              })
            ) : (
              <ListItem
                button
                component='button'
                onClick={() => {
                  dispatch({ type: 'ACCESS_TOKEN', payload: null });
                  removeCookies('accessToken');
                }}
                style={{ animationDuration: navMenu.length * 0.15 + 's' }}>
                <ListItemText
                  primary={t('header.header_logout')}
                  className={classes.menuList}
                />
              </ListItem>
            )}
          </List>
        </div>
      </div>
    );
  };
  return (
    <SwipeableDrawer
      anchor={router.locale == 'fa' ? 'right' : 'left'}
      open={open}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      classes={{ paper: classes.paperNav }}
      SlideProps={{ direction: router.locale == 'fa' ? 'left' : 'right' }}>
      <SideList />
    </SwipeableDrawer>
  );
};
MobileMenu.propTypes = {
  t: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired,
};

export default MobileMenu;
