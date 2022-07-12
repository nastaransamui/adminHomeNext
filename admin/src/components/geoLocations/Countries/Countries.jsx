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
import useButtonActivation from '../../Hooks/useButtonActivation';

const Countries = (props) => {
  const { componentView, reactRoutes } = props;
  const { t } = useTranslation('geoLocations');
  const countriesRoute = reactRoutes.filter((a) => {
    if (a.componentName == 'Countries' && a.componentView == componentView) {
      return true;
    }
  })[0];
  const { deleteButtonDisabled, createButtonDisabled } =
    useButtonActivation(countriesRoute);
  const {
    requestSearch,
    searchText,
    rows: countries,
    exportCsv,
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
    activesId: activesId,
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
    activesId: activesId,
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
          state={
            componentView == 'global_countries'
              ? countriesGStore
              : countriesAStore
          }
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
          exportCsv={exportCsv}
          deleteButtonDisabled={deleteButtonDisabled}
          createButtonDisabled={createButtonDisabled}
          //Pass False here but disble inputs and submit in country page
          updateButtonDisabled={false}
        />
      </Fragment>
    </Container>
  );
};

export default Countries;
