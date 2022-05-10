import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import countriesHook from './countriesHook';
import DataShow from '../../datasShow/DataShow';
import useDataHeaders from '../../Hooks/useDataHeaders';
import {
  countriesFields,
  dataGridColumns,
  activeUrl,
  diActiveUrl,
  editUrl,
} from './countriesStatic';
import useActiveAlert from '../../Hooks/useActiveAlert';

const Countries = (props) => {
  const { componentView } = props;
  const { t } = useTranslation('geoLocations');
  const {
    requestSearch,
    searchText,
    rows: countries,
  } = countriesHook(componentView);
  const { countriesGStore, countriesAStore } = useSelector((state) => state);
  const {
    dataArrayLengh,
    pageNumber,
    SortBy,
    CardView,
    PerPage,
    GridView,
    activesId,
  } = componentView == 'global_countries' ? countriesGStore : countriesAStore;

  const { sweetActiveAlert } = useActiveAlert({
    state: countriesGStore,
    modelName: 'Countries',
    fileName: 'countries+states+cities.json',
    t: t,
    Url: activeUrl,
    dispatchType: 'COUNTRIES_G_STORE',
  });

  const { sweetDiactiveAlert } = useActiveAlert({
    state:
      componentView == 'global_countries' ? countriesGStore : countriesAStore,
    modelName: 'Countries',
    fileName: 'countries+states+cities.json',
    t: t,
    Url: diActiveUrl,
    dispatchType:
      componentView == 'global_countries'
        ? 'COUNTRIES_G_STORE'
        : 'COUNTRIES_A_STORE',
  });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state:
      componentView == 'global_countries' ? countriesGStore : countriesAStore,
    dispatchType:
      componentView == 'global_countries'
        ? 'COUNTRIES_G_STORE'
        : 'COUNTRIES_A_STORE',
    cookieName:
      componentView == 'global_countries'
        ? 'countriesGStore'
        : 'countriesAStore',
  });
  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={countriesFields}
          createUrl=''
          editUrl={componentView == 'global_countries' ? '' : editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={countries}
          profile
          modelName={
            componentView == 'global_countries' ? componentView : 'Countries'
          }
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
          activesId={activesId}
          activeAlert={sweetActiveAlert}
          diactiveAlert={sweetDiactiveAlert}
        />
      </Fragment>
    </Container>
  );
};

export default Countries;
