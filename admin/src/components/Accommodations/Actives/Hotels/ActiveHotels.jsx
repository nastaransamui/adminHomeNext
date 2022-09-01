import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import activeHotelsHook from './activeHotelsHook';
import { useSelector } from 'react-redux';
import DataShow from '../../../datasShow/DataShow';

import {
  createUrl,
  dataGridColumns,
  editUrl,
  hotelsFields,
  deleteUrl,
} from './activeHotelsStatic';
import useDataHeaders from '../../../Hooks/useDataHeaders';
import useButtonActivation from '../../../Hooks/useButtonActivation';
import useDeleteAlert from '../../../Hooks/useDeleteAlert';

const ActiveHotels = (props) => {
  const { t } = useTranslation('hotels');
  const { reactRoutes } = props;
  const HotelsRoute = reactRoutes.filter((a) => a.componentName == 'Hotels')[0];
  const { deleteButtonDisabled, createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(HotelsRoute);

  const {
    requestSearch,
    searchText,
    rows: hotels,
    exportCsv,
  } = activeHotelsHook();

  const { Hotels } = useSelector((state) => state);

  const { dataArrayLengh, pageNumber, SortBy, CardView, PerPage, GridView } =
    Hotels;

    const sweetDeleteAlert = useDeleteAlert({
      state: Hotels,
      modelName: 'Hotels',
      t: t,
      deleteUrl: deleteUrl,
      dispatchType: 'HOTELS',
    });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: Hotels,
    dispatchType: 'HOTELS',
    cookieName: 'hotels',
  });

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={hotelsFields}
          state={Hotels}
          createUrl={createUrl}
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={hotels}
          profile
          modelName='Hotels'
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
};

export default ActiveHotels;
