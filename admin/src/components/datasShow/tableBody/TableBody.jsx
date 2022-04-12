import {forwardRef, Fragment} from 'react'
import tableBodyStyles from './table-body-styles'

import PropTypes from 'prop-types';

const TableBody = forwardRef((props, ref) =>{
const classes = tableBodyStyles();
return(
  <Fragment ref={ref}>
    this is Table body
  </Fragment>
)
})

TableBody.propTypes = {
  // t: PropTypes.func.isRequired,
};

export default TableBody;
