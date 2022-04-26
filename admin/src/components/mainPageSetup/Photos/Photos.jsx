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
} from './photosStatic';

const Photos = (props) => {
  const { t } = useTranslation('photos');
  const {
    sweetAlert,
    requestSearch,
    searchText,
    rows: photos,
    alertCall,
    paginationChange,
    perPageFunc,
    sortByFunc,
    cardViewsFunc,
    gridNumberFunc
  } = photosHook();
  const {  sliderImage } = useSelector((state) => state);
  const {
    totalPhotos,
    photosPageNumber,
    photosSortBy,
    photosCardView,
    photosPerPage,
    photosGrid
  } = sliderImage;

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
          cardView={photosCardView}
          pageNumber={photosPageNumber}
          total={totalPhotos}
          perPage={photosPerPage}
          mainData={photos}
          profile
          alertCall={alertCall}
          modelName='Photos'
          deleteAlert={sweetAlert}
          dataGridColumns={dataGridColumns}
          gridNumberFunc={gridNumberFunc}
          gridNumber={photosGrid}
          paginationChange={paginationChange}
          perPageFunc={perPageFunc}
          sortByFunc={sortByFunc}
          sortByValues={photosSortBy}
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
