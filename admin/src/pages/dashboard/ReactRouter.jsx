import { useEffect, useMemo, useState } from 'react';
import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom';
import NotFound from './NotFound';
import MainDashboard from '../../components/mainDashboard/MainDashboard';
import ThemeUser from '../../components/ThemeUser/ThemeUser';
import { useRouter } from 'next/router';
import UserPage from '../user-page/UsersPage';
import User from '../../components/User/User';
import Videos from '../video-page/VideosPage';
import Video from '../../components/mainPageSetup/Video/Video';
import Photos from '../photo-page/PhotosPage';
import Photo from '../../components/mainPageSetup/Photo/Photo';
import Features from '../feature-page/FeaturePage';
import Feature from '../../components/mainPageSetup/Feature/Feature';
import About from '../../components/mainPageSetup/About/About';
import Countries from '../countries-page/CountriesPage';
import Country from '../../components/geoLocations/Country/Country';
import Provinces from '../provinces-page/ProvincesPage';
import Province from '../../components/geoLocations/Province/Province';
import Cities from '../cities-page/CitiesPage';
import City from '../../components/geoLocations/City/City';
import Currencies from '../currency-page/CurrencyPage';
import Currency from '../../components/exchange/Currency/Currency';
import Clients from '../agencies-page/AgencyPage';
import Client from '../../components/Clients/Agency/Agency';
import RbacData from '../rbac-page/RbackPage';
import Role from '../../components/Rbac/Role/Role';
import Allhotels from '../accommodations-page/AccomodationsPage';
import Hotels from '../hotels-page/HotelPage';
import Hotel from '../../components/Accommodations/Actives/Hotel/Hotel';

import { useSelector } from 'react-redux';

export function NotFoundPage() {
  return null;
}

export function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function CustomSwitch(props) {
  const { children, profile } = props;
  const history = useHistory();
  const router = useRouter();
  let reactPath = [];
  // get all registerd path from react router without id's
  if (Object.keys(children.props).length !== 0) {
    //Spread between dashboard, routes and error link
    const mixAllRoutesOfReact = [];
    children.props.children.map((a, i) => {
      if (Array.isArray(a)) {
        a = a.filter(function (element) {
          return element !== undefined;
        });
        a.map((b) => {
          mixAllRoutesOfReact.push(b);
        });
      } else {
        if (a) {
          mixAllRoutesOfReact.push(a);
        }
      }
    });
    for (let index = 0; index < mixAllRoutesOfReact.length; index++) {
      const element = mixAllRoutesOfReact[index];
      if (element !== undefined) {
        let paths = element.props.path;
        if (paths.indexOf('=') !== -1) {
          paths = paths.substring(0, paths.indexOf('='));
        }
        reactPath.push(paths);
      }
    }
  }

  const location = useLocation();
  let query = useQuery();
  // check if current path has query or not and compare with react Route
  let { pathname, search } = location;
  let fullPath = query.toString().length == 0 ? pathname : pathname;
  let showErrorPage = !reactPath.includes(fullPath);
  //dont show error page if all users not active but user at profile page and refresh
  if (
    pathname == '/admin/dashboard/user-page' &&
    query.get('_id') == profile._id
  ) {
    showErrorPage = false;
  }

  useEffect(() => {
    if (showErrorPage) history.push('/admin/dashboard/notfoundpage');
  }, [router, location, query, showErrorPage, search]);
  return (
    <Switch>
      {children}
      <NotFoundPage />
    </Switch>
  );
}

export default function ReactRouter(props) {
  const { reactRoutes } = props;
  const [addUserProfile, setAddUserProfile] = useState(false);
  const [userHasUpdateAccess, setUserHasUpdateAccess] = useState(true);
  const { profile } = useSelector((state) => state);
  let query = useQuery();
  let location = useLocation();

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      const indexOfUserList = reactRoutes.findIndex((object) => {
        return object[`name_en-US`] === 'Users List';
      });
      if (indexOfUserList == -1) {
        setAddUserProfile(true);
      } else {
        const usersList = reactRoutes[indexOfUserList];
        let cruds = [...usersList.crud];
        let readStatus =
          cruds[cruds.findIndex((obj) => obj.name == 'read')].active;
        if (!readStatus) {
          setAddUserProfile(true);
        }
      }
      const indexOfCurrentRoute = reactRoutes.findIndex((obj) => {
        return obj.path == location.pathname;
      });
      if (indexOfCurrentRoute !== -1) {
        const r = reactRoutes[indexOfCurrentRoute];
        if (location.search !== '') {
          let updateStatus =
            r.crud[r.crud.findIndex((obj) => obj.name == 'update')].active;
          setUserHasUpdateAccess(updateStatus);
        } else {
          setUserHasUpdateAccess(true);
        }
      } else {
        setUserHasUpdateAccess(true);
      }
    }
    return () => {
      isMount = false;
    };
  }, [reactRoutes, location]);

  const componentsMap = useMemo(() => {
    return {
      UserPage,
      User,
      RbacData,
      Role,
      Videos,
      Video,
      Photos,
      Photo,
      Features,
      Feature,
      About,
      Countries,
      Country,
      Provinces,
      Province,
      Cities,
      City,
      Currencies,
      Currency,
      Clients,
      Client,
      Allhotels,
      Hotels,
      Hotel,
    };
  });

  return (
    <CustomSwitch profile={profile}>
      <>
        <Route exact path='/admin/dashboard' key={0}>
          <MainDashboard {...props} />
          <ThemeUser {...props} />
        </Route>
        {addUserProfile && (
          <Route key={1} exact path='/admin/dashboard/user-page'>
            {(addUserProfile && query.get('_id') == null) ||
            query.get('_id') !== profile._id ? (
              <Redirect to='/admin/dashboard' {...props} />
            ) : (
              <UserPage {...props} />
            )}
            <ThemeUser {...props} />
          </Route>
        )}
        {reactRoutes.map((r, i) => {
          const DynamicComponent = componentsMap[r.componentName];
          if (DynamicComponent !== undefined) {
            if (r.crud[0].active) {
              return (
                <Route exact path={r.path} key={i + 2}>
                  <DynamicComponent
                    {...props}
                    componentView={r.componentView}
                  />
                  <ThemeUser {...props} />
                </Route>
              );
            }
          }
        })}
        <Route
          path='/admin/dashboard/notfoundpage'
          key={reactRoutes.length + 3}>
          <NotFound {...props} />
          <ThemeUser {...props} />
        </Route>
      </>
    </CustomSwitch>
  );
}
