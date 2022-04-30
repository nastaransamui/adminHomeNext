import { Fragment} from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../dashboard/ReactRouter';

import Feature from '../../components/mainPageSetup/Feature/Feature';
import Features from '../../components/mainPageSetup/Features/Features';

export default function FeaturePage(props) {
  const location = useLocation();
  
 
  let query = useQuery();
  let { search } = location;

  return (
    <Fragment>
      {search !== '' ? (
        <Feature _id={query.get('_id')} {...props} />
      ) : (
        <Features {...props} />
      )}
    </Fragment>
  );
}