import { useEffect,useMemo } from 'react';
import { Switch, Route, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import NotFound from './NotFound';
import MainDashboard from '../../components/mainDashboard/MainDashboard';
import ThemeUser from '../../components/ThemeUser/ThemeUser';
import { useRouter } from 'next/router';
import Users from '../user-page/Users';
import User from '../../components/Users/User';

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
  let {pathname, search} = location;

  let fullPath = query.toString().length == 0 ? pathname : pathname
  // //Mix pathname with search param and remove the '=' and '?' sign
  // pathname.concat('/', search.replace('?', '')).substring(0, pathname.concat('/', search.replace('?', '')).indexOf('='))

  // console.log(pathname)
  // console.log(pathname.concat('/', search.replace('?', '')).substring(0, pathname.concat('/', search.replace('?', '')).indexOf('=')))
  let showErrorPage = !reactPath.includes(fullPath);
  useEffect(() => {
    if (showErrorPage) history.push('/admin/dashboard/notfoundpage');
  }, [router,  location,query, showErrorPage, search]);
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
          <Users {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/user-page/user'>
          <User {...props} />
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/pricing-page'>
          The Price test page
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/regular-forms'>
          Tforms
          <ThemeUser {...props} />
        </Route>
        <Route exact path='/admin/dashboard/buttons'>
          buttons multi
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
