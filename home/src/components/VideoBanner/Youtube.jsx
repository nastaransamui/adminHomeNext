import { Fragment } from "react";
import yt from "./youtube";
import YouTube from "react-youtube";
import { Hidden } from "@mui/material";

export default function Youtube({
  item,
  play,
  isMobile,
  player,
  setPlayer,
  setPlay,
}) {
  const opt = {
    height: "800",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: 1,
      origin: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    },
  };

  const _onReady = (event) => {
    player.push(event.target);
    setPlayer(player);
  };
  const _onEnd = (event) => {
    event.target.playVideo();
  };
  const _onPlay = () => {
    const curTime = player[0].getCurrentTime();
    if (curTime > 0) {
      setPlay(true);
    }
  };

  return (
    <Fragment>
      {!play || isMobile ? (
        <img src={item.imageMobileShow} alt="cover" />
      ) : null}
      {yt.use && (
        <Hidden mdDown>
          <YouTube
            videoId={item.youTubeId}
            opts={opt}
            onReady={_onReady}
            onEnd={_onEnd}
            onPlay={_onPlay}
          />
        </Hidden>
      )}
    </Fragment>
  );
}
