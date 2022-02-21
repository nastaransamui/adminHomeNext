import React from 'react';
// import SampleDashboard from './SampleDashboard/SampleDashboard';
// import ProDashboard from './ProDashboard/ProDashboard';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { removeCookies } from 'cookies-next';
// import routes from "../../../routes"
import {
  BrowserRouter as Router} from 'react-router-dom';
  import { useDispatch } from 'react-redux';
export default function Dashboard(props) {
  const { sampleDashboardShow } = useSelector((state) => state);
  const [miniActive, setMiniActive] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const {router} = props;
  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const dispatch = useDispatch();
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
        <Button variant='contain' onClick={()=>{
          removeCookies("adminAccessToken")
          dispatch({ type: 'ADMIN_ACCESS_TOKEN', payload: null });
          router.push('/')
        }}>Logout</Button>
        </Router>
    </>
  );
}
