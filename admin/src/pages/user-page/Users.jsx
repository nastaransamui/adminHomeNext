import React, { Fragment, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';

import User from '../../components/Users/User';

export default function UserProfile(props) {
  const location = useLocation();
  const history = useHistory();
  let query = useQuery();
  let { search } = location;

  useEffect(() => {
    let isMount = true;
    // if(isMount && search == '') history.push('/admin/dashboard')
  }, []);
  return (
    <Fragment>
      {search !== '' ? (
        //Load Single user with _id: query.get('_id')
        <User _id={query.get('_id')} {...props} />
      ) : (
        //Load all Users
        <div>All Users 
          <button onClick={(e) => {
                  e.preventDefault();
                  history.push({
                    pathname: '/admin/dashboard/user-page/user',
                  });
                }}>New user</button>
          <button onClick={(e) => {
                  e.preventDefault();
                  history.push({
                    pathname: '/admin/dashboard/user-page',
                    search: `?_id=someuser`,
                  });
                }}>Edit user</button>
        </div>
      )}
    </Fragment>
  );
}
