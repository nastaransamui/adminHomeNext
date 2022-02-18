import trendingStyles from './trending-style';
import { useRef, useEffect, useState } from 'react';
import { Container, useMediaQuery, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Carousel from 'react-slick';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import TitleWithDesc from '../Title/TitleWithDesc';
import DotParallax from '../Parallax/DotParallax';
import axios from 'axios';
import { CircleToBlockLoading } from 'react-loadingg';
import GeneralCards from '../Cards/GeneralCards';

export default function Trending(props) {
  const classes = trendingStyles();
  const { router } = props;
  const [trendingData, setTrendingData] = useState([]);
  const theme = useTheme();
  const slider = useRef(null);
  const { t } = useTranslation('home');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay: false,
    slidesToShow: 4,
    arrows: false,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (theme.direction === 'rtl' && trendingData.length !== 0) {
        const lastSlide = trendingData.length -2;
        slider.current.slickGoTo(lastSlide);
      }
    }
    return () => {
      isMount = false;
    };
  }, [theme, trendingData]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const trending = await axios.get('/api/trendings/getall');
        if (trending.status == 200 && trending.data?.success) {
          setTrendingData(trending.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.parallaxWrap}>
        <DotParallax />
      </div>
      <Container>
        {trendingData.length == 0 && (
          <CircleToBlockLoading color={theme.palette.secondary.main} />
        )}
        <div className={classes.floatingTitle}>
          <TitleWithDesc
            head={t('trending.title')}
            desc={t('trending.desc')}
            align={isMobile ? 'center' : 'left'}
            color='primary'
            dark
          />
        </div>
      </Container>
      <div className={classes.sliderWrap}>
        <div className={classes.carousel}>
          <Carousel ref={slider} {...settings}>
            {!isMobile && (
              <div className={clsx(classes.props, classes.itemPropsFirst)}>
                <div />
              </div>
            )}
            {trendingData.map((item, index) => {
              return (
                <div key={index.toString()} className={classes.item}>
                  <GeneralCards
                    img={item.img}
                    title={item[`title_${router.locale}`]}
                    desc={item[`desc_${router.locale}`]}
                    rating={item.rating}
                    price={item.price}
                  />
                </div>
              );
            })}
            {!isMobile && (
              <div className={clsx(classes.props, classes.itemPropsLast)}>
                <div />
              </div>
            )}
          </Carousel>
        </div>
        <IconButton
          className={clsx(classes.nav, classes.prev)}
          onClick={() => {
            slider.current.slickPrev();
          }}>
          {router.locale == 'fa' ? (
            <i className='ion-ios-arrow-forward' />
          ) : (
            <i className='ion-ios-arrow-left' />
          )}
        </IconButton>
        <IconButton
          className={clsx(classes.nav, classes.next)}
          onClick={() => slider.current.slickNext()}>
          {router.locale == 'fa' ? (
            <i className='ion-ios-arrow-left' />
          ) : (
            <i className='ion-ios-arrow-forward' />
          )}
        </IconButton>
      </div>
    </div>
  );
}
