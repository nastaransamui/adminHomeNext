import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import currenciesHook from './currenciesHook';
import DataShow from '../../datasShow/DataShow';
import useDataHeaders from '../../Hooks/useDataHeaders';
import {
  currenciesFields,
  dataGridColumns,
  activeUrl,
  diActiveUrl,
  editUrl,
} from './currenciesStatic';
import useActiveAlert from '../../Hooks/useActiveAlert';
import useButtonActivation from '../../Hooks/useButtonActivation';

const Currencies = (props) => {
  const { componentView, reactRoutes } = props;
  const { t } = useTranslation('exchange');
  const currenciesRoute = reactRoutes.filter((a) => {
    if (a.componentName == 'Currencies' && a.componentView == componentView) {
      return true;
    }
  })[0];
  const { deleteButtonDisabled, createButtonDisabled } =
    useButtonActivation(currenciesRoute);
  const {
    requestSearch,
    searchText,
    rows: currencies,
    exportCsv,
  } = currenciesHook(componentView);
  const { currenciesGStore, currenciesAStore } = useSelector((state) => state);
  const {
    dataArrayLengh,
    pageNumber,
    SortBy,
    CardView,
    PerPage,
    GridView,
    activesId,
  } =
    componentView == 'global_currencies' ? currenciesGStore : currenciesAStore;

  const { sweetActiveAlert } = useActiveAlert({
    state: currenciesGStore,
    modelName: 'Currencies',
    fileName: 'currencies.json',
    t: t,
    Url: activeUrl,
    dispatchType: 'CURRENCIES_G_STORE',
    activesId: activesId,
  });

  const { sweetDiactiveAlert } = useActiveAlert({
    state:
      componentView == 'global_currencies'
        ? currenciesGStore
        : currenciesAStore,
    modelName: 'Currencies',
    fileName: 'currencies.json',
    t: t,
    Url: diActiveUrl,
    dispatchType:
      componentView == 'global_currencies'
        ? 'CURRENCIES_G_STORE'
        : 'CURRENCIES_A_STORE',
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
      componentView == 'global_currencies'
        ? currenciesGStore
        : currenciesAStore,
    dispatchType:
      componentView == 'global_currencies'
        ? 'CURRENCIES_G_STORE'
        : 'CURRENCIES_A_STORE',
    cookieName:
      componentView == 'global_currencies'
        ? 'currenciesGStore'
        : 'currenciesAStore',
  });
  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={currenciesFields}
          state={
            componentView == 'global_currencies'
              ? currenciesGStore
              : currenciesAStore
          }
          createUrl=''
          editUrl={componentView == 'global_currencies' ? '' : editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={currencies}
          profile
          modelName={
            componentView == 'global_currencies' ? componentView : 'Currencies'
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
          //Pass False here but disble inputs and submit in currency page
          updateButtonDisabled={false}
        />
      </Fragment>
    </Container>
  );
};

export default Currencies;
