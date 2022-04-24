import { useRef, useEffect, forwardRef, useState } from 'react';
import { Badge } from '@mui/material';

import PropTypes from 'prop-types';
import cardsShowStyles from '../cards-show-styles';
import CardHeader from '../../Card/CardHeader';
import CardAvatar from '../../Card/CardAvatar';
import { Player } from 'video-react';
import avatar from '../../../../public/images/faces/avatar1.jpg';
import { useSelector } from 'react-redux';

const Header = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const {
    modelName,
    data,
    dataGridColumns,
    movie,
    cardHeaderType,
    cardAvatarType,
    gridNumber
  } = props;
  const { profile } = useSelector((state) => state);
  const [headerWidth, setHeaderWidth] = useState(null);
  const headerRef = useRef(null)
  useEffect(() => {
    setHeaderWidth(headerRef.current.offsetWidth)
  }, [gridNumber]);
  const Image = () => {
    if (modelName == 'Users') {
      return <img src={data.profileImage || avatar.src} alt='...' />;
    } else {
      if (movie) {
        return (
          <Player
            aspectRatio='auto'
            width={headerWidth}
            height={headerWidth/2}
            fluid={false}
            preload='auto'
            muted
            src={
              dataGridColumns[0].hasVideo[0] &&
              data[dataGridColumns[0].hasVideo[1]]
            }
          />
        );
      } else {
        return (
          <img
            src={
              (dataGridColumns[0].hasAvatar[0] &&
                data[dataGridColumns[0].hasAvatar[1]]) ||
              avatar.src
            }
            alt='...'
          />
        );
      }
    }
  };

  const badgeColor = () => {
    if (modelName == 'Users') {
      return 'secondary';
    } else {
      if (data.isActive) {
        return 'secondary';
      } else {
        return 'primary';
      }
    }
  };
  return (
    <CardHeader
      icon={cardHeaderType.icon}
      image={cardHeaderType.image}
      ref={headerRef}
      color='primary'
      className={classes.cardHeaderHover}>
      <Badge
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        color={badgeColor()}
        variant='dot'
        badgeContent=' '
        invisible={modelName == 'Users' && data._id !== profile._id}>
        <CardAvatar
          profile={cardAvatarType.profile}
          plain={cardAvatarType.plain}>
          {/* pass hasAvatar true with field to first dataGridColumns*/}
          <Image />
        </CardAvatar>
      </Badge>
    </CardHeader>
  );
});

Header.propTypes = {
  modelName: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default Header;
