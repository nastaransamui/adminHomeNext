import { createRef } from 'react';
import navbarStyle from './navbar-style';
import cx from 'classnames';
import { AppBar, Button, Hidden, IconButton, Toolbar } from '@mui/material';
import clsx from 'clsx';
import { MoreVert, ViewList, Menu } from '@mui/icons-material';
import brand from '../../../public/text/brand';
import PropTypes from 'prop-types';
import NavbarLinks from './NavbarLinks';

export default function NavbarMain(props) {
  const { propsMiniActive, color, location, i18n, routes, handleDrawerToggle, sidebarMinimizeFunc } =
    props;
  const classes = navbarStyle();
  const mainPanel = createRef();
  const mainPanelClasses =
    classes.mainPanel +
    ' ' +
    cx({
      [classes.mainPanelSidebarMini]: propsMiniActive,
    });
  const appBarClasses = cx({
    [' ' + classes[color]]: color,
  });
  const sidebarMinimize =
    classes.sidebarMinimize +
    ' ' +
    cx({
      [classes.sidebarHandlemainOpen]: propsMiniActive,
      [classes.sidebarHandlemainClose]: !propsMiniActive,
    });

  const getActiveRoute = (routes) => {
    let activeRoute = brand[`name_${i18n.language}`];
    for (let i = 0; i < routes.length; i++) {
      if (!routes[i].collapse) {
        if (routes[i].layout.concat(routes[i].path) == location.pathname) {
          return routes[i][`name_${i18n.language}`];
        }
      } else {
        for (let j = 0; j < routes[i].views.length; j++) {
          if (!routes[i].views[j].collapse) {
            if (
              routes[i].views[j].layout.concat(routes[i].views[j].path) ==
              location.pathname
            ) {
              return routes[i].views[j][`name_${i18n.language}`];
            }
          } else {
            for (let k = 0; k < routes[i].views[j].views.length; k++) {
              if (!routes[i].views[j].views[k].collapse) {
                if (
                  routes[i].views[j].views[k].layout.concat(
                    routes[i].views[j].views[k].path
                  ) == location.pathname
                ) {
                  return routes[i].views[j].views[k][`name_${i18n.language}`];
                }
              }
            }
          }
        }
      }
    }
    return activeRoute;
  };


  return (
    <div className={mainPanelClasses} ref={mainPanel}>
      <AppBar className={classes.appBar} color="default">
        <Toolbar>
          <Hidden smDown implementation='css'>
            <div className={sidebarMinimize}>
              {propsMiniActive ? (
                <IconButton onClick={sidebarMinimizeFunc} className={classes.justIcon}>
                  <ViewList className={classes.sidebarMiniIcon} />
                </IconButton>
              ) : (
                <IconButton onClick={sidebarMinimizeFunc} className={classes.justIcon}>
                  <MoreVert className={classes.sidebarMiniIcon} />
                </IconButton>
              )}
            </div>
          </Hidden>
          <div className={classes.flex}>
            <Button href='' className={classes.title}>
              {getActiveRoute(routes)}
            </Button>
          </div>
          <Hidden smDown implementation='css'>
            <NavbarLinks {...props} />
          </Hidden>

          <Hidden mdUp implementation='css'>
            <IconButton onClick={handleDrawerToggle}>
              <Menu />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
    </div>
  );
}
NavbarMain.propTypes = {
  propsMiniActive: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  sidebarMinimizeFunc: PropTypes.func.isRequired
};
