
import { useState } from "react";
import mainStyles from "./main-style";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

const MainDashboard = (props) => {
  const [openAlertAuth, setOpenAlertAuth] = useState(false);
  const classes = mainStyles()
  const { t } = useTranslation("dashboard");
  const handleClose = () => {
    logOut(authDispath, user._id);
  };

  return (
    <div className={classes.MainDashboard}>
      something
      <div className={classes.homeWidgets}>
        second something
      </div>
    </div>
  );
};

export default MainDashboard;
