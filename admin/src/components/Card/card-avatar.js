import { makeStyles } from '@mui/styles';

import { blackColor, hexToRgb } from '../../../theme/common';

const cardAvatarStyle = makeStyles((theme) => {
  return {
    cardAvatar: {
      '&$cardAvatarProfile img,&$cardAvatarTestimonial img': {
        width: 130,
        height: 130,
      },
    },
    cardAvatarProfile: {
      maxWidth: '130px',
      maxHeight: '130px',
      minWidth: '130px',
      minHeight: '130px',
      margin: '-50px auto 0',
      borderRadius: '50%',
      overflow: 'hidden',
      padding: '0',
      boxShadow:
        '0 16px 38px -12px rgba(' +
        hexToRgb(blackColor) +
        ', 0.56), 0 4px 25px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(blackColor) +
        ', 0.2)',
      '&$cardAvatarPlain': {
        marginTop: '0',
      },
    },
    cardAvatarPlain: {},
    cardAvatarTestimonial: {
      margin: '-50px auto 0',
      maxWidth: '100px',
      maxHeight: '100px',
      borderRadius: '50%',
      overflow: 'hidden',
      padding: '0',
      boxShadow:
        '0 16px 38px -12px rgba(' +
        hexToRgb(blackColor) +
        ', 0.56), 0 4px 25px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(blackColor) +
        ', 0.2)',
      '&$cardAvatarPlain': {
        marginTop: '0',
      },
    },
    cardAvatarTestimonialFooter: {
      marginBottom: '-50px',
      marginTop: '10px',
    },
  };
});

export default cardAvatarStyle;
