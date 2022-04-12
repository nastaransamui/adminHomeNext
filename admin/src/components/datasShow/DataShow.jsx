import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import CardsShowBody from './cardsbody/CardsShowBody';
import CardsShowHeader from './header/CardsShowHeader';
import TableBody from './tableBody/TableBody';

import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

const BodyBox = styled(Container)(({ theme }) => ({
  border: '3px solid ',
  marginTop: 10,
  borderColor: theme.palette.secondary.main,
  borderRadius: 5,
  marginBottom: 10,
}));

const DataShow = forwardRef((props, ref) => {
  const { cardView } = props;
  return (
    <div ref={ref}>
      <CardsShowHeader {...props} />
      <BodyBox maxWidth='xl'>
        {cardView ? <CardsShowBody {...props} /> : <TableBody {...props} />}
      </BodyBox>
    </div>
  );
});

DataShow.propTypes = {
  t: PropTypes.func.isRequired,
  requestSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  dataFields: PropTypes.array.isRequired,
  createUrl: PropTypes.string.isRequired,
  editUrl: PropTypes.string.isRequired,
  cardView: PropTypes.bool.isRequired,
  pageNumber: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  mainData: PropTypes.array.isRequired,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  blog: PropTypes.bool,
  raised: PropTypes.bool,
  background: PropTypes.bool,
  pricing: PropTypes.bool,
  testimonial: PropTypes.bool,
  modelName: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  editUrl: PropTypes.string.isRequired,
  deleteAlert: PropTypes.func.isRequired
};

export default DataShow;
