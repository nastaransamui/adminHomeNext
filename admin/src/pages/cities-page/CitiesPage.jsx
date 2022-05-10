import { Fragment} from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import Cities from '../../components/geoLocations/Cities/Cities';
import City from '../../components/geoLocations/City/City';

export default function CitiesPage(props) {
  const location = useLocation();
  
 
  let query = useQuery();
  let { search } = location;

  return (
    <Fragment>
      {search !== '' ? (
        <City city_id={query.get('city_id')} {...props} />
      ) : (
        <Cities {...props} />
      )}
    </Fragment>
  );
}
