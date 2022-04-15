import { Fragment } from 'react';

import { Container, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import useAllUsersHook from '../Hooks/useAllUsersHook';
import { CircleToBlockLoading } from 'react-loadingg';
import { useSelector } from 'react-redux';
import DataShow from '../datasShow/DataShow';
import { useTheme } from '@mui/styles';

import { createUrl, dataGridColumns, editUrl, userFields } from './usersStatic';

export default function Users(props) {
  const { t } = useTranslation('users');
  const theme = useTheme();

  const {
    loading,
    sweetAlert,
    requestSearch,
    searchText,
    rows: users,
    alertCall
  } = useAllUsersHook();

  const { totalUsers, usersPerPage, usersPageNumber, usersCardView } =
    useSelector((state) => state);

    

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      
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
            alertCall={alertCall}
            modelName='Users'
            deleteAlert={sweetAlert}
            loading={loading}
            dataGridColumns={dataGridColumns}
          />
        </Fragment>
    </Container>
  );
}
