import { makeStyles } from '@mui/styles';

const headingStyles = makeStyles((theme) => {
  return {
    heading: {
      marginBottom: '30px',
    },
    rightTextAlign: {
      textAlign: 'right',
    },
    leftTextAlign: {
      textAlign: 'left',
    },
    centerTextAlign: {
      textAlign: 'center',
    },
    title: {
      marginTop: '10px',
      color: theme.palette.text.color,
      textDecoration: 'none',
    },
    category: {
      margin: '0 0 10px',
    },
  };
});

export default headingStyles;
