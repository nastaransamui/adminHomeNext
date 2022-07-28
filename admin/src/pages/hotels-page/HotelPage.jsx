import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import ActiveHotels from '../../components/Accommodations/Actives/Hotels/ActiveHotels';
import Hotel from '../../components/Accommodations/Actives/Hotel/Hotel';

export default function AgencyPage(props) {
  const location = useLocation();

  let query = useQuery();
  let { search } = location;
  return (
    <Fragment>
      {search !== '' ? (
        <Hotel hotel_id={query.get('hotel_id')} {...props} />
      ) : (
        <ActiveHotels {...props} />
      )}
    </Fragment>
  );
}

