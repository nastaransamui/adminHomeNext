import { Fragment} from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';

import User from '../../components/User/User';
import Users from '../../components/Users/Users';

export default function UsersPage(props) {
  const location = useLocation();
 
  let query = useQuery();
  let { search } = location;

  return (
    <Fragment>
      {search !== '' ? (
        <User _id={query.get('_id')} {...props} />
      ) : (
        <Users {...props} />
      )}
    </Fragment>
  );
}
