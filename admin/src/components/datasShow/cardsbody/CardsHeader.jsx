import { forwardRef } from 'react';
import { Badge } from '@mui/material';

import PropTypes from 'prop-types';
import cardsShowStyles from '../cards-show-styles';
import CardHeader from '../../Card/CardHeader';
import CardAvatar from '../../Card/CardAvatar';

import avatar from '../../../../public/images/faces/avatar1.jpg';
import { useSelector } from 'react-redux';

const CardsHeader = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const { modelName, data } = props;
  const { profile } = useSelector((state) => state);
  return (
    <CardHeader icon color='rose' className={classes.cardHeaderHover}>
      <Badge
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        color='secondary'
        variant='dot'
        badgeContent=' '
        invisible={modelName == 'Users' && data._id !== profile._id}>
        <CardAvatar profile>
          {/* //Todo fix the image url for global */}
          <img src={data.profileImage || avatar.src} alt='...' />
        </CardAvatar>
      </Badge>
    </CardHeader>
  );
});

CardsHeader.propTypes = {
  modelName: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default CardsHeader;
