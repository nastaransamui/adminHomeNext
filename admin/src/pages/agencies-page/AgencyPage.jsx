import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import Agency from '../../components/Clients/Agency/Agency';
import Agencies from '../../components/Clients/Agencies/Agencies';

export default function AgencyPage(props) {
  const location = useLocation();

  let query = useQuery();
  let { search } = location;
  return (
    <Fragment>
      {search !== '' ? (
        <Agency client_id={query.get('client_id')} {...props} />
      ) : (
        <Agencies {...props} />
      )}
    </Fragment>
  );
}

