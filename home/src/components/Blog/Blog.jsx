import blogStyles from './blog-style';
import { useTheme } from '@mui/material/styles';
import {
  useMediaQuery,
  Container,
  Hidden,
  Box,
  Button,
  IconButton,
  Paper,
  Grid,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Carousel from 'react-slick';
import TitleWithDesc from '../Title/TitleWithDesc';
import BlogCards from '../Cards/BlogCards';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { CircleToBlockLoading } from 'react-loadingg';
import clsx from 'clsx';
import MovieDialog from '../Featured/MovieDialog';

export default function Blog(props) {
  const classes = blogStyles();
  const { router } = props;
  const [blogData, setBlogData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [player, setPlayer] = useState([]);
  const [movieItem, setMovieItem] = useState({});
  const { t } = useTranslation('home');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 750,
    fade: true,
    arrows: false,
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const blog = await axios.get('/api/blog/getall');
        if (blog.status == 200 && blog.data?.success) {
          setBlogData(blog.data.data);
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

  const handleClose = () => {
    setOpenPopup(false);
    setPlayer([]);
  };
  const onPlayClick = (item) => {
    setOpenPopup(!openPopup);
    setMovieItem(item);
  };

  return (
    <div className={classes.root}>
      {openPopup && (
        <MovieDialog
          openPopup={openPopup}
          handleClose={handleClose}
          player={player}
          movieItem={movieItem}
          setPlayer={setPlayer}
          router={router}
        />
      )}
      {blogData.length == 0 && (
        <CircleToBlockLoading color={theme.palette.secondary.main} />
      )}
      <Hidden smDown>
        <div
          className={clsx(classes.deco, classes[`deco${theme.direction}`])}
        />
      </Hidden>
      <Container fixed>
        <Box p={!isMobile ? 6 : 0}>
          <TitleWithDesc
            head={t('blog.title')}
            desc={t('blog.desc')}
            align='left'
            color='primary'
          />
          <Grid
            container
            spacing={!isMobile ? 10 : 6}
            direction={!isMobile ? 'row-reverse' : 'row'}>
            <Grid
              item
              md={6}
              xs={12}
              style={{ animationDelay: `2s` }}
              className={`animate__animated animate__backIn${
                router.locale == 'fa' ? 'Left' : 'Right'
              } `}>
              <div className={classes.videoWrap}>
                <div className={classes.videoCarousel}>
                  <Carousel {...settings}>
                    {blogData.map((item, index) => {
                      return (
                        <Paper className={classes.item} key={index.toString()}>
                          <img
                            src={item.thumb}
                            alt={item[`title_${router.locale}`]}
                          />
                          <IconButton
                            className={classes.playBtn}
                            onClick={() => onPlayClick(item)}>
                            <PlayArrowIcon />
                          </IconButton>
                        </Paper>
                      );
                    })}
                  </Carousel>
                </div>
              </div>
            </Grid>
            <Grid item md={6} xs={12}>
              <div className={classes.blogList}>
                {blogData.map((item, index) => {
                  return (
                    <div
                      style={{ animationDelay: `${index / 2}s` }}
                      key={index.toString()}
                      className={`animate__animated animate__backIn${
                        router.locale == 'fa' ? 'Right' : 'Left'
                      } `}>
                      <BlogCards
                        category={item[`category_${router.locale}`]}
                        title={item[`title_${router.locale}`]}
                        date={item.createdDate}
                        router={router}
                      />
                    </div>
                  );
                })}
                <Button color='secondary' className={classes.more}>
                  {t('blog.more')}
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
