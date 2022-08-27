import makeStyles from '@mui/styles/makeStyles';
const imagesStyle = makeStyles((theme) => {
  return {
    root: {
      '& .Mui-error': {
        '&:after': {
          border: 'none',
        },
        '&:before': {
          border: 'none',
        },
      },
    },
    heroContent: {
      '& .image-gallery-slides': {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 5,
      },
      '& .image-gallery-thumbnail': {
        borderRadius: 5,
        '&:hover': {
          border: `2px solid ${theme.palette.secondary.main}`,
          borderRadius: 5,
        },
      },
      '& .active': {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: 5,
      },
      '& .image-gallery-thumbnail-image': {
        borderRadius: 5,
      },
    },
    thumbnail: {
      position: 'absolute',
      width: 250,
      height: 250,
      left: -45,
      top: -43,
      transform: `rotateY(${theme.direction == 'rtl' ? 177 : 0}deg)`,
      [theme.breakpoints.down('sm')]: {
        left: -45,
      },
    },
    thumbnailThumb: {
      position: 'absolute',
      width: 30,
      height: 30,
      left: -6,
      top: -6,
      transform: `rotateY(${theme.direction == 'rtl' ? 177 : 0}deg)`,
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 30,
      boxSizing: 'border-box',
      padding: `10px 20px`,
      fontWeight: 400,
      fontSize: 12,
      color: theme.palette.primary.contrastText,
      marginBottom: 5,
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
      },
      [theme.breakpoints.down('sm')]: {
        backgroundColor: 'blue',
        padding: `5px 10px`,
        fontSize: 11,
      },
    },
    closeDialog: {
      right: 12,
      top: 8,
      position: 'absolute',
    },
    muiChip: {
      margin:
        theme.direction == 'ltr'
          ? `0px 5px 0 -6px !important`
          : `0px 5px 0 -10px !important`,
    },
  };
});
export default imagesStyle;
