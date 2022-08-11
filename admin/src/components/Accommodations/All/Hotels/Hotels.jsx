import { Fragment, forwardRef } from 'react';

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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
const Hotels = (props) => {
  const { componentView, reactRoutes, rtlActive, socket } = props;

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
    openAlert,
    handleCloseAlert,
    alertText,
  } = hotelsHook(socket);
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

  let filterhotelsFields = hotelsFields.filter((a) => {
    if (rtlActive) {
      return a.label !== 'title_en';
    } else {
      return a.label !== 'title_fa';
    }
  });

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Snackbar
        open={openAlert}
        sx={{ width: '40%' }}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseAlert}
          icon={<CheckCircleOutlineIcon fontSize='inherit' />}
          severity='info'
          sx={{ width: '100%' }}>
          {alertText}
        </Alert>
      </Snackbar>
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
