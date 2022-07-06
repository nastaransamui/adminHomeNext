import PropTypes from 'prop-types';

import { TablePagination as MuiPagination } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TablePaginationActions from './TablePaginationActions';

const TablePagination = (props) => {
  const { t } = useTranslation('common');
  const {
    total,
    rowsPerPage,
    pageNumber,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;
  return (
    <MuiPagination
      rowsPerPageOptions={[5, 10, 25]}
      labelRowsPerPage={t('rowsPerPage')}
      labelDisplayedRows={({ from, to, count, page }) => {
        return `page: ${page}  ${from}–${to} ${t('of')}  ${
          count !== -1 ? count : `more than ${to}`
        }`;
      }}
      component='div'
      count={total}
      rowsPerPage={rowsPerPage}
      page={pageNumber}
      SelectProps={{
        inputProps: {
          'aria-label': 'rows per page',
        },
        native: true,
      }}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  );
};

TablePagination.propTypes = {
  total: PropTypes.number.isRequired,
  rowsPerPage:  PropTypes.number.isRequired,
  pageNumber:  PropTypes.number.isRequired,
  handleChangePage:  PropTypes.func.isRequired,
  handleChangeRowsPerPage:  PropTypes.func.isRequired,
};

export default TablePagination;
