import { makeStyles } from "@mui/styles";

const bannerStyles = makeStyles((theme) => {
  return {
    root: {
      display: "block",
      background:theme.palette.mode == "light" ? theme.palette.common.white : theme.palette.common.black,
      // height: 720,
      height: 620,
      width: "200%",
      marginLeft: "-50%",
      borderRadius: "0 0 50% 50%",
      overflow: "hidden",
      position: "relative",
      [theme.breakpoints.down("xs")]: {
        height: 640,
      },
    },
    video: {
      height: "100%",
      width: "100%",
      left: 0,
      position: "absolute",
      "& img": {
        width: "100%",
        minHeight: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        [theme.breakpoints.down("md")]: {
          objectFit: "cover",
        },
      },
      //Youtube ifrem
      "& iframe": {
        width: "100%",
        position: "relative",
        top: "-20px !important",
      },
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: "-50%",
      background: theme.palette.common.black,
      opacity: 0.5,
      width: "200%",
      height: "100%",
      zIndex: 10,
      borderRadius: "0 0 50% 50%",
    },
    caption: {
      position: "absolute",

      width: "100%",
      zIndex: 90,
      textAlign: "left",
      color: theme.palette.common.white,
      top: "55%",
      [theme.breakpoints.down("lg")]: {
        // top: "30%",
        textAlign: "center",
      },
      "&:hover": {
        "& $btnPlay": {
          opacity: 1,
        },
      },
    },
    hidden: {},
    btnPlay: {
      overflow: "visible !important",
      position: "absolute",
      top: -120,
      left: "50%",
      transform: "translate(-50%)",
      width: 80,
      height: 80,
      opacity: 0,
      transition: "opacity 0.5s ease",
      border: "3px solid #fff",
      "& i": {
        color: theme.palette.common.white,
        fontSize: 64,
        width: 64,
        height: 64,
        position: "relative",
        top: -3,
        '&[class="ion-arrow-right-b"]': {
          left: 3,
        },
      },
    },
  };
});

export default bannerStyles;
