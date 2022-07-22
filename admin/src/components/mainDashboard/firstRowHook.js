import { useState, useEffect } from 'react';

import Badge from '@mui/icons-material/Badge';
import AccountBox from '@mui/icons-material/AccountBox';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Public from '@mui/icons-material/Public';
import { useDispatch, useSelector } from 'react-redux';
import alertCall from '../Hooks/useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/styles';

const getDataUrl = '/admin/api/dashboard/firstRow';

const firstRowHook = () => {
  const [mainData, setMainData] = useState([]);
  const theme = useTheme();
  const { adminAccessToken } = useSelector((state) => state);
  const dispatch = useDispatch();
  const router = useRouter();

  const getData = async () => {
    try {
      const res = await fetch(getDataUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
      });
      const { status } = res;
      const data = await res.json();
      if (status !== 200 && !data.success) {
        alertCall(theme, 'error', data.Error, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      } else {
        setMainData(data.data);
      }
    } catch (error) {
      alertCall(theme, 'error', error, () => {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        if (!checkCookies('adminAccessToken')) {
          router.push('/', undefined, { shallow: true });
        }
      });
    }
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      getData();
    }
  }, []);

  return {
    mainData,
  };
};

export default firstRowHook;
