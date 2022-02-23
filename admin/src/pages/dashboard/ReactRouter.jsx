import { useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';
import NotFound from './NotFound';
import MainDashboard from '../../components/mainDashboard/MainDashboard';
import ThemeUser from '../../components/ThemeUser/ThemeUser';
import { useRouter } from 'next/router';


export function NotFoundPage() {
  return null;
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
  // get current route with out id from next router
  let currentPath = `${router.basePath}${router.route}`;
  const location = useLocation();
  //If current route is not valid push to notfoundpage
  let showErrorPage = !reactPath.includes(location.pathname);

  useEffect(() => {
    if (showErrorPage) history.push('/notfoundpage');
  }, [router, location]);
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
        <Route path='/notfoundpage'>
          <NotFound {...props} />
          <ThemeUser {...props} />
        </Route>
      </>
    </CustomSwitch>
  );
}
