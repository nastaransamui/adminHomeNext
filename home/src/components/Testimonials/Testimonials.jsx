import testiStyles from './testi-style';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CircleToBlockLoading } from 'react-loadingg';
import { useTheme } from '@mui/material/styles';
import TitleWithDesc from '../Title/TitleWithDesc';
import { useTranslation } from 'next-i18next';
import Carousel from 'react-slick';
import clsx from 'clsx';
import TestimonialCards from '../Cards/TestimonialCards';
import { IconButton } from '@mui/material';

export default function Testimonials(props) {
  const [testiContent, setTestiContent] = useState([]);
  const classes = testiStyles();
  const theme = useTheme();
  const { router } = props;
  const slider = useRef(null);
  const { t } = useTranslation('home');

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 7000,
    slidesToShow: 2,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const testi = await axios.get('/api/testimonials/getall');
        if (testi.status == 200 && testi.data?.success) {
          setTestiContent(testi.data.data);
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
      <TitleWithDesc
        head={t('testimonials.title')}
        desc={t('testimonials.desc')}
        align='center'
        color='primary'
      />
      <div className={classes.sliderWrap}>
        <div className={classes.carousel}>
          {testiContent.length == 0 && (
            <CircleToBlockLoading color={theme.palette.secondary.main} />
          )}
          <Carousel ref={slider} {...settings}>
            {testiContent.map((item, index) => {
              return (
                <div key={index.toString()} className={classes.item}>
                  <TestimonialCards
                    text={item[`text_${router.locale}`]}
                    name={item[`name_${router.locale}`]}
                    title={item[`title_${router.locale}`]}
                  />
                </div>
              );
            })}
          </Carousel>
          <IconButton
            className={clsx(classes.nav, classes.prev)}
            onClick={() => slider.current.slickPrev()}>
            <i className='ion-ios-arrow-left' />
          </IconButton>
          <IconButton
            className={clsx(classes.nav, classes.next)}
            onClick={() => slider.current.slickNext()}>
            <i className='ion-ios-arrow-forward' />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
