import { useEffect, useMemo } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import NotFound from './NotFound';
import MainDashboard from '../../components/mainDashboard/MainDashboard';
import ThemeUser from '../../components/ThemeUser/ThemeUser';
import { useRouter } from 'next/router';
import UsersPage from '../user-page/UsersPage';
import User from '../../components/User/User';
import VideosPage from '../video-page/VideosPage';
import Video from '../../components/mainPageSetup/Video/Video';
import PhotosPage from '../photo-page/PhotosPage';
import Photo from '../../components/mainPageSetup/Photo/Photo';
import FeaturePage from '../feature-page/FeaturePage';
import Feature from '../../components/mainPageSetup/Feature/Feature';
import About from '../../components/mainPageSetup/About/About';
import CountriesPage from '../countries-page/CountriesPage';
import Country from '../../components/geoLocations/Country/Country';
import ProvincesPage from '../provinces-page/ProvincesPage';
import Province from '../../components/geoLocations/Province/Province';
import CitiesPage from '../cities-page/CitiesPage';
import City from '../../components/geoLocations/City/City';
import CurrencyPage from '../currency-page/CurrencyPage';
import Currency from '../../components/exchange/Currency/Currency';

export function NotFoundPage() {
  return null;
}

export function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function CustomSwitch(props) {
  const { children } = props;
  const history = useHistory();
  const router = useRouter();
  let reactPath = [];
  // get all registerd path from react router without id's
  if (Object.keys(children.props).length !== 0) {
    for (let index = 0; index < children.props.children.length; index++) {
      const element = children.props.children[index];
      let paths = element.props.path;
      if (paths.indexOf('=') !== -1) {
        paths = paths.substring(0, paths.indexOf('='));
      }
      reactPath.push(paths);
    }
  }

  const location = useLocation();
  let query = useQuery();
  // check if current path has query or not and compare with react Route
  let { pathname, search } = location;

  let fullPath = query.toString().length == 0 ? pathname : pathname;
  // //Mix pathname with search param and remove the '=' and '?' sign
  // pathname.concat('/', search.replace('?', '')).substring(0, pathname.concat('/', search.replace('?', '')).indexOf('='))

  // console.log(pathname)
  // console.log(pathname.concat('/', search.replace('?', '')).substring(0, pathname.concat('/', search.replace('?', '')).indexOf('=')))
  let showErrorPage = !reactPath.includes(fullPath);
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
  return (
    <CustomSwitch>
      <>
        <Route exact path='/admin/dashboard'>
          <MainDashboard {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/user-page'>
          <UsersPage {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/user-page/user'>
          <User {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/main-page-setup/videos'>
          <VideosPage {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/main-page-setup/videos/video'>
          <Video {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/main-page-setup/photos'>
          <PhotosPage {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/main-page-setup/photos/photo'>
          <Photo {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/main-page-setup/features'>
          <FeaturePage {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/main-page-setup/features/feature'>
          <Feature {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/main-page-setup/about'>
          <About {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/g-locations/countries'>
          <CountriesPage {...props} componentView='global_countries' />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/a-locations/countries'>
          <CountriesPage {...props} componentView='active' />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/a-locations/countries/country'>
          <Country {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/a-locations/provinces'>
          <ProvincesPage {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/a-locations/provinces/province'>
          <Province {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/a-locations/cities'>
          <CitiesPage {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/a-locations/cities/city'>
          <City {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/g-currencies/currencies'>
          <CurrencyPage {...props} componentView='global_currencies' />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/a-currencies/currencies'>
          <CurrencyPage {...props} componentView='active' />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/a-currencies/currencies/currency'>
          <Currency {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route path='/admin/dashboard/notfoundpage'>
          <NotFound {...props} />
          <ThemeUser {...props} />
        </Route>
      </>
    </CustomSwitch>
  );
}
