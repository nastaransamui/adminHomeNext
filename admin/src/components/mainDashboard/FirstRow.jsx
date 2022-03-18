import { Fragment } from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { Icon, Grid } from '@mui/material';

import firstStyle from './first-style';

import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardIcon from '../Card/CardIcon';
import CardFooter from '../Card/CardFooter';
import { tableValuesLocaleConvert } from './MainDashboard';

export const mainDashbordFirstCard = [
  {
    header_icon: 'content_copy',
    show: true,
    social: false,
    color: 'warning',
    'title_en-US': 'Get more space',
    title_fa: 'خرید فضای بیشتر',
    firstNumber: '49',
    secondNumber: '50',
    unit: 'GB',
    footer_icon: 'warning',
    'footer_en-US': 'Used Space',
    footer_fa: 'فضای مصرفی',
  },
  {
    header_icon: 'store',
    show: true,
    social: false,
    color: 'dark',
    'title_en-US': 'Revenue',
    title_fa: 'درآمد',
    firstNumber: '34,245',
    secondNumber: '',
    unit: '$',
    footer_icon: 'date_range',
    'footer_en-US': 'Last 24 Hours',
    footer_fa: '24 ساعت گذشته',
  },
  {
    header_icon: 'info_outline',
    show: true,
    social: false,
    color: 'danger',
    'title_en-US': 'Fixed Issues',
    title_fa: 'رفع مشکلات',
    firstNumber: '75',
    secondNumber: '',
    unit: '',
    footer_icon: 'local_offer',
    'footer_en-US': 'Tracked from Github',
    footer_fa: 'ردیابی شده از Github',
  },
  {
    header_icon: 'fab fa-twitter',
    show: true,
    social: true,
    color: 'info',
    'title_en-US': 'Followers',
    title_fa: 'پیروان',
    firstNumber: '245',
    secondNumber: '',
    unit: '',
    footer_icon: 'update',
    'footer_en-US': 'Just Updated',
    footer_fa: 'تازه آپدیت شده',
  },
];

export default function FirstRow({ rtlActive, showLang }) {
  const classes = firstStyle();

  //Server filter for show only first row
  const justShow = mainDashbordFirstCard.filter((a) => a.show);
  return (
    <Grid container spacing={1}>
      {justShow.map((data, index) => {
        return (
          <Fragment key={index}>
            <Grid item xs={12} sm={6} md={6} lg={12 / justShow.length}>
              <Card>
                <CardHeader color={data.color} stats icon>
                  <CardIcon color={data.color}>
                    {data.social ? (
                      <i className={data.header_icon} />
                    ) : (
                      <Icon>{data.header_icon}</Icon>
                    )}
                  </CardIcon>
                  <p className={classes.cardCategory}>
                    {data[`title_${showLang}`]}
                  </p>
                  <h3 className={classes.cardTitle}>
                    {tableValuesLocaleConvert(`${data.firstNumber}`, rtlActive)}
                    {data.secondNumber !== '' && '/'}
                    {tableValuesLocaleConvert(
                      `${data.secondNumber}`,
                      rtlActive
                    )}{' '}
                    <small>{data.unit}</small>
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div
                    className={clsx(
                      classes.stats,
                      data.color == 'warning' && classes.dangerText
                    )}>
                    <Icon>{data.footer_icon}</Icon>
                    <a href='#pablo' onClick={(e) => e.preventDefault()}>
                      {data[`footer_${showLang}`]}
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </Grid>
          </Fragment>
        );
      })}
    </Grid>
  );
}
FirstRow.propTypes = {
  rtlActive: PropTypes.bool.isRequired,
  showLang: PropTypes.string.isRequired,
};
