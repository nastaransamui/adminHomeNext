import { Fragment } from "react";
import { Hidden } from "@mui/material";
import { Player, BigPlayButton } from "video-react";

export default function Video({
  item,
  isMobile,
  videoRatio,
  setPlay,
  setPlayer,
}) {
  return (
    <Fragment>
      {isMobile ? <img src={item.imageMobileShow} alt="cover" /> : null}
      <Hidden mdDown>
        <Player
          autoPlay
          aspectRatio={videoRatio}
          fluid={true}
          preload="auto"
          muted
          poster={item.videoPoster}
          ref={(player) => {
            setPlay(true);
            if (player !== null) {
              setPlayer(player);
            }
          }}
        >
          <source src={item.videoLink} />
          <BigPlayButton position={"hide"} />
        </Player>
      </Hidden>
    </Fragment>
  );
}
