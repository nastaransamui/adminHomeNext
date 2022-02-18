import { useState, useEffect } from "react";
import useStyles from "./promotion-style";
import { Button, Hidden, Grid, Typography, Icon } from "@mui/material";
import clsx from "clsx";
import Slider from "react-animated-slider";
import { useText } from "../../../theme/common";
import axios from "axios";
import { CircleToBlockLoading } from "react-loadingg";
import { useTheme } from "@mui/styles";
import { useTranslation } from "next-i18next";

export default function Promotions(props) {
  const classes = useStyles();
  const { router } = props;
  const [content, setContent] = useState([]);
  const theme = useTheme();
  const text = useText();
  const { t } = useTranslation("home");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const promotions = await axios.get("/api/promotions/getall");
        if (promotions.status == 200 && promotions.data?.success) {
          setContent(promotions.data.data);
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
  return (
    <div className={classes.root}>
      <div className={classes.sliderWrap}>
        {content.length == 0 && (
          <CircleToBlockLoading color={theme.palette.secondary.main} />
        )}
        <Slider
          autoplay={3500}
          className="slider-wrapper"
          previousButton={
            <i
              className={clsx(classes.arrowIcon, "ion-ios-arrow-thin-right")}
            />
          }
          nextButton={
            <i
              className={clsx(classes.arrowIcon, "ion-ios-arrow-thin-right")}
            />
          }
        >
          {content.map((item, index) => {
            return (
              <div className={classes.item} key={index.toString()}>
                <div className={classes.innerBg}>
                  <div className={classes.background}>
                    <figure>
                      <img src={item.image} alt={item.title} />
                    </figure>
                  </div>
                  <Grid container className={classes.row}>
                    <Grid item sm={7} xs={12}>
                      <div className={classes.text}>
                        <Typography variant="h4">
                          <span className={text.subtitle2}>
                            {item.subtitle}
                          </span>
                          {item[`title_${router.locale}`]}
                        </Typography>
                        <p className={classes.property}>
                          <span className={classes.star}>
                            {[...Array(item.rating)].map((e, indexStar) => {
                              return (
                                <Icon
                                  className={classes.starIcon}
                                  key={indexStar.toString()}
                                >
                                  star
                                </Icon>
                              );
                            })}
                          </span>
                          {item.rating}
                        </p>
                        <article className={classes.desc}>
                          <Typography component="h6" className={text.paragraph}>
                            {item[`desc_${router.locale}`]}
                          </Typography>
                        </article>
                        <section className={classes.btnArea}>
                          <Button
                            variant="contained"
                            className={classes.btnText}
                            color="primary"
                          >
                            {t("promotion.promo_btn1")}
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                          >
                            {t("promotion.promo_btn2")}
                          </Button>
                        </section>
                      </div>
                    </Grid>
                    <Grid item sm={5} xs={12}>
                      <Hidden xsDown>
                        <div className={classes.image}>
                          <figure>
                            <img src={item.image} alt={item.title} />
                          </figure>
                        </div>
                      </Hidden>
                    </Grid>
                  </Grid>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}
