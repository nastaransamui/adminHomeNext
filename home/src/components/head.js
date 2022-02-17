import Head from 'next/head';
import brand from '../../public/text/brand';
import PropTypes from 'prop-types';

const HeadComponent = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='description' content={brand.desc_en} />
      </Head>
    </>
  );
};

HeadComponent.propTypes = {
  title: PropTypes.string.isRequired,
};
export default HeadComponent;
