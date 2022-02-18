import categoriesStyles from './categories-style';
import { useState, useEffect } from 'react';
import { useMediaQuery, Grid, Box, ButtonBase, Container } from '@mui/material';
import { useTheme } from '@mui/styles';
import DotParallax from '../Parallax/DotParallax';
import CategoryCards from '../Cards/CategoryCards';
import TitleWithDesc from '../Title/TitleWithDesc';
import axios from 'axios';
import { CircleToBlockLoading } from 'react-loadingg';
import { useTranslation } from 'next-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Categories(props) {
  const { router } = props;
  const classes = categoriesStyles();
  const [categoriesContent, setCategoriesContent] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation('home');

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const categories = await axios.get('/api/categories/getall');
        if (categories.status == 200 && categories.data?.success) {
          setCategoriesContent(categories.data.data);
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

  useEffect(() => {}, []);

  return (
    <div className={classes.root}>
      <div className={classes.parallaxWrap}>
        <DotParallax />
      </div>
      <Container fixed={!isMobile}>
        {categoriesContent.length == 0 && (
          <CircleToBlockLoading color={theme.palette.secondary.main} />
        )}
        <Box p={!isMobile ? 6 : 0}>
          <TitleWithDesc
            head={t('categories.title')}
            desc={t('categories.desc')}
            align={isMobile ? 'center' : 'left'}
            color='primary'
          />
          <div className={classes.massonry}>
            <Grid container spacing={isMobile ? 2 : 6}>
              {categoriesContent.map((item, index) => {
               return (
                  <Grid item lg={4} xs={6} key={index.toString()}>
                    <div
                      style={{ animationDelay: `${index / 2}s` }}
                      className={`animate__animated animate__backIn${
                        router.locale == 'fa' ? 'Right' : 'Left'
                      } `}>
                      <CategoryCards
                        img={item.img}
                        title={item[`title_${router.locale}`]}
                        desc={item[`desc_${router.locale}`]}
                      />
                    </div>
                  </Grid>
                );
              })}
              <Grid item lg={4} xs={6}>
                <div className={classes.cardWrap}>
                  <div
                    style={{
                      animationDelay: `${categoriesContent.length / 2 + 0.5}s`,
                    }}
                    className={`animate__animated animate__backIn${
                      router.locale == 'fa' ? 'Right' : 'Left'
                    } `}>
                    <span className={classes.fold} />
                    <ButtonBase className={classes.allCategoryCard} focusRipple>
                      <span className={classes.figure}>
                        <img
                          src='https://unsplash.it/300/440/?random'
                          alt='img'
                        />
                      </span>
                      <span className={classes.property}>
                        <span className={classes.title}>
                          {t('categories.allCategories')}
                          {router.locale == 'en' ? (
                            <ArrowForwardIcon />
                          ) : (
                            <ArrowBackIcon />
                          )}
                        </span>
                      </span>
                    </ButtonBase>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Container>
    </div>
  );
}
