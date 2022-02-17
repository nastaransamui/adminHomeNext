import React from 'react';
// import SampleDashboard from './SampleDashboard/SampleDashboard';
// import ProDashboard from './ProDashboard/ProDashboard';
import { useSelector } from 'react-redux';
// import routes from "../../../routes"
import {
  BrowserRouter as Router} from 'react-router-dom';
export default function Dashboard(props) {
  const { sampleDashboardShow } = useSelector((state) => state);
  const [miniActive, setMiniActive] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const [color, setColor] = React.useState("white");
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <>
      <Router>
        {/* <ProDashboard
          {...props}
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          routes={routes}
          color={color}
          handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        /> */}
        Pro Dashboard
        </Router>
    </>
  );
}
