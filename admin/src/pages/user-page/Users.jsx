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
                    search: `?_id=624660c599af420025020f39`,
                  });
                }}>Edit user 624a8d80ae8407986a9fbc28</button>
                <button onClick={(e) => {
                  e.preventDefault();
                  history.push({
                    pathname: '/admin/dashboard/user-page',
                    search: `?_id=624a8d80ae8407986a9fbc28`,
                  });
                }}>Edit user is vercel 62467721629f891c9645ae6d</button>
                <button onClick={(e) => {
                  e.preventDefault();
                  history.push({
                    pathname: '/admin/dashboard/user-page',
                    search: `?_id=shit`,
                  });
                }}>shit</button>
        </div>
      )}
    </Fragment>
  );
}
