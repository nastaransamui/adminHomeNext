import sliderStyles from "./slider-style";
import { Container } from "@mui/material";
import Slider from "react-animated-slider";
import { useTranslation } from "next-i18next";
import { useTheme } from "@mui/styles";
import { useText } from "../../../theme/common";
import Caption from "../Caption/Caption";
import { useState, useEffect } from "react";
import axios from "axios";
import { CircleToBlockLoading } from "react-loadingg";

const AnimateSlider = () => {
  const classes = sliderStyles();
  const theme = useTheme();
  const [content, setContent] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const images = await axios.get("/api/sliders/getall");
        if (images.status == 200 && images.data?.success) {
          setContent(images.data.data);
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
      <div className={classes.video}>
        <div className={classes.heroContent}>
          {content.length == 0 && (
            <CircleToBlockLoading color={theme.palette.secondary.main} />
          )}
          <Slider className="slider-wrapper" autoplay={3500}>
            {content.map((item, index) => {
              return (
                <div
                  key={index.toString()}
                  className={"slider-content " + classes.sliderImage}
                  style={{
                    backgroundImage: `url('${item.image}')`,
                  }}
                >
                  <div className="inner"
                  >
                    <div className={classes.heroButtons}>
                      <Container>
                        <Caption item={item} />
                      </Container>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default AnimateSlider;
