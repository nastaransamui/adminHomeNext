import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../../Hooks/usePerRowHook';
import usePageSearch from '../../../Hooks/usePageSearch';
import useAllResults from '../../../Hooks/useAllResults';

import alertCall from '../../../Hooks/useAlert';
import { useTheme } from '@mui/material';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const hotelHook = () => {
  const theme = useTheme();
  const router = useRouter();

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('hotels');
};

export default hotelHook;
