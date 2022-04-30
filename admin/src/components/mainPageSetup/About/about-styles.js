import { makeStyles } from '@mui/styles';
import { cardTitle } from '../../../../theme/common';
import pattern from '../../../../public/images/patern/about-bg-pattern.png';

const aboutStyles = makeStyles((theme) => {
  return {
    input: {
      '& input, & textarea': { color: theme.palette.primary.contrastText },
      '& label': {
        color: theme.palette.primary.contrastText,
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(1),
      },
    },
    root: {
      background: `url(${pattern.src}) repeat ${theme.palette.primary.dark}`,
      backgroundSize: '8%',
      position: 'relative',
      color: theme.palette.common.white,
      padding: theme.spacing(15, 0),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(8, 0),
      },
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
        padding: theme.spacing(6, 0),
      },
    },
    illustration: {
      boxShadow: '0 0px 18px 0 rgba(0, 0, 0, 0.17)',
      position: 'absolute',
      border: `15px solid ${theme.palette.primary.main}`,
      background: theme.palette.primary.main,
      borderRadius: 25,
      transform: 'rotate(45deg)',
      cursor: 'pointer',
      overflow: 'hidden',
      [theme.breakpoints.down('lg')]: {
        top: 230,
      },
      '& img': {
        height: '105%',
        transform:
          theme.direction === 'ltr'
            ? 'translateX(-20%)rotate(-45deg) scale(1.3)'
            : 'translateX(5%)rotate(-45deg) scale(1.8)',
      },
    },
    one: {
      borderRadius: 15,
      width: 60,
      height: 60,
      top: -10,
      left: 80,
      [theme.breakpoints.only('xs')]: {
        display: 'none',
      },
    },
    two: {
      width: 180,
      height: 180,
      top: -10,
      left: 280,
      [theme.breakpoints.only('xs')]: {
        top: -10,
        left: 0,
      },
    },
    firstValidator: {
      position: 'absolute',
      zIndex: 1,
      top: 220,
      left: 354,
      [theme.breakpoints.only('xs')]: {
        top: 220,
        left: 74,
      },
    },
    secondValidator: {
      position: 'absolute',
      zIndex: 1,
      top: 335,
      left: 102,
      [theme.breakpoints.only('xs')]: {
        top: 479,
        left: 84,
      },
    },
    thirdValidator: {
      position: 'absolute',
      zIndex: 1,
      top: 535,
      left: 318,
      [theme.breakpoints.only('xs')]: {
        top: 793,
        left: 106,
      },
    },
    firstDelete: {
      position: 'absolute',
      top: 76,
      zIndex: 1,
      left: 281,
      [theme.breakpoints.only('xs')]: {
        left: 220,
      },
    },
    secondDelete: {
      position: 'absolute',
      top: 204,
      zIndex: 1,
      left: 45,
      [theme.breakpoints.only('xs')]: {
        top: 347,
        left: 216,
      },
    },
    thirdDelete: {
      position: 'absolute',
      top: 370,
      zIndex: 1,
      left: 224,
      [theme.breakpoints.only('xs')]: {
        left: 278,
        top: 626,
      },
    },
    firstTop: {
      position: 'absolute',
      top: 5,
      zIndex: 1,
      left: 520,
      [theme.breakpoints.only('xs')]: {
        left: -10,
      },
    },
    firstRight: {
      position: 'absolute',
      top: 214,
      zIndex: 1,
      left: 296,
      [theme.breakpoints.only('xs')]: {
        left: 40,
        top: 200,
      },
    },
    secondTop: {
      position: 'absolute',
      top: 130,
      zIndex: 1,
      left: 30,
      [theme.breakpoints.only('xs')]: {
        left: 9,
        top: 276,
      },
    },
    secondRight: {
      position: 'absolute',
      top: 324,
      zIndex: 1,
      left: 66,
      [theme.breakpoints.only('xs')]: {
        left: 73,
        top: 453,
      },
    },
    thirdTop: {
      position: 'absolute',
      top: 305,
      zIndex: 1,
      left: 520,
      [theme.breakpoints.only('xs')]: {
        top: 549,
        left: 8,
      },
    },
    thirdRight: {
      position: 'absolute',
      top: 524,
      zIndex: 1,
      left: 296,
      [theme.breakpoints.only('xs')]: {
        top: 770,
        left: 69,
      },
    },
    three: {
      width: 160,
      height: 160,
      top: 130,
      left: 40,
      [theme.breakpoints.only('xs')]: {
        top: 273,
        left: 21,
      },
    },
    four: {
      width: 210,
      height: 210,
      top: 270,
      left: 230,
      [theme.breakpoints.only('xs')]: {
        top: 527,
        left: 23,
      },
    },
    five: {
      borderRadius: 15,
      width: 60,
      height: 60,
      bottom: -30,
      right: 10,
    },
    imageGrid: {
      [theme.breakpoints.down('lg')]: {
        minHeight: 500,
      },
      [theme.breakpoints.only('xs')]: {
        minHeight: 730,
      },
    },
  };
});

export default aboutStyles;
