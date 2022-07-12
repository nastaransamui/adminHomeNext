import { useState, useEffect } from 'react';
import ProDashboard from '../../components/ProDashboard/ProDashboard';
// import routes from '../../../routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRouter } from 'next/router';
export default function Dashboard(props) {
  const {routes, accessRole} = props
  const [propsMiniActive, setPropsMiniActive] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bgColor, setBgColor] = useState('black');
  const router = useRouter();
  const sidebarMinimizeFunc = () => {
    setPropsMiniActive(!propsMiniActive);
    localStorage.setItem('miniActive', !propsMiniActive)
  };

  const [color, setColor] = useState('white');
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    let isMount = true;
    if (isMount && typeof window !== 'undefined') {
      setPropsMiniActive(
        JSON.parse(localStorage.getItem('miniActive')) == null
          ? false
          : JSON.parse(localStorage.getItem('miniActive'))
      );
    }
    return () => {
      isMount = false;
    };
  }, [propsMiniActive]);
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
