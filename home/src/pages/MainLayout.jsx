import { Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import FooterWithDeco from '../components/Footer/FooterWithDeco';

const Mainlayout = (props) => {
  const { children, router } = props;
  return (
    <Fragment>
      <Header {...props} />
      {children}
      {router.route == '/404' ? (
        <Footer {...props} />
      ) : (
        <FooterWithDeco {...props} />
      )}
    </Fragment>
  );
};

export default Mainlayout;
