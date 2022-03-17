// we'll use this to import an use the vector map plugin
import dynamic from 'next/dynamic';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';

const VectorMap = dynamic(
  () => import('react-jvectormap').then((m) => m.VectorMap),
  { ssr: false }
);

import mainStyles from './main-style';
import { useTranslation } from 'react-i18next';

import { Icon, Grid, Tooltip, Button, Typography } from '@mui/material';

import WarningIcon from '@mui/icons-material/Warning';
import StoreIcon from '@mui/icons-material/Store';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import UpdateIcon from '@mui/icons-material/Update';
import LanguageIcon from '@mui/icons-material/Language';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import PlaceIcon from '@mui/icons-material/Place';


import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardIcon from '../Card/CardIcon';
import CardFooter from '../Card/CardFooter';
import Table from '../Table/Table';
import CardBody from '../Card/CardBody';

const us_flag = require('../../../public/images/flags/US.png').default.src;
const de_flag = require('../../../public/images/flags/DE.png').default.src;
const au_flag = require('../../../public/images/flags/AU.png').default.src;
const gb_flag = require('../../../public/images/flags/GB.png').default.src;
const ro_flag = require('../../../public/images/flags/RO.png').default.src;
const br_flag = require('../../../public/images/flags/BR.png').default.src;

const priceImage1 = require('../../../public/images/cards/card-1.jpeg').default.src;
const priceImage2 = require('../../../public/images/cards/card-2.jpeg').default.src;
const priceImage3 = require('../../../public/images/cards/card-3.jpeg').default.src;

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920,
};

const MainDashboard = (props) => {
  const classes = mainStyles();
  const { t, i18n } = useTranslation('dashboard');
  const rtlActive = i18n.language == 'fa';
  const tableValuesLocaleConvert = (value) => {
    if (rtlActive) {
      return value.replace(/[0-9]/g, (c) =>
        String.fromCharCode(c.charCodeAt(0) + 1728)
      );
    }
    return value;
  };
  var delays = 80,
    durations = 500;
  var delays2 = 80,
    durations2 = 500;
  var dailySalesChart = {
    data: {
      labels: rtlActive
        ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
        : ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [[12, 17, 7, 17, 23, 18, 38]],
    },
    options: {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    // for animation
    animation: {
      draw: function (data) {
        if (data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path
                .clone()
                .scale(1, 0)
                .translate(0, data.chartRect.height())
                .stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint,
            },
          });
        } else if (data.type === 'point') {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: 'ease',
            },
          });
        }
      },
    },
  };

  const emailsSubscriptionChart = {
    data: {
      labels: rtlActive
        ? [
            'فرو',
            'ارد',
            'خرد',
            'تیر',
            'مرد',
            'شهر',
            'مهر',
            'آبا',
            'آذر',
            'دی',
            'بهم',
            'اسف',
          ]
        : [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mai',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
      series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]],
    },
    options: {
      axisX: {
        showGrid: false,
      },
      low: 0,
      high: 1000,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0,
      },
    },
    responsiveOptions: [
      [
        'screen and (max-width: 640px)',
        {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            },
          },
        },
      ],
    ],
    animation: {
      draw: function (data) {
        if (data.type === 'bar') {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays2,
              dur: durations2,
              from: 0,
              to: 1,
              easing: 'ease',
            },
          });
        }
      },
    },
  };

  const completedTasksChart = {
    data: {
      labels: rtlActive
        ? ['۱۲', '۱۵', '۱۸', '۲۱', '۲۴', '۳', '۶', '۹']
        : ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
      series: [[230, 750, 450, 300, 280, 240, 200, 190]],
    },
    options: {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    animation: {
      draw: function (data) {
        if (data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path
                .clone()
                .scale(1, 0)
                .translate(0, data.chartRect.height())
                .stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint,
            },
          });
        } else if (data.type === 'point') {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: 'ease',
            },
          });
        }
      },
    },
  };

  return (
    <div className={classes.MainDashboard}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color='warning' stats icon>
              <CardIcon color='warning'>
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>{t('cards').title_0}</p>
              <h3 className={classes.cardTitle}>
                {tableValuesLocaleConvert('49')}/{' '}
                {tableValuesLocaleConvert('50')} <small>GB</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats + ' ' + classes.dangerText}>
                <WarningIcon />
                <a href='#pablo' onClick={(e) => e.preventDefault()}>
                  {t('cards').footer_0}
                </a>
              </div>
            </CardFooter>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color='dark' stats icon>
              <CardIcon color='dark'>
                <StoreIcon />
              </CardIcon>
              <p className={classes.cardCategory}>{t('cards').title_1}</p>
              <h3 className={classes.cardTitle}>
                ${tableValuesLocaleConvert('34,245')}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRangeIcon />
                {t('cards').footer_1}
              </div>
            </CardFooter>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color='danger' stats icon>
              <CardIcon color='danger'>
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>{t('cards').title_2}</p>
              <h3 className={classes.cardTitle}>
                {tableValuesLocaleConvert('75')}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOfferIcon />
                {t('cards').footer_2}
              </div>
            </CardFooter>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color='info' stats icon>
              <CardIcon color='info'>
                <i className='fab fa-twitter' />
              </CardIcon>
              <p className={classes.cardCategory}>{t('cards').title_3}</p>
              <h3 className={classes.cardTitle}>
                {tableValuesLocaleConvert('245')}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <UpdateIcon />
                {t('cards').footer_3}
              </div>
            </CardFooter>
          </Card>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Card>
              <CardHeader color='success' icon>
                <CardIcon color='success'>
                  <LanguageIcon />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>{t('map').title}</h4>
              </CardHeader>
              <CardBody>
                <Grid container justifyContent='space-between'>
                  <Grid item xs={12} sm={12} md={5}>
                    <Table
                      tableData={[
                        [
                          <img src={us_flag} alt='us_flag' key={'flag'} />,
                          t('map').country_0,
                          tableValuesLocaleConvert('2,920'),
                          tableValuesLocaleConvert(
                            `${rtlActive ? '%53.23' : '53.23%'}`
                          ),
                        ],
                        [
                          <img src={de_flag} alt='us_flag' key={'flag'} />,
                          t('map').country_1,
                          tableValuesLocaleConvert('1,300'),
                          tableValuesLocaleConvert(
                            `${rtlActive ? '%20.43' : '20.43%'}`
                          ),
                        ],
                        [
                          <img src={au_flag} alt='us_flag' key={'flag'} />,
                          t('map').country_2,
                          tableValuesLocaleConvert('760'),
                          tableValuesLocaleConvert(
                            `${rtlActive ? '%10.35' : '10.35%'}`
                          ),
                        ],
                        [
                          <img src={gb_flag} alt='us_flag' key={'flag'} />,
                          t('map').country_3,
                          tableValuesLocaleConvert('690'),
                          tableValuesLocaleConvert(
                            `${rtlActive ? '%7.87' : '7.87%'}`
                          ),
                        ],
                        [
                          <img src={ro_flag} alt='us_flag' key={'flag'} />,
                          t('map').country_4,
                          tableValuesLocaleConvert('600'),
                          tableValuesLocaleConvert(
                            `${rtlActive ? '%5.94' : '5.94%'}`
                          ),
                        ],
                        [
                          <img src={br_flag} alt='us_flag' key={'flag'} />,
                          t('map').country_5,
                          tableValuesLocaleConvert('550'),
                          tableValuesLocaleConvert(
                            `${rtlActive ? '%4.34' : '4.34%'}`
                          ),
                        ],
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <VectorMap
                      map={'world_mill'}
                      backgroundColor='transparent'
                      zoomOnScroll={false}
                      containerStyle={{
                        width: '100%',
                        height: '280px',
                      }}
                      containerClassName='map'
                      regionStyle={{
                        initial: {
                          fill: '#e4e4e4',
                          'fill-opacity': 0.9,
                          stroke: 'none',
                          'stroke-width': 0,
                          'stroke-opacity': 0,
                        },
                      }}
                      series={{
                        regions: [
                          {
                            values: mapData,
                            scale: ['#AAAAAA', '#444444'],
                            normalizeFunction: 'polynomial',
                          },
                        ],
                      }}
                    />
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
            <Card chart className={classes.cardHover}>
              <CardHeader color='info' className={classes.cardHeaderHover}>
                <ChartistGraph
                  className='ct-chart-white-colors'
                  data={dailySalesChart.data}
                  type='Line'
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>
              <CardBody>
                <div className={classes.cardHoverUnder}>
                  <Tooltip
                    id='tooltip-top'
                    title={t('charts').buttonHover1}
                    placement='bottom'
                    classes={{ tooltip: classes.tooltip }}>
                    <Button color='primary'>
                      <RefreshIcon className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    id='tooltip-top'
                    title={t('charts').buttonHover2}
                    placement='bottom'
                    classes={{ tooltip: classes.tooltip }}>
                    <Button color='primary'>
                      <EditIcon className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                </div>
                <h4 className={classes.cardTitle}>{t('charts').title_0}</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpwardIcon className={classes.upArrowCardCategory} />{' '}
                    {tableValuesLocaleConvert(`${rtlActive ? '%55' : '55%'}`)}
                  </span>{' '}
                  {t('charts').subtitle_0}
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTimeIcon /> {t('charts').footer_0}
                </div>
              </CardFooter>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card chart className={classes.cardHover}>
              <CardHeader color='dark' className={classes.cardHeaderHover}>
                <ChartistGraph
                  className='ct-chart-white-colors'
                  data={emailsSubscriptionChart.data}
                  type='Bar'
                  options={emailsSubscriptionChart.options}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              </CardHeader>
              <CardBody>
                <div className={classes.cardHoverUnder}>
                  <Tooltip
                    id='tooltip-top'
                    title={t('charts').buttonHover1}
                    placement='bottom'
                    classes={{ tooltip: classes.tooltip }}>
                    <Button color='primary'>
                      <RefreshIcon className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    id='tooltip-top'
                    title={t('charts').buttonHover2}
                    placement='bottom'
                    classes={{ tooltip: classes.tooltip }}>
                    <Button color='primary'>
                      <EditIcon className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                </div>
                <h4 className={classes.cardTitle}>{t('charts').title_1}</h4>
                <p className={classes.cardCategory}>{t('charts').subtitle_1}</p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTimeIcon />
                  {t('charts').footer_1}
                </div>
              </CardFooter>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card chart className={classes.cardHover}>
              <CardHeader color='danger' className={classes.cardHeaderHover}>
                <ChartistGraph
                  className='ct-chart-white-colors'
                  data={completedTasksChart.data}
                  type='Line'
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              </CardHeader>
              <CardBody>
                <div className={classes.cardHoverUnder}>
                  <Tooltip
                    id='tooltip-top'
                    title={t('charts').buttonHover1}
                    placement='bottom'
                    classes={{ tooltip: classes.tooltip }}>
                    <Button color='primary'>
                      <RefreshIcon className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    id='tooltip-top'
                    title={t('charts').buttonHover2}
                    placement='bottom'
                    classes={{ tooltip: classes.tooltip }}>
                    <Button color='primary'>
                      <EditIcon className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                </div>
                <h4 className={classes.cardTitle}>{t('charts').title_2}</h4>
                <p className={classes.cardCategory}>{t('charts').subtitle_2}</p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTimeIcon /> {t('charts').footer_2}
                </div>
              </CardFooter>
            </Card>
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom component="div">{t('3rdRow').title}</Typography>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
          <Card product className={classes.cardHover}>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={priceImage1} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_0}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="primary" >
                    <ArtTrackIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_1}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" >
                    <RefreshIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_2}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="error" >
                    <EditIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                {t("3rdRow").card_0_title}
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
              {t("3rdRow").card_0_content}
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>${tableValuesLocaleConvert("899")}/{t("3rdRow").card_0_price}</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <PlaceIcon /> {t("3rdRow").card_0_location}
              </div>
            </CardFooter>
          </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
          <Card product className={classes.cardHover}>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={priceImage3} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_0}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="primary" >
                    <ArtTrackIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_1}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" >
                    <RefreshIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_2}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="error" >
                    <EditIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                {t("3rdRow").card_1_title}
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
              {t("3rdRow").card_1_content}
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>${tableValuesLocaleConvert("1.119")}/{t("3rdRow").card_1_price}</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <PlaceIcon /> {t("3rdRow").card_1_location}
              </div>
            </CardFooter>
          </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
          <Card product className={classes.cardHover}>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={priceImage2} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_0}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="primary" >
                    <ArtTrackIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_1}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" >
                    <RefreshIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title={t("3rdRow").tooltip_2}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="error" >
                    <EditIcon className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                {t("3rdRow").card_2_title}
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
              {t("3rdRow").card_2_content}
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>${tableValuesLocaleConvert("459")}/{t("3rdRow").card_2_price}</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <PlaceIcon /> {t("3rdRow").card_2_location}
              </div>
            </CardFooter>
          </Card>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainDashboard;
