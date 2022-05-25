import {
  Collapse,
  Icon,
  List,
  ListItemText,
  ListItem,
  useMediaQuery,
} from '@mui/material';
import { useEffect } from 'react';
import cx from 'classnames';
import linkStyle from './links-style';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';

const createClasses = (
  classes,
  getCollapseInitialState,
  route,
  propsMiniActive,
  stateMiniActive,
  rtlActive,
  activeRoute,
  color
) => {
  const navLinkClasses =
    classes.itemLink +
    ' ' +
    cx({
      [' ' + classes.collapseActive]:
        route.views !== undefined && getCollapseInitialState(route.views),
    });
  const itemText =
    classes.itemText +
    ' ' +
    cx({
      [classes.itemTextMini]: !propsMiniActive && stateMiniActive,
      [classes.itemTextMiniRTL]:
        rtlActive && !propsMiniActive && stateMiniActive,
      [classes.itemTextRTL]: rtlActive,
    });

  const collapseItemText =
    classes.collapseItemText +
    ' ' +
    cx({
      [classes.collapseItemTextMini]: !propsMiniActive && stateMiniActive,
      [classes.collapseItemTextMiniRTL]:
        rtlActive && !propsMiniActive && stateMiniActive,
      [classes.collapseItemTextRTL]: rtlActive,
    });

  const itemIcon =
    classes.itemIcon + ' ' + cx({ [classes.itemIconRTL]: rtlActive });
  const caret = classes.caret + ' ' + cx({ [classes.caretRTL]: rtlActive });
  const collapseItemMini =
    classes.collapseItemMini +
    ' ' +
    cx({ [classes.collapseItemMiniRTL]: rtlActive });

  const innerNavLinkClasses =
    classes.collapseItemLink +
    ' ' +
    cx({ [' ' + classes[color]]: activeRoute(route.path) });

  return {
    navLinkClasses,
    itemText,
    collapseItemText,
    itemIcon,
    caret,
    collapseItemMini,
    innerNavLinkClasses,
  };
};

export default function SidebarLinks(props) {
  const {
    routes,
    state,
    propsMiniActive,
    stateMiniActive,
    setState,
    i18n,
    router,
    color,
    rtlActive,
    handleDrawerToggle,
    getCollapseInitialState,
  } = props;
  const classes = linkStyle();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname == router.basePath + routeName;
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      // handle open sidebar
      let nst = {};
      routes.map((route, index) => {
        if (route?.collapse) {
          if (location.pathname == route.layout + route.path) {
            //First layer collapse
            nst[route['state']] = true;
            setState((oldState) => ({ ...oldState, ...nst }));
          } else {
            for (let i = 0; i < route.views.length; i++) {
              const element = route.views[i];
              if (element.collapse) {
                for (let j = 0; j < element.views.length; j++) {
                  const elem = element.views[j];
                  if (location.pathname == elem.layout + elem.path) {
                    nst[route['state']] = true;
                    nst[element['state']] = true;
                    nst[elem['state']] = true;
                    setState((oldState) => ({ ...oldState, ...nst }));
                  }
                }
              } else {
                //Second layer not collapse(about)
                if (location.pathname == element.layout + element.path) {
                  nst[route['state']] = true;
                  setState((oldState) => ({ ...oldState, ...nst }));
                }
              }
            }
          }
        }
      });
    }
    return () => {
      isMount = false;
    };
  }, []);

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.collapse) {
        var st = {};
        const navLinkClasses =
          classes.itemLink +
          ' ' +
          cx({
            [' ' + classes.collapseActive]: getCollapseInitialState(
              route.views
            ),
          });
        const itemText =
          classes.itemText +
          ' ' +
          cx({
            [classes.itemTextMini]: !propsMiniActive && stateMiniActive,
            [classes.itemTextMiniRTL]:
              rtlActive && !propsMiniActive && stateMiniActive,
            [classes.itemTextRTL]: rtlActive,
          });

        const collapseItemText =
          classes.collapseItemText +
          ' ' +
          cx({
            [classes.collapseItemTextMini]: !propsMiniActive && stateMiniActive,
            [classes.collapseItemTextMiniRTL]:
              rtlActive && !propsMiniActive && stateMiniActive,
            [classes.collapseItemTextRTL]: rtlActive,
          });
        const itemIcon =
          classes.itemIcon +
          ' ' +
          cx({
            [classes.itemIconRTL]: rtlActive,
          });
        const caret =
          classes.caret +
          ' ' +
          cx({
            [classes.caretRTL]: rtlActive,
          });
        const collapseItemMini =
          classes.collapseItemMini +
          ' ' +
          cx({
            [classes.collapseItemMiniRTL]: rtlActive,
          });
        st[route['state']] = !state[route.state];

        return (
          <ListItem
            key={index}
            className={cx(
              { [classes.item]: route.icon !== undefined },
              { [classes.collapseItem]: route.icon === undefined }
            )}>
            <a
              href='#'
              className={navLinkClasses}
              onClick={(e) => {
                e.preventDefault();
                setState((oldState) => ({ ...oldState, ...st }));
              }}>
              {route.icon !== undefined ? (
                typeof route.icon == 'string' ? (
                  <Icon className={itemIcon}>{route.icon}</Icon>
                ) : (
                  <route.icon
                    className={itemIcon}
                    style={{
                      position: rtlActive ? 'absolute' : 'unset',
                      right: rtlActive ? -18 : 0,
                      top: rtlActive ? 15 : 0,
                    }}
                  />
                )
              ) : (
                <span
                  className={collapseItemMini}
                  style={{
                    display:
                      (rtlActive && propsMiniActive) || !stateMiniActive
                        ? 'none'
                        : 'block',
                  }}>
                  {isMobile ? '\xa0' : route[`mini_${i18n.language}`]}
                </span>
              )}
              <ListItemText
                primary={route[`name_${i18n.language}`]}
                secondary={
                  <b
                    style={{
                      marginRight: rtlActive ? 181 : 0,
                    }}
                    className={
                      caret +
                      ' ' +
                      (state[route.state] ? classes.caretActive : '')
                    }
                  />
                }
                disableTypography={true}
                style={{
                  marginLeft: rtlActive ? 128 : 0,
                }}
                className={cx(
                  { [itemText]: route.icon !== undefined },
                  { [collapseItemText]: route.icon === undefined }
                )}
              />
            </a>
            <Collapse in={state[route.state]} unmountOnExit>
              <List className={classes.list + ' ' + classes.collapseList}>
                {createLinks(route.views)}
              </List>
            </Collapse>
          </ListItem>
        );
      }

      const innerNavLinkClasses =
        classes.collapseItemLink +
        ' ' +
        cx({
          [' ' + classes[color]]: activeRoute(route.path),
        });

      const collapseItemMini =
        classes.collapseItemMini +
        ' ' +
        cx({
          [classes.collapseItemMiniRTL]: rtlActive,
        });
      const navLinkClasses =
        classes.itemLink +
        ' ' +
        cx({
          [' ' + classes[color]]: activeRoute(route.path),
        });
      const itemText =
        classes.itemText +
        ' ' +
        cx({
          [classes.itemTextMini]: !propsMiniActive && stateMiniActive,
          [classes.itemTextMiniRTL]:
            rtlActive && !propsMiniActive && stateMiniActive,
          [classes.itemTextRTL]: rtlActive,
        });
      const collapseItemText =
        classes.collapseItemText +
        ' ' +
        cx({
          [classes.collapseItemTextMini]: !propsMiniActive && stateMiniActive,
          [classes.collapseItemTextMiniRTL]:
            rtlActive && propsMiniActive && stateMiniActive,
          [classes.collapseItemTextRTL]: rtlActive,
        });
      const itemIcon =
        classes.itemIcon +
        ' ' +
        cx({
          [classes.itemIconRTL]: rtlActive,
        });
      return (
        <ListItem
          key={index}
          className={cx(
            { [classes.item]: route.icon !== undefined },
            { [classes.collapseItem]: route.icon === undefined }
          )}>
          <Link
            to={route.layout + route.path}
            onClick={() => {
              isMobile && handleDrawerToggle();
              router.asPath = route.layout + route.path;
            }}>
            <span
              className={cx(
                { [navLinkClasses]: route.icon !== undefined },
                { [innerNavLinkClasses]: route.icon === undefined }
              )}>
              {route.icon !== undefined ? (
                typeof route.icon === 'string' ? (
                  <Icon className={itemIcon}>{route.icon}</Icon>
                ) : (
                  <route.icon
                    className={itemIcon}
                    style={{
                      position: rtlActive ? 'absolute' : 'unset',
                      right: rtlActive ? -18 : 0,
                      top: rtlActive ? 15 : 0,
                    }}
                  />
                )
              ) : (
                <span
                  className={collapseItemMini}
                  style={{
                    display:
                      (rtlActive && propsMiniActive) || !stateMiniActive
                        ? 'none'
                        : 'block',
                  }}>
                  {isMobile ? '\xa0' : route[`mini_${i18n.language}`]}
                </span>
              )}
              <ListItemText
                primary={route[`name_${i18n.language}`]}
                disableTypography={true}
                style={{ textAlign: rtlActive ? 'right' : 'left' }}
                className={cx(
                  { [itemText]: route.icon !== undefined },
                  { [collapseItemText]: route.icon === undefined }
                )}
              />
            </span>
          </Link>
        </ListItem>
      );
    });
  };

  return <List className={classes.list}>{createLinks(routes)}</List>;
}

SidebarLinks.propTypes = {
  routes: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  propsMiniActive: PropTypes.bool.isRequired,
  stateMiniActive: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  rtlActive: PropTypes.bool.isRequired,
};
