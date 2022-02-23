import { Drawer, Hidden } from '@mui/material';
import { createRef, useState } from 'react';
import mainStyles from './main-style';
import BrandLogo from './BrandLogo';
import cx from 'classnames';
import SidebarWraper from './SidebarWraper';
import SidebarUser from './SidebarUser';
import SidebarLinks from './SidebarLinks';
import NavbarLinks from '../Navbar/NavbarLinks';

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
  } = props;
  const classes = mainStyles();

  const [state, setState] = useState({
    stateMiniActive: true,
    openAvatar: false,
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
                rtlActive={rtlActive}
                openAvatar={state.openAvatar}
                openCollapse={openCollapse}
                stateMiniActive={state.stateMiniActive}
                propsMiniActive={propsMiniActive}
                bgColor={bgColor}
                t={t}
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
              />
            }
            headerLinks={<NavbarLinks {...props} />}
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
                rtlActive={rtlActive}
                openAvatar={state.openAvatar}
                openCollapse={openCollapse}
                stateMiniActive={state.stateMiniActive}
                propsMiniActive={propsMiniActive}
                bgColor={bgColor}
                t={t}
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
