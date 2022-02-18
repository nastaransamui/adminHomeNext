import { makeStyles } from '@mui/styles';

const generalCardStyle = makeStyles((theme) => {
  return {
    property: {},
    generalCard: {
      position: 'relative',
      width: 250,
      height: 400,
      padding: 3,
      '& figure': {
        margin: 0,
        width: '100%',
        height: 170,
        borderRadius: 6,
        overflow: 'hidden',
        '& img': {
          width: '100%',
          minHeight: '100%',
        },
      },
      '& $property': {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),
        '& strong': {
          fontWeight: theme.typography.fontWeightBold,
        },
      },
    },
    desc: {
      padding: theme.spacing(2),
      '& p': {
        marginBottom: 20,
        overflow: 'hidden',
        height: 50,
      },
    },
    button: {
      width: '100%',
      borderWidth: '2px !important',
    },
    rating: {
      '& svg': {
        color: '#FFC107',
      },
    },
  };
});

export default generalCardStyle;
