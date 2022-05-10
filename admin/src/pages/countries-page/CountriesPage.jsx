import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import PropTypes from 'prop-types';
import Countries from '../../components/geoLocations/Countries/Countries';
import Country from '../../components/geoLocations/Country/Country';

export default function CountriesPage(props) {
  const location = useLocation();

  let query = useQuery();
  let { search } = location;
  return (
    <Fragment>
      {search !== '' ? (
        <Country country_id={query.get('country_id')} {...props} />
      ) : (
        <Countries {...props} />
      )}
    </Fragment>
  );
}

CountriesPage.propTypes = {
  componentView: PropTypes.string.isRequired,
};
