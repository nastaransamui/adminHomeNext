import { forwardRef, Fragment, useState } from 'react';
import { Container, Grid } from '@mui/material';
import FilterSwitch from './FilterSwitch.jsx';
import cardsShowStyles from '../cards-show-styles.js';

import { styled } from '@mui/material/styles';
import FilterTextSearch from './FilterTextSearch.jsx';
import FilterIcons from './FilterIcons.jsx';
import CreateNew from './CreateNew.jsx';
import MainSearch from './MainSearch';

export const StyledBox = styled(Container)((props) => {
  const { theme, viewpanel, showsearch } = props;

  return {
    padding: 10,
    border: '3px solid ',
    minHeight: 50,
    borderColor:
      theme.palette[viewpanel == 'view' ? 'primary' : 'secondary'].main,
    borderRadius: 5,
    '&.view': {
      position: showsearch == 'false' ? 'relative' : 'absolute',
      visibility: showsearch == 'false' ? 'visible' : 'hidden',
    },
    '&.filter': {
      position: showsearch == 'true' ? 'relative' : 'absolute',
      minHeight: 80,
      visibility: showsearch == 'true' ? 'visible' : 'hidden',
    },
  };
});

const MainHeader = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const { createUrl, width, setMainData } = props;
  const [showSearch, setShowSearch] = useState(false);

  return (
    <Fragment>
      <StyledBox
        viewpanel='filter'
        style={{ minWidth: width }}
        showsearch={showSearch.toString()}
        className={
          showSearch
            ? 'animate__animated animate__zoomIn filter'
            : 'animate__animated animate__zoomOut filter'
        }>
        <MainSearch
          {...props}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          setMainData={setMainData}
        />
      </StyledBox>
      <StyledBox
        ref={ref}
        maxWidth='xl'
        viewpanel='view'
        showsearch={showSearch.toString()}
        className={
          showSearch
            ? 'animate__animated animate__zoomOut view'
            : 'animate__animated animate__zoomIn view'
        }>
        <Grid className={classes.filterToolbar}>
          <FilterSwitch {...props} />
          <FilterTextSearch {...props} />
          <FilterIcons
            {...props}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
          {createUrl !== '' && <CreateNew {...props} />}
        </Grid>
      </StyledBox>
    </Fragment>
  );
});

export default MainHeader;
