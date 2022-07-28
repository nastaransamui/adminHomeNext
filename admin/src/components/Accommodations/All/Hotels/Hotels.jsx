import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import hotelsHook from './hotelsHook';
import DataShow from '../../../datasShow/DataShow';
import useDataHeaders from '../../../Hooks/useDataHeaders';
import useActiveAlert from '../../../Hooks/useActiveAlert';
import useButtonActivation from '../../../Hooks/useButtonActivation';
import {
  activeUrl,
  diActiveUrl,
  hotelsFields,
  dataGridColumns,
} from './hotelsStatic';

const Hotels = (props) => {
  const { componentView, reactRoutes, rtlActive } = props;

  const allHotelsRoute = reactRoutes.filter((a) => {
    if (a.componentName == 'Allhotels' && a.componentView == componentView) {
      return true;
    }
  })[0];
  const { deleteButtonDisabled, createButtonDisabled } =
    useButtonActivation(allHotelsRoute);
  const {
    t,
    requestSearch,
    searchText,
    rows: hotels,
    exportCsv,
  } = hotelsHook();
  const { hotelsGStore } = useSelector((state) => state);
  const {
    dataArrayLengh,
    pageNumber,
    SortBy,
    CardView,
    PerPage,
    GridView,
    activesId,
  } = hotelsGStore;

  const { sweetActiveAlert } = useActiveAlert({
    state: hotelsGStore,
    modelName: 'HotelsList',
    fileName: undefined,
    t: t,
    Url: activeUrl,
    dispatchType: 'HOTELS_G_STORE',
    activesId: activesId,
  });

  const { sweetDiactiveAlert } = useActiveAlert({
    state: hotelsGStore,
    modelName: 'HotelsList',
    fileName: undefined,
    t: t,
    Url: diActiveUrl,
    dispatchType: 'HOTELS_G_STORE',
    activesId: activesId,
  });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: hotelsGStore,
    dispatchType: 'HOTELS_G_STORE',
    cookieName: 'hotelsGStore',
  });

  let filterhotelsFields = hotelsFields.filter((a)=>{
    if(rtlActive){
      return a.label !== 'title_en'
    }else{
      return a.label !== 'title_fa'
    }
  })

  
  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={filterhotelsFields}
          state={hotelsGStore}
          createUrl=''
          editUrl=''
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={hotels}
          profile
          modelName='HotelsList'
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

export default Hotels;
