import { Fragment, useEffect } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import videosHook from './videosHook';
import { useSelector } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import DataShow from '../../datasShow/DataShow';
import useDeleteAlert from '../../Hooks/useDeleteAlert';
import useDataHeaders from '../../Hooks/useDataHeaders';

import {
  editUrl,
  createUrl,
  dataGridColumns,
  videosFields,
  deleteUrl,
} from './videosStatic';
import useButtonActivation from '../../Hooks/useButtonActivation';

const Videos = (props) => {
  const { t } = useTranslation('video');
  const { reactRoutes } = props;
  const { requestSearch, searchText, rows: videos } = videosHook();
  const videosRoute = reactRoutes.filter((a) => a.componentName == 'Videos')[0];

  const { deleteButtonDisabled, createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(videosRoute);


  const { sliderVideo } = useSelector((state) => state);
  const { dataArrayLengh, pageNumber, SortBy, CardView, PerPage, GridView } =
    sliderVideo;

  const sweetDeleteAlert = useDeleteAlert({
    state: sliderVideo,
    modelName: 'Videos',
    t: t,
    deleteUrl: deleteUrl,
    dispatchType: 'SLIDER_VIDEO',
  });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: sliderVideo,
    dispatchType: 'SLIDER_VIDEO',
    cookieName: 'sliderVideo',
  });

  const perRow = usePerRowHook(sliderVideo);

  useEffect(() => {
    if (perRow !== undefined) {
      gridNumberFunc(perRow)
      // dispatch({
      //   type: 'SLIDER_VIDEO',
      //   payload: { ...sliderVideo, GridView: perRow },
      // });
    }
  }, [perRow]);

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={videosFields}
          state={sliderVideo}
          createUrl={createUrl}
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={videos}
          profile
          movie
          modelName='Videos'
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
          deleteButtonDisabled={deleteButtonDisabled}
          createButtonDisabled={createButtonDisabled}
          updateButtonDisabled={updateButtonDisabled}
        />
      </Fragment>
    </Container>
  );
};

export default Videos;
