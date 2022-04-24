import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import videosHook from './videosHook';
import { useSelector } from 'react-redux';
// import VideoStyles from './video-styles';
import DataShow from '../../datasShow/DataShow';
import {
  editUrl,
  createUrl,
  dataGridColumns,
  videosFields,
} from './videosStatic';

const Videos = (props) => {
  const { t } = useTranslation('video');
  const {
    sweetAlert,
    requestSearch,
    searchText,
    rows: videos,
    alertCall,
    paginationChange,
    perPageFunc,
    sortByFunc,
    cardViewsFunc,
    gridNumberFunc
  } = videosHook();

  const {
    totalVideos,
    videosCardView,
    videosPageNumber,
    videosPerPage,
    videosSortBy,
    videosGrid
  } = useSelector((state) => state);

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={videosFields}
          createUrl={createUrl}
          editUrl={editUrl}
          cardView={videosCardView}
          pageNumber={videosPageNumber}
          total={totalVideos}
          perPage={videosPerPage}
          mainData={videos}
          profile
          movie
          alertCall={alertCall}
          modelName='Videos'
          deleteAlert={sweetAlert}
          dataGridColumns={dataGridColumns}
          gridNumberFunc={gridNumberFunc}
          gridNumber={videosGrid}
          paginationChange={paginationChange}
          perPageFunc={perPageFunc}
          sortByFunc={sortByFunc}
          sortByValues={videosSortBy}
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

export default Videos;
