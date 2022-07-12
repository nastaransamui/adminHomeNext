import { useLocation } from 'react-router-dom';
import NavbarMain from '../Navbar/NavbarMain';
import SidebarMain from '../SideBar/SidebarMain';
import dashboardStyle from './dashboar-style';
import cx from 'classnames';
import ReactRouter from '../../pages/dashboard/ReactRouter';
import Footer from '../Footer/Footer';
import LoadingOverlay from 'react-loading-overlay';
import { CircleToBlockLoading } from 'react-loadingg';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';
// import routes from '../../../routes'
export default function ProDashboard(props) {
  const {
    t,
    i18n,
    color,
    propsMiniActive,
    routes,
    handleDrawerToggle,
    sidebarMinimizeFunc,
    accessRole,
    reactRoutes,
  } = props;
  const location = useLocation();
  const { adminFormSubmit } = useSelector((state) => state);
  const rtlActive = i18n.language == 'fa';
  const classes = dashboardStyle();
  const theme = useTheme();
  const mainPageMinimize =
    classes.mainPageMinimize +
    ' ' +
    cx({
      [classes.mainPageHandlemainOpen]: propsMiniActive,
      [classes.mainPageHandlemainClose]: !propsMiniActive,
    });
  var copyRoutes = JSON.parse(JSON.stringify(routes));
  var copyAccessRole = JSON.parse(JSON.stringify(accessRole));
  const activeNamesArray = [];
  copyAccessRole.map(function iter(b) {
    let cruds = [...b.crud];
    let readStatus = cruds[cruds.findIndex((obj) => obj.name == 'read')].active;
    if (readStatus) {
      activeNamesArray.push(b[`name_${i18n.language}`]);
    }
    Array.isArray(b.views) && b.views.map(iter);
  });
  let filter = copyRoutes.filter(function f(a) {
    if (activeNamesArray.indexOf(a[`name_${i18n.language}`]) !== -1) {
      Array.isArray(a.views) && (a.views = a.views.filter(f));
      return a;
    }
    Array.isArray(a.views) && (a.views = a.views.filter(f));
  });
  filter.unshift(routes[0]);
  return (
    <>
      <div>
        <SidebarMain {...props} rtlActive={rtlActive} routes={filter} />
        <NavbarMain
          {...props}
          propsMiniActive={propsMiniActive}
          color={color}
          location={location}
          i18n={i18n}
          routes={filter}
          handleDrawerToggle={handleDrawerToggle}
          sidebarMinimizeFunc={sidebarMinimizeFunc}
        />
      </div>
      <span
        style={{
          display: 'flex',
          width: '100%',
          marginTop: 100,
          minHeight: '70vh',
        }}
        className={mainPageMinimize}>
        <LoadingOverlay
          styles={{
            overlay: (base) => ({
              ...base,
              position: 'fixed',
            }),
          }}
          active={adminFormSubmit}
          spinner={
            <CircleToBlockLoading color={theme.palette.secondary.main} />
          }
        />
        <ReactRouter rtlActive={rtlActive} {...props} />
      </span>

      <span
        className={mainPageMinimize}
        style={{
          display: 'flex',
          width: '100%',
        }}>
        <Footer />
      </span>
    </>
  );
}
