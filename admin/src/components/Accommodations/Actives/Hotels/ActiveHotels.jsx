import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import activeHotelsHook from './activeHotelsHook';

const ActiveHotels = (props)=>{
  const {reactRoutes} = props

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        Active Hotels
      </Fragment>
    </Container>
  )
}

export default ActiveHotels