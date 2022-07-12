import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import rolesHook from './rolesHook';
import { useSelector } from 'react-redux';
import DataShow from '../../datasShow/DataShow';
import useDeleteAlert from '../../Hooks/useDeleteAlert';
import useDataHeaders from '../../Hooks/useDataHeaders';
import {
  createUrl,
  dataGridColumns,
  editUrl,
  rolesFields,
  deleteUrl,
} from './rolesStatic';
import useButtonActivation from '../../Hooks/useButtonActivation';

export default function Roles(props){
  const { t } = useTranslation('roles');
  const { reactRoutes } = props;
  const { requestSearch, searchText, rows: roles, exportCsv } = rolesHook();
  const { Roles } = useSelector((state) => state);
  const { dataArrayLengh, pageNumber, SortBy, CardView, PerPage, GridView } =
    Roles;
  
  const rolesRoute = reactRoutes.filter(a => a.componentName == 'RbacData')[0]
  
  const { deleteButtonDisabled, createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(rolesRoute);
  const sweetDeleteAlert = useDeleteAlert({
    state: Roles,
    modelName: 'Roles',
    t: t,
    deleteUrl: deleteUrl,
    dispatchType: 'ROLES',
  });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: Roles,
    dispatchType: 'ROLES',
    cookieName: 'roles',
  });


  return(
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
      <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={rolesFields}
          state={Roles}
          createUrl={createUrl}
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={roles}
          Icon
          modelName='Roles'
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
  )
}