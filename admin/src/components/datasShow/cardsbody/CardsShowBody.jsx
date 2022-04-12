import PropTypes from 'prop-types';
import { forwardRef, Fragment, useState, useEffect, createRef } from 'react';

import cardsShowStyles from '../cards-show-styles';

import { Grid } from '@mui/material';

import CustomPagination from './CustomPagination';
import { useSelector } from 'react-redux';
import Card from '../../Card/Card';

import CardsHeader from './CardsHeader';
import CardsBody from './CardsBody';

const CardsShowBody = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const { cardView, mainData, total } = props;
  const { usersGrid } = useSelector((state) => state);
  const [expanded, setExpanded] = useState({});
  const [elRefs, setElRefs] = useState([]);

  useEffect(() => {
    // add  refs
    setElRefs((elRefs) =>
      Array(total)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [total]);

  const setCardStyle = (index, expanded) => {
    return {
      height: '80%',
      opacity:
        Object.keys(expanded).length === 0 &&
        Object.keys(expanded)[0] == undefined
          ? 1
          : expanded[index] == true
          ? 1
          : Object.values(expanded)[0] == undefined ||
            !Object.values(expanded)[0]
          ? 1
          : 0.2,
    };
  };

  return (
    <Fragment ref={ref}>
      {cardView && (
        <Fragment>
          <CustomPagination {...props} setExpanded={setExpanded} />
          <Grid container spacing={2} style={{ marginTop: 20 }}>
            {mainData.map((data, index) => {
              return (
                <Grid
                  item
                  xs={usersGrid}
                  sm={usersGrid}
                  md={usersGrid}
                  lg={usersGrid}
                  xl={usersGrid}
                  key={index}>
                  <Card
                    style={setCardStyle(index, expanded)}
                    profile
                    className={classes.cardHover}
                    ref={elRefs[index]}>
                    <CardsHeader data={data} {...props} />
                    <CardsBody
                      data={data}
                      index={index}
                      setExpanded={setExpanded}
                      expanded={expanded}
                      {...props}
                    />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          <CustomPagination {...props} setExpanded={setExpanded} />
        </Fragment>
      )}
    </Fragment>
  );
});

CardsShowBody.propTypes = {
  cardView: PropTypes.bool.isRequired,
  mainData: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  blog: PropTypes.bool,
  raised: PropTypes.bool,
  background: PropTypes.bool,
  pricing: PropTypes.bool,
  testimonial: PropTypes.bool,
  modelName: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  editUrl: PropTypes.string.isRequired,
  deleteAlert: PropTypes.func.isRequired,
};

export default CardsShowBody;
