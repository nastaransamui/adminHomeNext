import { makeStyles } from "@mui/styles";

const sliderStyles = makeStyles((theme) => {
  
  return {
    root: {
      display: "block",
      background:
        theme.palette.mode == "light"
          ? theme.palette.common.white
          : theme.palette.common.black,
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
      width: "50%",
      left: "25%",
      position: "absolute",
    },
    heroButtons: {
      position: "absolute",
      // width: "100%",
      zIndex: 90,
      textAlign: "left",
      color: theme.palette.common.white,
      top: "55%",
      [theme.breakpoints.down("xs")]: {
        top: "30%",
      },
      [theme.breakpoints.only("md")]: {
        top: -200
      },
      [theme.breakpoints.only("xl")]: {
        top: -190
      }
    },
    heroContent: {
      position: "relative",
      "& .previousButton, .nextButton":{
        color: "blue !important",
        [theme.breakpoints.only("md")]: {
          top: "27%",
        },
        [theme.breakpoints.only("xl")]: {
          top: "27%"
        }
      }
    },
    sliderImage: {
      [theme.breakpoints.only("xs")]: {
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover  !important",
      },
      [theme.breakpoints.only("sm")]: {
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover  !important",
      },
      [theme.breakpoints.only("md")]: {
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover  !important",
      },
      [theme.breakpoints.only("lg")]: {
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        height: "100vh",
      },
      [theme.breakpoints.only("xl")]: {
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        height: "100vh",
      },
    },
  };
});

export default sliderStyles;
