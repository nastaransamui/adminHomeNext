import useStyles from "./error-style";
import { Button, Container, Grid, Typography } from "@mui/material";

export default function Error(props) {
  const classes = useStyles();
  const { errorCode, text, router, t } = props;

  return (
    <div className={classes.errorWrap}>
      <Container maxWidth="md">
        <Grid container spacing={0}>
          <Grid item md={4} xs={12}>
            <div className={classes.flex}>
              <div className={classes.deco}>
                <Typography variant="h3">{errorCode}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item md={8} xs={12}>
            <div className={classes.text}>
              <Typography variant="h4">{text}</Typography>
              <Typography>{t("404_subtitle")}</Typography>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                href={`/${router.locale}/`}
                className={classes.button}
              >
                {t("back")}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
