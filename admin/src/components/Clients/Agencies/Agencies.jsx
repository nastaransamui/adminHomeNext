import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import agenciesHook from './agenciesHook';
import { useSelector } from 'react-redux';
import DataShow from '../../datasShow/DataShow';

import {
  createUrl,
  dataGridColumns,
  editUrl,
  agenciesFields,
  deleteUrl,
} from './agenciesStatic';
import useDeleteAlert from '../../Hooks/useDeleteAlert';
import useDataHeaders from '../../Hooks/useDataHeaders';

export default function Agencies(props) {
  const { t } = useTranslation('agencies');

  const { requestSearch, searchText, rows: agencies, exportCsv } = agenciesHook();
  const { Agencies } = useSelector((state) => state);
  const { dataArrayLengh, pageNumber, SortBy, CardView, PerPage, GridView } =
    Agencies;

  const sweetDeleteAlert = useDeleteAlert({
    state: Agencies,
    modelName: 'Agencies',
    t: t,
    deleteUrl: deleteUrl,
    dispatchType: 'AGENCIES',
  });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: Agencies,
    dispatchType: 'AGENCIES',
    cookieName: 'agencies',
  });

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={agenciesFields}
          state={Agencies}
          createUrl={createUrl}
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={agencies}
          profile
          modelName='Agencies'
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
        />
      </Fragment>
    </Container>
  );
}
