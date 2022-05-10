import { useState, useEffect } from 'react';
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkCookies, getCookies } from 'cookies-next';
import { useSelector } from 'react-redux';

const usePerRowHook = (storeName) => {
  const [perRow, setPerRow] = useState();
  const theme = useTheme();
  const xlRows = useMediaQuery(theme.breakpoints.only('xl'));
  const lgRows = useMediaQuery(theme.breakpoints.only('lg'));
  const mdRows = useMediaQuery(theme.breakpoints.only('md'));
  const smRows = useMediaQuery(theme.breakpoints.only('sm'));
  const xsRows = useMediaQuery(theme.breakpoints.only('xs'));

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (xlRows) setPerRow(storeName.GridView || 2);
      if (lgRows) setPerRow(storeName.GridView || 3);
      if (mdRows) setPerRow(4);
      if (smRows) setPerRow(12);
      if (xsRows) setPerRow(12);
    }
    return () => {
      isMount = false;
    };
  }, [xlRows, lgRows, mdRows, smRows, xsRows]);

  return perRow;
};

export default usePerRowHook;
