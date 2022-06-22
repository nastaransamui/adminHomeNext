import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import Role from '../../components/Rbac/Role/Role';
import Roles from '../../components/Rbac/Roles/Roles';

export default function AgencyPage(props) {
  const location = useLocation();

  let query = useQuery();
  let { search } = location;
  return (
    <Fragment>
      {search !== '' ? (
        <Role role_id={query.get('role_id')} {...props} />
      ) : (
        <Roles {...props} />
      )}
    </Fragment>
  );
}

