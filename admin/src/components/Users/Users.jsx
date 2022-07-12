import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import usersHook from './usersHook';
import { useSelector } from 'react-redux';
import DataShow from '../datasShow/DataShow';

import {
  createUrl,
  dataGridColumns,
  editUrl,
  userFields,
  deleteUrl,
} from './usersStatic';
import useDeleteAlert from '../Hooks/useDeleteAlert';
import useDataHeaders from '../Hooks/useDataHeaders';
import useButtonActivation from '../Hooks/useButtonActivation';

export default function Users(props) {
  const { t } = useTranslation('users');
  const {reactRoutes} = props;
  const { requestSearch, searchText, rows: users, exportCsv } = usersHook();
  const { Users } = useSelector((state) => state);
  const { dataArrayLengh, pageNumber, SortBy, CardView, PerPage, GridView } =
    Users;
  const usersRoute = reactRoutes.filter((a)=> a.componentName == "UserPage")[0]
  const { deleteButtonDisabled, createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(usersRoute);
  const sweetDeleteAlert = useDeleteAlert({
    state: Users,
    modelName: 'Users',
    t: t,
    deleteUrl: deleteUrl,
    dispatchType: 'USERS',
  });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: Users,
    dispatchType: 'USERS',
    cookieName: 'users',
  });

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={userFields}
          state={Users}
          createUrl={createUrl}
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={users}
          profile
          modelName='Users'
          deleteAlert={sweetDeleteAlert}
          dataGridColumns={dataGridColumns}
          gridNumberFunc={gridNumberFunc}
          gridNumber={GridView}
          paginationChange={paginationChange}
          perPageFunc={perPageFunc}
          sortByFunc={sortByFunc}
          sortByValues={SortBy}
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
          deleteButtonDisabled={deleteButtonDisabled}
          createButtonDisabled={createButtonDisabled}
          updateButtonDisabled={updateButtonDisabled}
        />
      </Fragment>
    </Container>
  );
}
