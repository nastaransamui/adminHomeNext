import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import provincesHook from './provincesHook';
import DataShow from '../../datasShow/DataShow';
import useDataHeaders from '../../Hooks/useDataHeaders';
import { provincesFields, dataGridColumns, editUrl } from './provincesStatic';
import useButtonActivation from '../../Hooks/useButtonActivation';

const Provinces = (props) => {
  const { t } = useTranslation('geoLocations');
  const {reactRoutes} = props;
  const provinceRoute = reactRoutes.filter((a) => a.componentName == "Provinces")[0];
  const { deleteButtonDisabled, createButtonDisabled } =
    useButtonActivation(provinceRoute);
  const {
    requestSearch,
    searchText,
    rows: provinces,
    exportCsv,
  } = provincesHook();
  const { provincesStore } = useSelector((state) => state);
  const { dataArrayLengh, pageNumber, SortBy, CardView, PerPage, GridView } =
    provincesStore;

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: provincesStore,
    dispatchType: 'PROVINCES_STORE',
    cookieName: 'provincesStore',
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
          state={provincesStore}
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
          exportCsv={exportCsv}
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
          deleteButtonDisabled={deleteButtonDisabled}
          createButtonDisabled={createButtonDisabled}
          //Pass False here but disble inputs and submit in province page
          updateButtonDisabled={false}
        />
      </Fragment>
    </Container>
  );
};

export default Provinces;
