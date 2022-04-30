import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import photosHook from './photosHook';
import { useSelector } from 'react-redux';
// import VideoStyles from './video-styles';
import DataShow from '../../datasShow/DataShow';
import {
  editUrl,
  createUrl,
  dataGridColumns,
  photosFields,
  deleteUrl,
} from './photosStatic';
import useDeleteAlert from '../../Hooks/useDeleteAlert';
import useDataHeaders from '../../Hooks/useDataHeaders';

const Photos = (props) => {
  const { t } = useTranslation('photos');
  const { requestSearch, searchText, rows: photos } = photosHook();
  const { sliderImage } = useSelector((state) => state);
  const { dataArrayLengh, pageNumber, SortBy, CardView, PerPage, GridView } =
    sliderImage;

  const sweetDeleteAlert = useDeleteAlert({
    state: sliderImage,
    modelName: 'Photos',
    t: t,
    deleteUrl: deleteUrl,
    dispatchType: 'SLIDER_IMAGE',
  });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: sliderImage,
    dispatchType: 'SLIDER_IMAGE',
    cookieName: 'sliderImage',
  });

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={photosFields}
          createUrl={createUrl}
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={photos}
          profile
          modelName='Photos'
          deleteAlert={sweetDeleteAlert}
          dataGridColumns={dataGridColumns}
          gridNumberFunc={gridNumberFunc}
          gridNumber={GridView}
          paginationChange={paginationChange}
          perPageFunc={perPageFunc}
          sortByFunc={sortByFunc}
          sortByValues={SortBy}
          cardHeaderType={{
            icon: false,
            image: true,
          }}
          cardAvatarType={{
            profile: false,
            plain: true,
          }}
          cardViewsFunc={cardViewsFunc}
        />
      </Fragment>
    </Container>
  );
};

export default Photos;
