import { useRouter } from "next/router";
import { useText } from "../../../theme/common";
import { Grid, Typography, Button } from "@mui/material";
export default function Caption({ item }) {
  const router = useRouter();
  const text = useText();
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item md={12} xs={12}>
          <Typography className={text.subtitle2}>
            {item[`topTitle_${router.locale}`]}
          </Typography>
          <Typography variant="h2" className={text.title}>
            {item[`title_${router.locale}`]}
          </Typography>
          <Typography className={text.subtitle}>
            {item[`subTitle_${router.locale}`]}
          </Typography>
          <Button variant="contained" color="primary">
            {item[`button_${router.locale}`]}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
