import {
  Collapse,
  Icon,
  List,
  ListItemText,
  ListItem,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import cx from 'classnames';
import linkStyle from './links-style';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';

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
    handleDrawerToggle
  } = props;
  const classes = linkStyle();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname == router.basePath + routeName;
  };
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (router.pathname.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  };

  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop['state']] = !state[prop.state];
        const navLinkClasses =
          classes.itemLink +
          ' ' +
          cx({
            [' ' + classes.collapseActive]: getCollapseInitialState(prop.views),
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
        return (
          <ListItem
            key={key}
            className={cx(
              { [classes.item]: prop.icon !== undefined },
              { [classes.collapseItem]: prop.icon === undefined }
            )}>
            <a
              href='#'
              className={navLinkClasses}
              style={{textAlign:rtlActive ? 'right' : 'left'}}
              onClick={(e) => {
                e.preventDefault();
                setState((oldState) => ({ ...oldState, ...st }));
              }}>
              {prop.icon !== undefined ? (
                typeof prop.icon === 'string' ? (
                  <Icon className={itemIcon}>{prop.icon}</Icon>
                ) : (
                  <prop.icon className={itemIcon}  />
                )
              ) : (
                <span className={collapseItemMini}>
                  {isMobile ? '\xa0' :  prop[`mini_${i18n.language}`]}
                </span>
              )}
              <ListItemText
                primary={prop[`name_${i18n.language}`]}
                secondary={
                  <b
                  style={{marginRight: rtlActive ? -10 : 0}}
                    className={
                      caret +
                      ' ' +
                      (state[prop.state] ? classes.caretActive : '')
                    }
                  />
                }
                disableTypography={true}
                className={cx(
                  { [itemText]: prop.icon !== undefined },
                  { [collapseItemText]: prop.icon === undefined }
                )}
              />
            </a>
            <Collapse in={state[prop.state]} unmountOnExit>
              <List className={classes.list + ' ' + classes.collapseList}>
                {createLinks(prop.views)}
              </List>
            </Collapse>
          </ListItem>
        );
      }
      const innerNavLinkClasses =
        classes.collapseItemLink +
        ' ' +
        cx({
          [' ' + classes[color]]: activeRoute(prop.path),
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
          [' ' + classes[color]]: activeRoute(prop.path),
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
          key={key}
          className={cx(
            { [classes.item]: prop.icon !== undefined },
            { [classes.collapseItem]: prop.icon === undefined }
          )}>
          <Link
            to={prop.layout + prop.path}
            onClick={() => {
              isMobile && handleDrawerToggle();
              router.asPath = prop.layout + prop.path;
            }}>
            <span
              className={cx(
                { [navLinkClasses]: prop.icon !== undefined },
                { [innerNavLinkClasses]: prop.icon === undefined }
              )}>
              {prop.icon !== undefined ? (
                typeof prop.icon === 'string' ? (
                  <Icon className={itemIcon}>{prop.icon}</Icon>
                ) : (
                  <prop.icon className={itemIcon} />
                )
              ) : (
                <span className={collapseItemMini}>
                  {isMobile ? '\xa0' :  prop[`mini_${i18n.language}`]}
                </span>
              )}
              <ListItemText
                primary={prop[`name_${i18n.language}`]}
                disableTypography={true}
                style={{ textAlign: rtlActive ? 'right' : 'left'}}
                className={cx(
                  { [itemText]: prop.icon !== undefined },
                  { [collapseItemText]: prop.icon === undefined }
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
