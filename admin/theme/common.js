import { makeStyles } from '@mui/styles';

export const useTextAlign = makeStyles({
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
});

export const useFloat = makeStyles({
  floatLeft: {
    float: 'left',
  },
  floatRight: {
    float: 'right',
  },
});

export const useText = makeStyles((theme) => ({
  title: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 48,
    lineHeight: '72px',
    [theme.breakpoints.down('md')]: {
      fontSize: 28,
      lineHeight: '60px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 28,
      lineHeight: '44px',
    },
  },
  title2: {
    fontSize: 36,
    lineHeight: '56px',
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('md')]: {
      fontSize: 32,
      lineHeight: '48px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 24,
      lineHeight: '36px',
    },
  },
  subtitle: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 28,
    lineHeight: '44px',
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
      lineHeight: '36px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: '28px',
    },
  },
  subtitle2: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 22,
    lineHeight: '32px',
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
      lineHeight: '32px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      lineHeight: '24px',
    },
  },
  paragraph: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 16,
    lineHeight: '24px',
  },
  caption: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 16,
    lineHeight: '24px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      lineHeight: '22px',
    },
  },
}));

export const useHidden = makeStyles((theme) => ({
  lgDown: {
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
  mdDown: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  smDown: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  xsDown: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  lgUp: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  mdUp: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  smUp: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

export const hexToRgb = (input) => {
  input = input + '';
  input = input.replace('#', '');
  let hexRegex = /[0-9A-Fa-f]/g;
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error('input is not a valid hex color.');
  }
  if (input.length === 3) {
    let first = input[0];
    let second = input[1];
    let last = input[2];
    input = first + first + second + second + last + last;
  }
  input = input.toUpperCase(input);
  let first = input[0] + input[1];
  let second = input[2] + input[3];
  let last = input[4] + input[5];
  return (
    parseInt(first, 16) +
    ', ' +
    parseInt(second, 16) +
    ', ' +
    parseInt(last, 16)
  );
};
export const drawerWidth = 260;
export const blackColor = '#000';
export const whiteColor = '#FFF';
export const drawerMiniWidth = 80;
export const boxShadow = {
  boxShadow:
    '0 10px 30px -12px rgba(' +
    hexToRgb(blackColor) +
    ', 0.42), 0 4px 25px 0px rgba(' +
    hexToRgb(blackColor) +
    ', 0.12), 0 8px 10px -5px rgba(' +
    hexToRgb(blackColor) +
    ', 0.2)',
};
export const transition = {
  transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
};
export const defaultFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: '300',
  lineHeight: '1.5em',
};
export const grayColor = [
  '#999',
  '#777',
  '#3C4858',
  '#AAAAAA',
  '#D2D2D2',
  '#DDD',
  '#555555',
  '#333',
  '#eee',
  '#ccc',
  '#e4e4e4',
  '#E5E5E5',
  '#f9f9f9',
  '#f5f5f5',
  '#495057',
  '#e7e7e7',
  '#212121',
  '#c8c8c8',
  '#505050',
  '#212121',
  '#263238',
];

export const primaryColor = [
  '#9c27b0',
  '#ab47bc',
  '#8e24aa',
  '#af2cc5',
  '#7b1fa2',
];
export const primaryBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(primaryColor[0]) +
    ',.4)',
};

export const dangerColor = [
  '#f44336',
  '#ef5350',
  '#e53935',
  '#f55a4e',
  '#d32f2f',
  '#ebcccc',
  '#f2dede',
];

export const infoColor = [
  '#00acc1',
  '#26c6da',
  '#00acc1',
  '#00d3ee',
  '#0097a7',
  '#c4e3f3',
  '#d9edf7',
];
export const warningColor = [
  '#ff9800',
  '#ffa726',
  '#fb8c00',
  '#ffa21a',
  '#f57c00',
  '#faf2cc',
  '#fcf8e3',
];

export const infoBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(infoColor[0]) +
    ',.4)',
};
export const successColor = [
  '#4caf50',
  '#66bb6a',
  '#43a047',
  '#5cb860',
  '#388e3c',
  '#d0e9c6',
  '#dff0d8',
];
export const roseColor = [
  '#e91e63',
  '#ec407a',
  '#d81b60',
  '#eb3573',
  '#c2185b',
];
export const successBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(successColor[0]) +
    ',.4)',
};

export const warningBoxShadow = (warning) => {
  return {
    boxShadow:
      '0 4px 20px 0 rgba(' +
      hexToRgb(blackColor) +
      ',.14), 0 7px 10px -5px rgba(' +
      hexToRgb(warning.light) +
      ',.4)',
  };
};

export const dangerBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(dangerColor[0]) +
    ',.4)',
};
export const roseBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(roseColor[0]) +
    ',.4)',
};

export const darkBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(grayColor[19]) +
    ',.4)',
};

export const warningCardHeader = (warning) => {
  return {
    background:
      'linear-gradient(60deg, ' + warning.main + ', ' + warning.dark + ')',
    warningBoxShadow: warningBoxShadow(warning),
  };
};
export const successCardHeader = {
  background:
    'linear-gradient(60deg, ' + successColor[1] + ', ' + successColor[2] + ')',
  ...successBoxShadow,
};
export const dangerCardHeader = {
  background:
    'linear-gradient(60deg, ' + dangerColor[1] + ', ' + dangerColor[2] + ')',
  ...dangerBoxShadow,
};
export const infoCardHeader = {
  background:
    'linear-gradient(60deg, ' + infoColor[1] + ', ' + infoColor[2] + ')',
  ...infoBoxShadow,
};
export const primaryCardHeader = {
  background:
    'linear-gradient(60deg, ' + primaryColor[1] + ', ' + primaryColor[2] + ')',
  ...primaryBoxShadow,
};
export const roseCardHeader = {
  background:
    'linear-gradient(60deg, ' + roseColor[1] + ', ' + roseColor[2] + ')',
  ...roseBoxShadow,
};

export const darkCardHeader = {
  background:
    'linear-gradient(60deg, ' + grayColor[20] + ', ' + grayColor[19] + ')',
  ...darkBoxShadow,
};
export const title = {
  color: infoColor[2],
  textDecoration: 'none',
  fontWeight: '300',
  marginTop: '30px',
  marginBottom: '25px',
  minHeight: '32px',
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  '& small': {
    color: warningColor[1],
    fontSize: '65%',
    fontWeight: '400',
    lineHeight: '1',
  },
};

export const cardTitle = {
  ...title,
  marginTop: '0',
  marginBottom: '3px',
  minHeight: 'auto',
  '& a': {
    ...title,
    marginTop: '.625rem',
    marginBottom: '0.75rem',
    minHeight: 'auto',
  },
};

export const tooltip = {
  padding: '10px 15px',
  minWidth: '130px',
  color: whiteColor,
  lineHeight: '1.7em',
  background: 'rgba(' + hexToRgb(grayColor[6]) + ',0.9)',
  border: 'none',
  borderRadius: '3px',
  opacity: '1!important',
  boxShadow:
    '0 8px 10px 1px rgba(' +
    hexToRgb(blackColor) +
    ', 0.14), 0 3px 14px 2px rgba(' +
    hexToRgb(blackColor) +
    ', 0.12), 0 5px 5px -3px rgba(' +
    hexToRgb(blackColor) +
    ', 0.2)',
  maxWidth: '200px',
  textAlign: 'center',
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: '400',
  textShadow: 'none',
  textTransform: 'none',
  letterSpacing: 'normal',
  wordBreak: 'normal',
  wordSpacing: 'normal',
  wordWrap: 'normal',
  whiteSpace: 'normal',
  lineBreak: 'auto',
};

export const containerFluid = {
  paddingRight: '15px',
  paddingLeft: '15px',
  marginRight: 'auto',
  marginLeft: 'auto',
  '&:before,&:after': {
    display: 'table',
    content: '" "',
  },
  '&:after': {
    clear: 'both',
  },
};

export const container = {
  paddingRight: '15px',
  paddingLeft: '15px',
  marginRight: 'auto',
  marginLeft: 'auto',
  '@media (min-width: 768px)': {
    width: '750px',
  },
  '@media (min-width: 992px)': {
    width: '970px',
  },
  '@media (min-width: 1200px)': {
    width: '1170px',
  },
  '&:before,&:after': {
    display: 'table',
    content: '" "',
  },
  '&:after': {
    clear: 'both',
  },
};
