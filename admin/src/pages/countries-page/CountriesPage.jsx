import { Fragment } from 'react';
import PropTypes from 'prop-types';
import Countries from '../../components/geoLocations/Countries/Countries';

export default function CountriesPage(props) {
  return <Countries {...props} />;
}

CountriesPage.propTypes = {
  componentView: PropTypes.string.isRequired,
};
