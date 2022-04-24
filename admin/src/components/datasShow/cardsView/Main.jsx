import PropTypes from 'prop-types';
import { forwardRef, Fragment, useState, useEffect, createRef } from 'react';

import cardsShowStyles from '../cards-show-styles';

import { Grid } from '@mui/material';

import Pagination from './Pagination';
import Card from '../../Card/Card';

import Header from './Header';
import Body from './Body';

const Main = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const { cardView, mainData, total, gridNumber } = props;
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
          <Pagination {...props} setExpanded={setExpanded} />
          <Grid container spacing={2} style={{ marginTop: 20 }}>
            {mainData.map((data, index) => {
              return (
                <Grid
                  item
                  xs={gridNumber}
                  sm={gridNumber}
                  md={gridNumber}
                  lg={gridNumber}
                  xl={gridNumber}
                  key={index}>
                  <Card
                    style={setCardStyle(index, expanded)}
                    profile
                    className={classes.cardHover}
                    ref={elRefs[index]}>
                    <Header data={data} {...props} />
                    <Body
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
          <Pagination {...props} setExpanded={setExpanded} />
        </Fragment>
      )}
    </Fragment>
  );
});

Main.propTypes = {
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

export default Main;
