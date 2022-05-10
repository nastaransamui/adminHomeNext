import { Fragment} from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import Provinces from '../../components/geoLocations/Provinces/Provinces';
import Province from '../../components/geoLocations/Province/Province';

export default function ProvincesPage(props) {
  const location = useLocation();
  
 
  let query = useQuery();
  let { search } = location;

  return (
    <Fragment>
      {search !== '' ? (
        <Province state_id={query.get('state_id')} {...props} />
      ) : (
        <Provinces {...props} />
      )}
    </Fragment>
  );
}
