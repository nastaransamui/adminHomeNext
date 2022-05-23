import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import citiesHook from './citiesHook';
import DataShow from '../../datasShow/DataShow';
import useDataHeaders from '../../Hooks/useDataHeaders';
import {
  citiesFields,
  dataGridColumns,
  editUrl
} from './citiesStatic';

const Cities = (props) => {
  const { t } = useTranslation('geoLocations');
  const {
    requestSearch,
    searchText,
    rows: cities,
    exportCsv
  } = citiesHook();
  const { citiesStore } = useSelector((state) => state);
  const {
    dataArrayLengh,
    pageNumber,
    SortBy,
    CardView,
    PerPage,
    GridView,
  } = citiesStore;


  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state:citiesStore,
    dispatchType: 'CITIES_STORE',
    cookieName:'citiesStore',
  });
  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={citiesFields}
          state={citiesStore}
          createUrl=''
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={cities}
          profile
          modelName='Cities'
          dataGridColumns={dataGridColumns}
          gridNumberFunc={gridNumberFunc}
          gridNumber={GridView}
          paginationChange={paginationChange}
          perPageFunc={perPageFunc}
          sortByFunc={sortByFunc}
          sortByValues={SortBy}
          cardHeaderType={{
            icon: true,
            image: false,
          }}
          cardAvatarType={{
            profile: false,
            plain: false,
            square: true,
          }}
          cardViewsFunc={cardViewsFunc}
          exportCsv={exportCsv}
        />
      </Fragment>
    </Container>
  );
};

export default Cities;
