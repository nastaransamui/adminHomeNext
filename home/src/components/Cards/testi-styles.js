import { makeStyles } from '@mui/styles';

const testiStyles = makeStyles((theme) => {
  return {
    testimonial: {
      height: 260,
      background: theme.palette.background.paper,
      borderRadius: theme.spacing(),
      overflow: 'visible',
      border: `3px solid ${theme.palette.divider}`,
      padding: theme.spacing(4, 2),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(8),
      },
      position: 'relative',
      '& svg': {
        transform: 'translateY(-15px) rotate(-45deg)',
        width: 70,
        height: 70,
        verticalAlign: 'middle',
        fill: theme.palette.common.white,
      },
      '& h6': {
        fontWeight: theme.typography.fontWeightBold,
      },
    },
    icon: {
      borderRadius: 20,
      background: theme.palette.primary.main,
      transform: 'rotate(45deg)',
      width: 70,
      height: 70,
      top: -30,
      left: 32,
      position: 'absolute',
      textAlign: 'center',
      lineHeight: '100px',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    text: {
      marginBottom: theme.spacing(4),
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-line-clamp': 3,
      '-webkit-box-orient': 'vertical',
      height: theme.spacing(9),
    },
    caption: {
      color: theme.palette.text.secondary,
    },
  };
});

export default testiStyles;
