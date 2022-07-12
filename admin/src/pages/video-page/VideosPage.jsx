import { Fragment, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import { useHistory } from 'react-router-dom';
import Video from '../../components/mainPageSetup/Video/Video';
import Videos from '../../components/mainPageSetup/Videos/Videos';

export default function VideosPage(props) {
  const location = useLocation();
  const history = useHistory();
  const {reactRoutes} =props;
  const videosRoute = reactRoutes.filter((a) => a.componentName == 'Videos')[0];
  let query = useQuery();
  let { search } = location;

  useEffect(() => {
    let isMount = true;
    if(isMount){
      if(search !== '' && !videosRoute?.crud[3].active){
        history.push('/admin/dashboard')
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);
  return (
    <Fragment>
      {search !== '' ? (
        <Video _id={query.get('_id')} {...props} />
      ) : (
        <Videos {...props} />
      )}
    </Fragment>
  );
}