import useStyles from './footer-style';
import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  InputAdornment,
  useMediaQuery,
  Typography,
  Select,
  OutlinedInput,
  MenuItem,
  Link,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import clsx from 'clsx';
import { useTheme } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import brand from '../../../public/text/brand';
import { useRouter } from 'next/dist/client/router';
import axios from 'axios';
import { CircleToBlockLoading } from 'react-loadingg';
import { useSelector, useDispatch } from 'react-redux';
import { langName } from '../../../public/text/langNames';

function Copyright({ router }) {
  return (
    <Typography variant='body' display='block' align='center'>
      &copy;&nbsp;
      {brand[`footerText_${router.locale}`]}
    </Typography>
  );
}

export default function Footer() {
  const classes = useStyles();
  const [footers, setFooters] = useState([]);
  const router = useRouter();
  const invert = router.locale == 'fa' ? true : false;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { themeType } = useSelector((state) => state);
  const [values, setValues] = useState({
    lang: router.locale,
  });

  const handleChangeLang = (lang) => {
    // Handle language from 404 page
    setValues((oldValues) => ({
      ...oldValues,
      lang: lang.LangCode,
    }));
    if (router.route == '/404') {
      router.push(`${router.route}`, `${router.route}`, {
        locale: `${lang.LangCode}`,
        scroll: false,
        replace: true,
      });
    } else {
      router.push(`${router.asPath}`, `${router.asPath}`, {
        locale: `${lang.LangCode}`,
        scroll: false,
        replace: true,
      });
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const footer = await axios.get('/api/footers/getall');
        if (footer.status == 200 && footer.data?.success) {
          setFooters(footer.data.data);
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
    <Container
      maxWidth='lg'
      component='footer'
      className={clsx(classes.footer, invert && classes.invert)}>
      {footers.length == 0 && (
        <CircleToBlockLoading color={theme.palette.secondary.main} />
      )}
      <Grid container spacing={isDesktop ? 4 : 2}>
        <Grid item xs={12} md={3}>
          <div className={classes.logo}>
            <img src='/images/logo.svg' alt='logo' />
            <Typography variant='h6'>
              {brand[`projectName_${router.locale}`]}
            </Typography>
          </div>
          {isDesktop && <Copyright router={router} />}
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={isTablet ? 1 : 4} justify='space-evenly'>
            {footers.length !== 0 &&
              footers.map((footer) => {
                return (
                  <Grid
                    item
                    xs={12}
                    md={3}
                    key={footer[`title_${router.locale}`]}
                    className={classes.siteMapItem}>
                    {isDesktop && (
                      <div>
                        <Typography
                          variant='h6'
                          className={classes.title}
                          color='textPrimary'
                          gutterBottom>
                          {footer[`title_${router.locale}`]}
                        </Typography>
                        <ul>
                          {footers.length !== 0 &&
                            footer[`description_${router.locale}`].map(
                              (item, index) => {
                                return (
                                  <li key={item}>
                                    <Link
                                      href={footer.link[index]}
                                      variant='subtitle1'
                                      color='textSecondary'>
                                      {item}
                                    </Link>
                                  </li>
                                );
                              }
                            )}
                        </ul>
                      </div>
                    )}
                    {isMobile && (
                      <Accordion
                        square
                        classes={{ root: classes.accordionRoot }}>
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon className={classes.accordionIcon} />
                          }
                          aria-controls='panel1a-content'
                          id='panel1a-header'
                          classes={{
                            content: classes.accordionContent,
                          }}>
                          <strong>{footer[`title_${router.locale}`]}</strong>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ul>
                            {footers.length !== 0 &&
                              footer[`description_${router.locale}`].map(
                                (item, index) => {
                                  return (
                                    <li key={item}>
                                      <Link
                                        href={footer.link[index]}
                                        variant='subtitle1'
                                        color='textSecondary'>
                                        {item}
                                      </Link>
                                    </li>
                                  );
                                }
                              )}
                          </ul>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <div className={classes.socmed}>
            <IconButton aria-label='FB' className={classes.margin} size='small'>
              <i className='ion-social-facebook' />
            </IconButton>
            <IconButton aria-label='TW' className={classes.margin} size='small'>
              <i className='ion-social-twitter' />
            </IconButton>
            <IconButton aria-label='IG' className={classes.margin} size='small'>
              <i className='ion-social-instagram' />
            </IconButton>
            <IconButton aria-label='LI' className={classes.margin} size='small'>
              <i className='ion-social-linkedin' />
            </IconButton>
          </div>
          <Select
            value={values.lang}
            startAdornment={
              <InputAdornment className={classes.icon} position='start'>
                <span></span>
              </InputAdornment>
            }
            className={classes.selectLang}
            input={<OutlinedInput name='lang' id='outlined-lang-simple' />}>
            {langName.map((item, index) => {
              return (
                <MenuItem
                  key={index.toString()}
                  divider
                  onClick={() => {
                    handleChangeLang(item);
                  }}
                  value={item.LangCode}>
                  <img
                    src={`/images/langs/${item.Flag}`}
                    alt=''
                    className={classes.flag}
                  />{' '}
                  &nbsp;
                  <span className={classes.menuItemText}>
                    {item[`title_${router.locale}`]}
                  </span>
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
      {isMobile && <Copyright router={router} />}
    </Container>
  );
}
