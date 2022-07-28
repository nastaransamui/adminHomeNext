import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import hotelHook from './hotelHook';

const Hotel = (props)=>{
  const {reactRoutes} = props

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        add Hotel
      </Fragment>
    </Container>
  )
}

export default Hotel