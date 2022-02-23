import { useState } from 'react';
import ProDashboard from '../../components/ProDashboard/ProDashboard';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { removeCookies } from 'cookies-next';
import routes from '../../../routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
export default function Dashboard(props) {
  const [propsMiniActive, setPropsMiniActive] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bgColor, setBgColor] = useState('black');
  const router = useRouter()
  const sidebarMinimizeFunc = () => {
    setPropsMiniActive(!propsMiniActive);
  };
  const dispatch = useDispatch();
  const [color, setColor] = useState('white');
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <>
      <Router>
        <ProDashboard
          {...props}
          sidebarMinimizeFunc={sidebarMinimizeFunc}
          propsMiniActive={propsMiniActive}
          routes={routes}
          router={router}
          color={color}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          bgColor={bgColor}
        />
      </Router>
    </>
  );
}
