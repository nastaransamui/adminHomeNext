import bannerStyles from "./banner-style";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import {
  Container,
  Hidden,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import axios from "axios";
import { CircleToBlockLoading } from "react-loadingg";

import Caption from "../Caption/Caption";
import Youtube from "./Youtube";
import Video from "./Video";

export default function VideoBanner() {
  const classes = bannerStyles();
  const theme = useTheme();
  const { youTubeBanner } = useSelector((state) => state);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [play, setPlay] = useState(false);
  const [videoContent, setVideoContent] = useState([]);
  const [player, setPlayer] = useState([]);
  const [playCtrl, setPlayedCtrl] = useState(true);
  const [videoRatio, setVideoRation] = useState("5:1.4");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const video = await axios.get("/api/videos/getall");
        if (video.status == 200 && video.data?.success) {
          setVideoContent(video.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (document.body.clientWidth <= 1027) {
      setVideoRation("5:1.7");
    }
  }, []);

  const _onTogglePause = () => {
    if (youTubeBanner) {
      setPlayedCtrl(!playCtrl);
      if (playCtrl) {
        player[0].pauseVideo();
      } else {
        player[0].playVideo();
      }
    } else {
      setPlayedCtrl(!playCtrl);
      player.actions.togglePlay();
    }
  };

  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.video}>
          <div className={classes.overlay} />
          {videoContent.length == 0 && (
            <CircleToBlockLoading color={theme.palette.secondary.main} />
          )}
          {videoContent.map((item, index) => {
            return (
              <Fragment key={index.toString()}>
                {youTubeBanner ? (
                  <Youtube
                    item={item}
                    isMobile={isMobile}
                    play={play}
                    player={player}
                    setPlayer={setPlayer}
                    setPlay={setPlay}
                  />
                ) : (
                  <Video
                    item={item}
                    isMobile={isMobile}
                    videoRatio={videoRatio}
                    setPlayer={setPlayer}
                    setPlay={setPlay}
                  />
                )}
                <div className={classes.caption}>
                  <Container>
                    <Hidden mdDown>
                      {play && (
                        <IconButton
                          className={classes.btnPlay}
                          onClick={_onTogglePause}
                        >
                          {playCtrl ? (
                            <i className="ion-ios-pause-outline" />
                          ) : (
                            <i className="ion-arrow-right-b" />
                          )}
                        </IconButton>
                      )}
                    </Hidden>
                    <Caption item={item} />
                  </Container>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}
