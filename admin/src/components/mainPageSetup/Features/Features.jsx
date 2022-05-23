import { Fragment } from 'react';

import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import featuresHook from './featuresHook';
import { useSelector } from 'react-redux';
import DataShow from '../../datasShow/DataShow';
import {
  editUrl,
  createUrl,
  dataGridColumns,
  featuresFields,
  deleteUrl,
} from './featuresStatic';
import useDeleteAlert from '../../Hooks/useDeleteAlert';
import useDataHeaders from '../../Hooks/useDataHeaders';

const Features = (props) => {
  const { t } = useTranslation('feature');
  const { requestSearch, searchText, rows: features } = featuresHook();
  const { Features } = useSelector((state) => state);

  const { dataArrayLengh, pageNumber, SortBy, CardView, PerPage, GridView } =
    Features;

  const sweetDeleteAlert = useDeleteAlert({
    state: Features,
    modelName: 'Features',
    t: t,
    deleteUrl: deleteUrl,
    dispatchType: 'FEATURES',
  });

  const {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  } = useDataHeaders({
    state: Features,
    dispatchType: 'FEATURES',
    cookieName: 'features',
  });

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <DataShow
          {...props}
          t={t}
          requestSearch={requestSearch}
          searchText={searchText}
          dataFields={featuresFields}
          state={Features}
          createUrl={createUrl}
          editUrl={editUrl}
          cardView={CardView}
          pageNumber={pageNumber}
          total={dataArrayLengh}
          perPage={PerPage}
          mainData={features}
          profile
          movie
          modelName='Features'
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

export default Features;
