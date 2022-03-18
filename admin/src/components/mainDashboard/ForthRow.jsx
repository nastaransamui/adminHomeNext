import { Fragment } from 'react';
import forthStyle from './forth-style';
import PropTypes from 'prop-types';

import { Icon, Grid, Tooltip, Button, Typography } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';


import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardFooter from '../Card/CardFooter';
import CardBody from '../Card/CardBody';

import {tableValuesLocaleConvert} from './MainDashboard'

export const mainDashboardProduct = [
  {
    image: 'card-2.jpeg',
    'title_en-US': 'Cozy 5 Stars Apartment',
    title_fa: 'آپارتمان 5 ستاره دنج',
    'content_en-US':
      "The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to 'Naviglio' where you can enjoy the main night life in Barcelona.",
    content_fa:
      "این مکان نزدیک به ساحل بارسلونتا و ایستگاه اتوبوس تنها 2 دقیقه پیاده روی و نزدیک به 'Naviglio' است که در آن می توانید از زندگی اصلی شبانه در بارسلون لذت ببرید.",
    price: 899,
    'unit_en-US': 'night',
    unit_fa: 'شب',
    location_fa: 'بارسلونا، اسپانیا',
    'location_en-US': 'Barcelona, Spain',
    icon: 'place',
    show: true,
  },
  {
    image: 'card-3.jpeg',
    'title_en-US': 'Office Studio',
    title_fa: 'آفیس استودیو',
    'content_en-US':
      "The place is close to Metro Station and bus stop just 2 min by walk and near to 'Naviglio' where you can enjoy the night life in London, UK.",
    content_fa:
      'این مکان نزدیک به ایستگاه مترو و ایستگاه اتوبوس است که فقط 2 دقیقه پیاده روی دارد و نزدیک به Naviglio است، جایی که می توانید از زندگی شبانه در لندن، انگلستان لذت ببرید.',
    price: 1119,
    'unit_en-US': 'night',
    unit_fa: 'شب',
    location_fa: 'لندن، انگلستان',
    'location_en-US': 'London, UK',
    icon: 'place',
    show: true,
  },
  {
    image: 'card-1.jpeg',
    'title_en-US': 'Beautiful Castle',
    title_fa: 'قلعه زیبا',
    'content_en-US':
      "The place is close to Metro Station and bus stop just 2 min by walk and near to 'Naviglio' where you can enjoy the night life in Milan, Italy.",
    content_fa:
      'این مکان نزدیک به ایستگاه مترو و ایستگاه اتوبوس فقط 2 دقیقه با پای پیاده و نزدیک به Naviglio است، جایی که می توانید از زندگی شبانه در میلان ایتالیا لذت ببرید.',
    price: 459,
    'unit_en-US': 'night',
    unit_fa: 'شب',
    location_fa: 'میلان ایتالی',
    'location_en-US': 'Milan, Italy',
    icon: 'place',
    show: true,
  },
];

export default function ForthRow({ rtlActive, showLang, t }) {
  const classes = forthStyle();

  const showProduct = mainDashboardProduct.filter((a) => a.show);
  return (
    <Fragment>
      <Typography variant='h5' gutterBottom component='div'>
        {t('3rdRow').title}
      </Typography>
      <br />
      <Grid container spacing={2}>
        {showProduct.map((data, index) => {
          return (
            <Grid item xs={12} sm={12} md={12 / showProduct.length} key={index}>
              <Card product className={classes.cardHover}>
                <CardHeader image className={classes.cardHeaderHover}>
                  <a href='#pablo' onClick={(e) => e.preventDefault()}>
                    <img src={`/admin/images/cards/${data.image}`} alt='...' />
                  </a>
                </CardHeader>
                <CardBody>
                  <div className={classes.cardHoverUnder}>
                    <Tooltip
                      id='tooltip-top'
                      title={t('3rdRow').tooltip_0}
                      placement='bottom'
                      classes={{ tooltip: classes.tooltip }}>
                      <Button color='primary'>
                        <ArtTrackIcon className={classes.underChartIcons} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      id='tooltip-top'
                      title={t('3rdRow').tooltip_1}
                      placement='bottom'
                      classes={{ tooltip: classes.tooltip }}>
                      <Button color='success'>
                        <RefreshIcon className={classes.underChartIcons} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      id='tooltip-top'
                      title={t('3rdRow').tooltip_2}
                      placement='bottom'
                      classes={{ tooltip: classes.tooltip }}>
                      <Button color='error'>
                        <EditIcon className={classes.underChartIcons} />
                      </Button>
                    </Tooltip>
                  </div>
                  <h4 className={classes.cardProductTitle}>
                    <a href='#pablo' onClick={(e) => e.preventDefault()}>
                      {data[`title_${showLang}`]}
                    </a>
                  </h4>
                  <p className={classes.cardProductDesciprion}>
                    {data[`content_${showLang}`]}
                  </p>
                </CardBody>
                <CardFooter product>
                  <div className={classes.price}>
                    <h4>
                      ${tableValuesLocaleConvert(`${data.price}`, rtlActive)} /{' '}
                      {data[`unit_${showLang}`]}
                    </h4>
                  </div>
                  <div className={`${classes.stats} ${classes.productStats}`}>
                    <Icon>{data.icon}</Icon> {data[`location_${showLang}`]}
                  </div>
                </CardFooter>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Fragment>
  );
}

ForthRow.propTypes = {
  rtlActive: PropTypes.bool.isRequired,
  showLang: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};