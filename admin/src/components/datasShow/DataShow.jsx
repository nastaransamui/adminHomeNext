import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Main from './cardsView/Main';
import MainHeader from './headerView/MainHeader';
import TableBody from './tableView/TableBody';

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
      <MainHeader {...props} />
      <BodyBox maxWidth='xl'>
        {cardView ? <Main {...props} /> : <TableBody {...props} />}
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
  deleteAlert: PropTypes.func,
  activeAlert: PropTypes.func,
  diactiveAlert: PropTypes.func,
  dataGridColumns: PropTypes.array.isRequired,
  paginationChange: PropTypes.func.isRequired,
  perPageFunc: PropTypes.func.isRequired,
  sortByFunc: PropTypes.func.isRequired,
  sortByValues: PropTypes.object.isRequired,
  exportCsv: PropTypes.func,
  movie: PropTypes.bool,
  cardHeaderType: PropTypes.object.isRequired,
  cardAvatarType: PropTypes.object.isRequired,
  cardViewsFunc: PropTypes.func.isRequired,
  gridNumberFunc: PropTypes.func.isRequired,
  gridNumber: PropTypes.number.isRequired,
  activesId: PropTypes.array,
};

export default DataShow;
