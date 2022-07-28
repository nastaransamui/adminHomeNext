import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import PropTypes from 'prop-types';
import Hotels from '../../components/Accommodations/All/Hotels/Hotels';

export default function AccommodationsPage(props) {
  const location = useLocation();
  let query = useQuery();
  let { search } = location;
  return (
    <Fragment>
      <Hotels {...props} />
    </Fragment>
  );
}


