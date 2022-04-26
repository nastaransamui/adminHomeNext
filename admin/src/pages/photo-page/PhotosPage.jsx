import { Fragment} from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';

import Photo from '../../components/mainPageSetup/Photo/Photo';
import Photos from '../../components/mainPageSetup/Photos/Photos';

export default function PhotosPage(props) {
  const location = useLocation();
  
 
  let query = useQuery();
  let { search } = location;

  return (
    <Fragment>
      {search !== '' ? (
        <Photo _id={query.get('_id')} {...props} />
      ) : (
        <Photos {...props} />
      )}
    </Fragment>
  );
}