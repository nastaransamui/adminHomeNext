import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import provincesHook from './provincesHook';
import DataShow from '../../datasShow/DataShow';
import useDataHeaders from '../../Hooks/useDataHeaders';
import {
  provincesFields,
  dataGridColumns,
  editUrl
} from './provincesStatic';

const Provinces = (props) => {
  const { t } = useTranslation('geoLocations');
  const {
    requestSearch,
    searchText,
    rows: provinces,
  } = provincesHook();
  const { provincesStore } = useSelector((state) => state);
  const {
    dataArrayLengh,
    pageNumber,
    SortBy,
    CardView,
    PerPage,
    GridView,
  } = provincesStore;


  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state:provincesStore,
    dispatchType: 'PROVINCES_STORE',
    cookieName:'provincesStore',
  });
  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={provincesFields}
          createUrl=''
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={provinces}
          profile
          modelName='Provinces'
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
        />
      </Fragment>
    </Container>
  );
};

export default Provinces;
