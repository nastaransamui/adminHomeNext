import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import usersHook from './usersHook';
import { useSelector } from 'react-redux';
import DataShow from '../datasShow/DataShow';

import { createUrl, dataGridColumns, editUrl, userFields } from './usersStatic';

export default function Users(props) {
  const { t } = useTranslation('users');

  const {
    sweetAlert,
    requestSearch,
    searchText,
    rows: users,
    alertCall,
    paginationChange,
    perPageFunc,
    sortByFunc,
    exportCsv,
    cardViewsFunc,
    gridNumberFunc,
  } = usersHook();
  const { Users } = useSelector((state) => state);
  const {
    totalUsers,
    usersPageNumber,
    usersSortBy,
    usersCardView,
    usersPerPage,
    usersGrid,
  } = Users;

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
          dataGridColumns={dataGridColumns}
          gridNumberFunc={gridNumberFunc}
          gridNumber={usersGrid}
          paginationChange={paginationChange}
          perPageFunc={perPageFunc}
          sortByFunc={sortByFunc}
          sortByValues={usersSortBy}
          exportCsv={exportCsv}
          cardHeaderType={{
            icon: true,
            image: false,
          }}
          cardAvatarType={{
            profile: true,
            plain: false,
          }}
          cardViewsFunc={cardViewsFunc}
        />
      </Fragment>
    </Container>
  );
}
