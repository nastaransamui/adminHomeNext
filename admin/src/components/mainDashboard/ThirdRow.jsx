import thirdStyle from './third-style';
import PropTypes from 'prop-types';

import { Grid, Tooltip, Button } from '@mui/material';

import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardFooter from '../Card/CardFooter';
import CardBody from '../Card/CardBody';

import ChartistGraph from 'react-chartist';

import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ArrowDownward } from '@mui/icons-material';

import { tableValuesLocaleConvert } from './MainDashboard';

const chartData = [
  {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    series: [[12, 17, 7, 17, 23, 18, 38]],
    type: 'Line',
    color: 'info',
    percentage: 55,
  },
  {
    labels: [
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
    type: 'Bar',
    color: 'dark',
    percentage: -30,
  },
  // {
  //   labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
  //   series: [[230, 750, 450, 300, 280, 240, 200, 190]],
  //   type: 'Line',
  //   color: 'danger',
  //   percentage: -70,
  // },
];

export default function ThirdRow({rtlActive, t}) {
  const classes = thirdStyle();
  var Chartist = require('chartist');
  var delays = 80,
    durations = 500;
  var delays2 = 80,
    durations2 = 500;
  const options = (data) => {
    const highestValue = Math.max(...data.series[0]);
    const nextHeighNumber = highestValue > 100 ? 100 : 10;
    return {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
      }),
      axisX: {
        showGrid: false,
      },
      axisY: {
        showGrid: true,
      },
      low: 0,
      high: highestValue + nextHeighNumber,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0,
      },
    };
  };

  const animation = (data) => {
    if (data.type === 'line' || data.type === 'area') {
      return data.element.animate({
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
      return data.element.animate({
        opacity: {
          begin: (data.index + 1) * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'ease',
        },
      });
    } else if (data.type === 'bar') {
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
  };
  return (
    <Grid container spacing={2}>
      {chartData.map((data, index) => {
        return (
          <Grid
            item
            xs={12}
            sm={12}
            md={12 / chartData.length}
            key={index.toString()}>
            <Card chart className={classes.cardHover}>
              <CardHeader
                color={data.color}
                className={classes.cardHeaderHover}>
                <ChartistGraph
                  className='ct-chart-white-colors'
                  data={data}
                  type={data.type}
                  options={options(data)}
                  listener={{
                    draw: (e) => animation(e),
                  }}
                />
              </CardHeader>
              <CardBody>
                <div className={classes.cardHoverUnder}>
                  <Tooltip
                    id='tooltip-top'
                    title={t('charts').buttonHover1}
                    placement='bottom' arrow>
                    <Button color='primary'>
                      <RefreshIcon className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    id='tooltip-top'
                    title={t('charts').buttonHover2}
                    placement='bottom' arrow>
                    <Button color='primary'>
                      <EditIcon className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                </div>
                <h4 className={classes.cardTitle}>
                  {t('charts')[`title_${index}`]}
                </h4>
                <p className={classes.cardCategory}>
                  {data.percentage > 0 ? (
                    <span className={classes.successText}>
                      <ArrowUpwardIcon
                        className={classes.upArrowCardCategory}
                      />{' '}
                      {tableValuesLocaleConvert(
                        `${
                          rtlActive
                            ? `%${data.percentage}`
                            : `${data.percentage}%`
                        }`,rtlActive
                      )}
                    </span>
                  ) : (
                    <span className={classes.failedText}>
                      <ArrowDownward className={classes.upArrowCardCategory} />{' '}
                      {tableValuesLocaleConvert(
                        `${
                          rtlActive
                            ? `%${data.percentage}`
                            : `${data.percentage}%`
                        }`,rtlActive
                      )}
                    </span>
                  )}{' '}
                  {t('charts')[`subtitle_${index}`]}
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTimeIcon /> {t('charts')[`footer_${index}`]}
                </div>
              </CardFooter>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

ThirdRow.propTypes = {
  rtlActive: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};