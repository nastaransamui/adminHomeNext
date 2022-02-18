import { useState, useEffect, forwardRef } from 'react';
import featureStyles from './featured-style';
import { Container, Box, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import { useTranslation } from 'next-i18next';
import MovieThumb from '../Cards/MovieThumb';
import axios from 'axios';
import Title from '../Title/Title';
import { CircleToBlockLoading } from 'react-loadingg';
import MovieDialog from './MovieDialog';

export default function Featured(props) {
  const classes = featureStyles();
  const { t } = useTranslation('home');
  const [featuredList, setFeaturedList] = useState([]);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { router } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [player, setPlayer] = useState([]);
  const [movieItem, setMovieItem] = useState({})
  const handleClose = () => {
    setOpenPopup(false);
    setPlayer([])
  };
  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const featured = await axios.get('/api/featured/getall');
        if (featured.status == 200 && featured.data?.success) {
          setFeaturedList(featured.data.data);
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

  const onPlayClick = (item) => {
    setOpenPopup(!openPopup);
    setMovieItem(item)
  };

  return (
    <div className={classes.root}>
      {openPopup && (
        <MovieDialog
          openPopup={openPopup}
          handleClose={handleClose}
          player={player}
          setPlayer={setPlayer}
          movieItem={movieItem}
          router={router}
        />
      )}
      <div className={classes.decoration}>
        <svg fill='#cccccc'>
          <use xlinkHref='/images/svg/deco-med-bg.svg#main' />
        </svg>
      </div>
      <Container fixed={isDesktop}>
        <Grid container spacing={4}>
          <Grid item md={3} xs={12}>
            <Box pt={isDesktop ? 5 : 0}>
              <Title
                primary={t('featured.titlePrimary')}
                secondary={t('featured.titleSecondary')}
                align={isMobile ? 'center' : 'left'}
              />
            </Box>
          </Grid>
          {featuredList.length == 0 && (
            <CircleToBlockLoading color={theme.palette.secondary.main} />
          )}
          {featuredList.map((item, index) => {
            return (
              <Grid item key={index.toString()} md={3} sm={4} xs={12}>
                <MovieThumb
                  item={item}
                  {...props}
                  t={t}
                  onPlayClick={onPlayClick}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}
