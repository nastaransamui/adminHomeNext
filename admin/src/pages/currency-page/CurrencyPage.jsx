import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';
import PropTypes from 'prop-types';
import Currencies from '../../components/exchange/Currencies/Currencies';
import Currency from '../../components/exchange/Currency/Currency';

export default function CurrencyPage(props) {
  const location = useLocation();

  let query = useQuery();
  let { search } = location;
  return (
    <Fragment>
      {search !== '' ? (
        <Currency currency_id={query.get('currency_id')} {...props} />
      ) : (
        <Currencies {...props} />
      )}
    </Fragment>
  );
}

CurrencyPage.propTypes = {
  componentView: PropTypes.string.isRequired,
};
