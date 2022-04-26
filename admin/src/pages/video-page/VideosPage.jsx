import { Fragment} from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';

import Video from '../../components/mainPageSetup/Video/Video';
import Videos from '../../components/mainPageSetup/Videos/Videos';

export default function VideosPage(props) {
  const location = useLocation();
  
 
  let query = useQuery();
  let { search } = location;

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