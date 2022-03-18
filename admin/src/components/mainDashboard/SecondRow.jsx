import { useMemo } from 'react';

import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardIcon from '../Card/CardIcon';
import CardBody from '../Card/CardBody';
import Table from '../Table/Table';

import dynamic from 'next/dynamic'

import secondStyle from './second-style';
import LanguageIcon from '@mui/icons-material/Language';
import { tableValuesLocaleConvert } from './MainDashboard';



const VectorMap = dynamic(
  () => import('react-jvectormap').then((m) => m.VectorMap),
  { ssr: false }
);

const mapData = [
  {
    flag: 'US.png',
    country_fa: 'ایالات متحده آمریکا',
    country_code: 'US',
    'country_en-US': 'USA',
    firstNumber: 2920,
    percentage: '53.23',
  },
  {
    flag: 'DE.png',
    country_fa: 'آلمان',
    'country_en-US': 'Germany',
    country_code: 'GE',
    firstNumber: 1300,
    percentage: '20.43',
  },
  {
    flag: 'AU.png',
    country_fa: 'استرالیا',
    'country_en-US': 'Australia',
    country_code: 'AU',
    firstNumber: 760,
    percentage: '10.35',
  },
  {
    flag: 'GB.png',
    country_fa: 'بریتانیا',
    'country_en-US': 'United Kingdom',
    country_code: 'GB',
    firstNumber: 690,
    percentage: '7.87',
  },
  {
    flag: 'RO.png',
    country_fa: 'رومانی',
    'country_en-US': 'Romania',
    country_code: 'RO',
    firstNumber: 600,
    percentage: '5.94',
  },
  {
    flag: 'BR.png',
    country_fa: 'برزیل',
    'country_en-US': 'Brasil',
    country_code: 'BR',
    firstNumber: 550,
    percentage: '4.34',
  },
];


export default function SecondRow({t, rtlActive, showLang}) {
  const classes = secondStyle();

  const objecData = useMemo(() => {
    return {};
  }, []);



  const dataTable = (mapData) => {
    let result = [];
    for (let index = 0; index < mapData.length; index++) {
      const element = mapData[index];
      objecData[element.country_code] = element.firstNumber;
      result.push([
        <img
          src={`/admin/images/flags/${element.flag}`}
          alt={element[`country_${showLang}`]}
          key={'flag'}
        />,
        element[`country_${showLang}`],
        tableValuesLocaleConvert(`${element.firstNumber}`,rtlActive),
        tableValuesLocaleConvert(
          `${rtlActive ? `%${element.percentage}` : `${element.percentage}%`}`,rtlActive
        ),
      ]);
    }

    return result;
  };
  return (
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
                  <Table tableData={dataTable(mapData)} />
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
                          values: objecData,
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
  )
}


SecondRow.propTypes = {
  rtlActive: PropTypes.bool.isRequired,
  showLang: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};