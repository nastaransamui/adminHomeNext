import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CircleToBlockLoading } from 'react-loadingg';
import clsx from 'clsx';
import { Icon, Grid } from '@mui/material';
import firstStyle from './first-style';
import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardIcon from '../Card/CardIcon';
import CardFooter from '../Card/CardFooter';
import { useTheme } from '@mui/styles';

import { tableValuesLocaleConvert } from './MainDashboard';
import SvgIcon from '@mui/material/SvgIcon';
import firstRowHook from './firstRowHook';
import Loading from '../Loading/Loading';

export default function FirstRow({ rtlActive, showLang }) {
  const classes = firstStyle();
  const theme = useTheme();
  const { mainData } = firstRowHook();
  //Server filter for show only first row
  const justShow = mainData.filter((a) => a.show);

  return (
    <Grid container spacing={1}>
      {justShow.length == 0 ? (
        <Grid item xs={12} sm={6} md={6} lg={12} >
          <Loading color={theme.palette.secondary.main}/>
        </Grid>
      ) : (
        justShow.map((data, index) => {
          const IconHeader = data.header_icon;
          return (
            <Fragment key={index}>
              <Grid item xs={12} sm={6} md={6} lg={12 / justShow.length} >
                <Card style={{minHeight: 110}}>
                  <CardHeader color={data.color} stats icon>
                    <CardIcon color={data.color}>
                      <SvgIcon>
                        <path d={`${IconHeader}`} />
                      </SvgIcon>
                    </CardIcon>
                    <p className={classes.cardCategory}>
                      {data[`title_${showLang}`]}
                    </p>
                    <h3 className={classes.cardTitle}>
                      {tableValuesLocaleConvert(
                        `${data.firstNumber}`,
                        rtlActive
                      )}
                      {data.secondNumber !== '' && '/'}
                      {tableValuesLocaleConvert(
                        `${data.secondNumber}`,
                        rtlActive
                      )}{' '}
                      <small>{data.unit}</small>
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={clsx(classes.stats, classes.dangerText)}>
                      <Icon>{data.footer_icon}</Icon>
                      <a href='#pablo' onClick={(e) => e.preventDefault()}>
                        {data[`footer_${showLang}`] || <br />}
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              </Grid>
            </Fragment>
          );
        })
      )}
    </Grid>
  );
}
FirstRow.propTypes = {
  rtlActive: PropTypes.bool.isRequired,
  showLang: PropTypes.string.isRequired,
};
