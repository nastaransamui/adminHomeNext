import { Drawer, Hidden } from '@mui/material';
import { createRef, useState } from 'react';
import mainStyles from './main-style';
import BrandLogo from './BrandLogo';
import cx from 'classnames';
import SidebarWraper from './SidebarWraper';
import SidebarUser from './SidebarUser';
import SidebarLinks from './SidebarLinks';
import NavbarLinks from '../Navbar/NavbarLinks';
import {  useLocation } from 'react-router-dom';

const SidebarMain = (props) => {
  const mainPanel = createRef();
  const {
    t,
    i18n,
    open,
    rtlActive,
    handleDrawerToggle,
    bgColor,
    propsMiniActive,
    color,
    routes,
    router,
    adminAccessToken,
  } = props;
  const classes = mainStyles();
  const location = useLocation();
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

  const [state, setState] = useState({
    stateMiniActive: true,
    openAvatar: false,
    ...getCollapseStates(routes)
  });
  const drawerPaper =
    classes.drawerPaper +
    ' ' +
    cx({
      [classes.drawerPaperMini]: !propsMiniActive && state.stateMiniActive,
    });

  const sidebarWrapper =
    classes.sidebarWrapper +
    ' ' +
    cx({
      [classes.drawerPaperMini]: !propsMiniActive && state.stateMiniActive,
      [classes.sidebarWrapperWithPerfectScrollbar]: false,
    });

  const openCollapse = (collapse) => {
    var st = {};
    st[collapse] = !state[collapse];
    setState((oldState) => ({ ...oldState, ...st }));
  };

  return (
    <div ref={mainPanel}>
      <Hidden mdUp implementation='css'>
        <Drawer
          variant='temporary'
          anchor='right'
          open={open}
          classes={{
            paper: classes.drawerPaper + ' ' + classes[bgColor + 'Background'],
          }}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}>
          <BrandLogo
            stateMiniActive={state.stateMiniActive}
            propsMiniActive={propsMiniActive}
            rtlActive={rtlActive}
            bgColor={bgColor}
            i18n={i18n}
          />
          <SidebarWraper
            className={sidebarWrapper}
            user={
              <SidebarUser
                {...props}
                openAvatar={state.openAvatar}
                openCollapse={openCollapse}
                stateMiniActive={state.stateMiniActive}
                handleDrawerToggle={handleDrawerToggle}
              />
            }
            links={
              <SidebarLinks
                routes={routes}
                state={state}
                propsMiniActive={propsMiniActive}
                stateMiniActive={state.stateMiniActive}
                setState={setState}
                i18n={i18n}
                router={router}
                color={color}
                rtlActive={rtlActive}
                handleDrawerToggle={handleDrawerToggle}
                getCollapseInitialState={getCollapseInitialState}
              />
            }
            headerLinks={
              <NavbarLinks {...props} handleDrawerToggle={handleDrawerToggle} />
            }
          />
          <div
            className={classes.background}
            style={{
              backgroundImage: 'url(/admin/images/sidebar/sidebar-1.jpg)',
            }}
          />
        </Drawer>
      </Hidden>
      <Hidden smDown implementation='css'>
        <Drawer
          onMouseOver={() =>
            setState((oldState) => ({ ...oldState, stateMiniActive: false }))
          }
          onMouseOut={() =>
            setState((oldState) => ({ ...oldState, stateMiniActive: true }))
          }
          anchor={rtlActive ? 'right' : 'left'}
          variant='permanent'
          open
          classes={{
            paper: drawerPaper + ' ' + classes[bgColor + 'Background'],
          }}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}>
          <BrandLogo
            stateMiniActive={state.stateMiniActive}
            propsMiniActive={propsMiniActive}
            rtlActive={rtlActive}
            bgColor={bgColor}
            i18n={i18n}
          />
          <SidebarWraper
            className={sidebarWrapper}
            user={
              <SidebarUser
                {...props}
                openAvatar={state.openAvatar}
                openCollapse={openCollapse}
                stateMiniActive={state.stateMiniActive}
              />
            }
            links={
              <SidebarLinks
                routes={routes}
                state={state}
                propsMiniActive={propsMiniActive}
                stateMiniActive={state.stateMiniActive}
                setState={setState}
                i18n={i18n}
                router={router}
                color={color}
                rtlActive={rtlActive}
                getCollapseInitialState={getCollapseInitialState}
              />
            }
          />
          <div
            className={classes.background}
            style={{
              backgroundImage: `url(/admin/images/sidebar/sidebar-1.jpg)`,
            }}
          />
        </Drawer>
      </Hidden>
    </div>
  );
};

export default SidebarMain;
