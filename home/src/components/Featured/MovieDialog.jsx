import { forwardRef } from 'react';
import featureStyles from './featured-style';
import yt from '../VideoBanner/youtube';
import CloseIcon from '@mui/icons-material/Close';
import YouTube from 'react-youtube';
import {
  Zoom,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
} from '@mui/material';
import { Player, BigPlayButton } from 'video-react';

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function MovieDialog(props) {
  const classes = featureStyles();
  const { openPopup, handleClose, player, setPlayer, movieItem, router } =
    props;
  const _onReady = (event) => {
    player.push(event.target);
    setPlayer(player);
  };

  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      cc_load_policy: 0,
      hl: router.locale,
      controls: 1,
      loop: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      mute: 0,
      origin: process.env.NEXTAUTH_URL,
      fs: 1,
    },
  };
  return (
    <Dialog
      open={openPopup}
      TransitionComponent={Transition}
      keepMounted
      classes={{ paper: classes.videoPopup }}
      onClose={handleClose}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'>
      <DialogTitle id='alert-dialog-slide-title'>
        {movieItem[`title_${router.locale}`]}
        <IconButton
          onClick={() => {
            handleClose();
          }}
          className={classes.closeBtn}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {movieItem.isYoutube && yt.use ? (
          <YouTube
            videoId={movieItem.youTubeId}
            onReady={_onReady}
            opts={opts}
          />
        ) : (
          <Player
            autoPlay
            fluid={true}
            preload='auto'
            muted
            poster={movieItem.thumb}>
            <source src={movieItem.videoLink} />
            <BigPlayButton position={'hide'} />
          </Player>
        )}
      </DialogContent>
    </Dialog>
  );
}
