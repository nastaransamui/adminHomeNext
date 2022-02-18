import { CssBaseline } from '@mui/material';

import { Fragment, createRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useStyles from './home-style';
import menu from '../../../public/text/menu';
import AnimateSlider from '../../components/AnimateSlider/AnimateSlider';
import VideoBanner from '../../components/VideoBanner/VideoBanner';
import PageNav from '../../components/PageNav/PageNav';
import ThemeUser from '../../components/ThemeUser/ThemeUser';

const HomePage = (props) => {
  const { showMovie } = useSelector((state) => state);
  const classes = useStyles();
  const arrLength = menu.length;
  const [elRefs, setElRefs] = useState([]);

  useEffect(() => {
    // add  refs
    setElRefs((elRefs) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [arrLength]);

  useEffect(() => {
    // scroll to section
    if (
      typeof window !== 'undefined' &&
      elRefs.length > 0 &&
      localStorage.getItem('scrollTo') !== null
    ) {
      window.scrollTo(
        0,
        elRefs[localStorage.getItem('scrollTo')]?.current.offsetTop
      );

      localStorage.setItem('scrollTo', null);
    }
  }, [elRefs]);

  return (
    <Fragment>
      <CssBaseline />
      <div className={classes.mainWrap}>
        <main className={classes.containerWrap}>
          <section id='home'>
            {showMovie ? (
              <VideoBanner {...props} />
            ) : (
              <AnimateSlider {...props} />
            )}
          </section>
          <ThemeUser {...props} />
          {menu.map((Item, index) => {
            return (
              <section
                ref={elRefs[index]}
                id={Item.en}
                key={index.toString()}
                className={classes.spaceTop}>
                <Item.firstComponent {...props} />
              </section>
            );
          })}
        </main>
        <PageNav {...props} />
      </div>
    </Fragment>
  );
};

export default HomePage;
