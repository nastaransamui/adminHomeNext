import { makeStyles } from '@mui/styles';

const categoryCardStyles = makeStyles((theme) => {
  return {
    figure: {
      margin: 0,
      width: '100%',
      display: 'block',
      '& img': {
        width: '100%',
        position: 'relative',
      },
    },
    title: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: 24,
      whiteSpace: 'nowrap',
      position: 'relative',
      display: 'block',
      textOverflow: 'ellipsis',
      [theme.breakpoints.down('xs')]: {
        overflow: 'hidden',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: '28px',
      },
      '&:after': {
        content: '""',
        height: 2,
        background: theme.palette.primary.main,
        width: '0%',
        position: 'absolute',
        bottom: -10,
        zIndex: 0,
        left: '50%',
        transition: 'all 0.2s cubic-bezier(0.42, 0.16, 0.21, 0.93)',
        transitionDelay: '0.3s',
      },
    },
    property: {
      transition: 'all 0.3s cubic-bezier(0, .81, 1, .97)',
      position: 'absolute',
      width: '100%',
      height: '25%',
      padding: theme.spacing(2, 6),
      bottom: 0,
      borderRadius: 16,
      textAlign: 'left',
      left: 0,
      color: theme.palette.common.white,
      backdropFilter: 'saturate(100%) blur(10px)',
      background: 'rgba(0, 0, 0, 0.32)',
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
        bottom: 0,
        '& $descCategory': {
          display: 'none',
        },
      },
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0.5, 2),
        borderRadius: 8,
      },
    },
    categoryCard: {
      borderRadius: 16,
      marginBottom: theme.spacing(3),
      overflow: 'hidden',
      position: 'relative',
      background: theme.palette.secondary.light,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'flex-start',
      height: 250,
      [theme.breakpoints.down('xs')]: {
        height: 120,
      },
      '&:hover': {
        [theme.breakpoints.up('lg')]: {
          '& $property': {
            padding: theme.spacing(4, 6),
            '& $title': {
              '&:after': {
                width: '80%',
                left: 0,
              },
            },
            [theme.breakpoints.up('lg')]: {
              height: '80%',
              bottom: 0,
              opacity: 1,
              '& $descCategory': {
                opacity: 1,
                bottom: 0,
                height: 70,
              },
            },
          },
        },
      },
    },
    descCategory: {
      marginTop: theme.spacing(5),
      fontSize: 22,
      fontWeight: theme.typography.fontWeightRegular,
      whiteSpace: 'normal',
      height: 0,
      opacity: 0,
      display: 'block',
      overflow: 'hidden',
    },
    cardWrap: {
      position: 'relative',
    },
    fold: {
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        borderRadius: 16,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        height: 80,
        left: '47%',
        transform: 'translate(-50%)',
        boxShadow:
          theme.palette.type === 'light'
            ? '0 1.5px 12px 2px rgba(0, 0, 0, 0.06)'
            : '0px 1px 3px 0px rgba(64, 64, 64, 1), 0px 1px 1px 0px rgba(42, 42, 42, 1), 0px 2px 1px -1px rgba(20, 20, 20, 1)',
      },
      '&:before': {
        width: '80%',
        bottom: -25,
      },
      '&:after': {
        width: '90%',
        bottom: -15,
      },
    },
  };
});

export default categoryCardStyles;
