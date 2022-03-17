import { useLocation } from 'react-router-dom';
import NavbarMain from '../Navbar/NavbarMain';
import SidebarMain from '../SideBar/SidebarMain';
import dashboardStyle from './dashboar-style';
import cx from 'classnames';
import ReactRouter from '../../pages/dashboard/ReactRouter';
import Footer from '../Footer/Footer';

export default function ProDashboard(props) {
  const {
    t,
    i18n,
    color,
    propsMiniActive,
    routes,
    handleDrawerToggle,
    sidebarMinimizeFunc,
  } = props;
  const location = useLocation();
  const rtlActive = i18n.language == 'fa';
  const classes = dashboardStyle();

  const mainPageMinimize =
    classes.mainPageMinimize +
    ' ' +
    cx({
      [classes.mainPageHandlemainOpen]: propsMiniActive,
      [classes.mainPageHandlemainClose]: !propsMiniActive,
    });

  return (
    <>
      <div>
        <SidebarMain {...props} rtlActive={rtlActive} />
        <NavbarMain
          {...props}
          propsMiniActive={propsMiniActive}
          color={color}
          location={location}
          i18n={i18n}
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          sidebarMinimizeFunc={sidebarMinimizeFunc}
        />
      </div>
      <span
        style={{
          display: 'flex',
          width: '100%',
          marginTop: 100,
          minHeight: "70vh"
        }}
        className={mainPageMinimize}>
        <ReactRouter {...props}/>
      </span>

      <span className={mainPageMinimize} style={{
          display: 'flex',
          width: '100%',
        }}><Footer /></span>
    </>
  );
}
