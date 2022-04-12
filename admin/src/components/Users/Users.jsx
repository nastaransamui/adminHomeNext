import { Fragment } from 'react';

import { Container, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import useAllUsersHook from '../Hooks/useAllUsersHook';
import { CircleToBlockLoading } from 'react-loadingg';
import { useSelector } from 'react-redux';
import DataShow from '../datasShow/DataShow';
import { useTheme } from '@mui/styles';

import { createUrl, editUrl, userFields } from './usersStatic';

export default function Users(props) {
  const { t } = useTranslation('users');
  const theme = useTheme();

  const {
    loading,
    sweetAlert,
    requestSearch,
    searchText,
    rows: users,
  } = useAllUsersHook();

  const { totalUsers, usersPerPage, usersPageNumber, usersCardView } =
    useSelector((state) => state);

    

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      {users.length == 0 && loading ? (
        <Grid container spacing={2}>
          <CircleToBlockLoading color={theme.palette.secondary.main} />
        </Grid>
      ) : (
        <Fragment>
          <DataShow
            {...props}
            t={t}
            requestSearch={requestSearch}
            searchText={searchText}
            dataFields={userFields}
            createUrl={createUrl}
            editUrl={editUrl}
            cardView={usersCardView}
            pageNumber={usersPageNumber}
            total={totalUsers}
            perPage={usersPerPage}
            mainData={users}
            profile
            modelName='Users'
            deleteAlert={sweetAlert}
          />
        </Fragment>
      )}
    </Container>
  );
}
