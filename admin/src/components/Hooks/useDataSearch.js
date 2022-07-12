import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import avatar from '../../../public/images/faces/avatar1.jpg';
import customerAvatar from '../../../public/images/faces/Customer.png';
import alertCall from '../../components/Hooks/useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';
const getDataUrl = '/admin/api/autocomplete/search';
import { useTheme } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';

const useDataSearch = (modelName, state, dataGridColumns, setMainData) => {
  const { adminAccessToken, stringLimit } = useSelector((state) => state);
  const router = useRouter();
  const theme = useTheme();
  const [openField, setOpenField] = useState(false);
  const [dataOptions, setDataOptions] = useState([]);
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language == 'fa' ? 'fa' : 'en';
  let loadingField = openField && dataOptions.length === 0;
  const [filterValue, setFilterValue] = useState('');
  const [fieldValue, setFieldValue] = useState(
    dataGridColumns.filter((a) => a.searchAble)[0]?.field
  );

  const getData = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(getDataUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: modelName,
          fieldValue: fieldValue,
          filterValue: filterValue,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setDataOptions([
          {
            [`${fieldValue}`]: response.Error,
            emoji: '⚠️',
            error: true,
            _id: 0,
          },
        ]);
        if (!checkCookies('adminAccessToken')) {
          alertCall(theme, 'error', response.Error, () => {
            router.push('/', undefined, { shallow: true });
          });
        }
      } else {
        setMainData([...response.data]);
        setDataOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
  };

  useEffect(() => {
    let isMount = true;
    if (isMount && filterValue !== '') {
      getData();
    }
    if (filterValue == '') {
      setDataOptions([]);
      setMainData(state?.dataArray);
    }
    return () => {
      isMount = false;
    };
  }, [filterValue]);

  const handleAutocomplete = (newValue) => {
    switch (modelName) {
      case 'Cities':
      case 'Provinces':
      case 'Countries':
      case 'global_countries':
        setFilterValue(
          newValue !== null ? newValue[`${fieldValue}`] || '' : ''
        );
        break;
      case 'global_currencies':
      case 'Currencies':
        setFilterValue(
          newValue !== null ? newValue[`${fieldValue}`] || '' : ''
        );
        break;
      case 'Features':
      case 'Photos':
      case 'Videos':
      case 'Users':
        setFilterValue(
          newValue !== null ? newValue[`${fieldValue}`] || '' : ''
        );
        break;
      case 'Agencies':
        if (fieldValue !== 'phones') {
          setFilterValue(
            newValue !== null ? newValue[`${fieldValue}`] || '' : ''
          );
        } else {
          setFilterValue(
            newValue !== null ? newValue[`${fieldValue}`][0].number || '' : ''
          );
        }
        break;
      case 'Roles':
        setFilterValue(
          newValue !== null ? newValue[`${fieldValue}`] || '' : ''
        );
        break;
    }
  };

  const showValuesData = (dataOptions) => {
    switch (modelName) {
      case 'Cities':
        return `${dataOptions.emoji} ${dataOptions.name} ${dataOptions.state_name} ${dataOptions.iso2}`;
      case 'Provinces':
        return `${dataOptions.emoji} ${dataOptions.name} ${dataOptions.iso2}`;
      case 'Countries':
      case 'global_countries':
        return `${dataOptions.emoji} ${dataOptions.name} ${dataOptions.iso2} ${
          dataOptions[`${fieldValue}`]
        }`;
      case 'global_currencies':
      case 'Currencies':
        return `${dataOptions.emoji} ${dataOptions.currency_name} ${
          dataOptions[`${fieldValue}`]
        }`;
      case 'Features':
        return (
          <>
            <img
              height={30}
              width={30}
              style={{ borderRadius: '50%' }}
              src={`${dataOptions.featureThumb}`}
              alt=''
            />
            &nbsp;&nbsp;&nbsp;
            {`${dataOptions[fieldValue]}`}
          </>
        );
      case 'Photos':
        return (
          <>
            <img
              height={30}
              width={30}
              style={{ borderRadius: '50%' }}
              src={`${dataOptions.imageShow}`}
              alt=''
            />
            &nbsp;&nbsp;&nbsp;
            {`${dataOptions[fieldValue]}`}
          </>
        );
      case 'Videos':
        return (
          <>
            <img
              height={30}
              width={30}
              style={{ borderRadius: '50%' }}
              src={`${dataOptions.videoPoster}`}
              alt=''
            />
            &nbsp;&nbsp;&nbsp;
            {`${dataOptions[fieldValue]}`}
          </>
        );
      case 'Users':
        return (
          <>
            <img
              height={30}
              width={30}
              style={{ borderRadius: '50%' }}
              src={`${dataOptions.profileImage || avatar.src}`}
              alt=''
            />
            &nbsp;&nbsp;&nbsp;
            {`${dataOptions[fieldValue]}`}
          </>
        );
      case 'Agencies':
        if (typeof dataOptions[fieldValue] == 'number') {
          return (
            <>
              <img
                height={30}
                width={30}
                style={{ borderRadius: '50%' }}
                src={`${dataOptions.logoImage || customerAvatar.src}`}
                alt=''
              />
              &nbsp;&nbsp;&nbsp;
              {`${dataOptions.agentName} ${dataOptions[
                fieldValue
              ].toLocaleString()} ${dataOptions?.currencyCode}`}
            </>
          );
        }
        if (fieldValue !== 'phones') {
          return (
            <>
              <img
                height={30}
                width={30}
                style={{ borderRadius: '50%' }}
                src={`${dataOptions.logoImage || customerAvatar.src}`}
                alt=''
              />
              &nbsp;&nbsp;&nbsp;
              {`${dataOptions.agentName} ${dataOptions[fieldValue]}`}
            </>
          );
        } else {
          const phoneValue = dataOptions[fieldValue].map((a, i) => {
            return `${dataOptions.agentName} ${a.number} ${a.tags[0]} ${a.remark} \n`;
          });
          return (
            <>
              <img
                height={30}
                width={30}
                style={{ borderRadius: '50%' }}
                src={`${dataOptions.logoImage || customerAvatar.src}`}
                alt=''
              />
              &nbsp;&nbsp;&nbsp;
              {phoneValue}
            </>
          );
        }
      case 'Roles':
        return (
          <>
            <SvgIcon>
              <path d={`${dataOptions.icon}`} />
            </SvgIcon>
            &nbsp;&nbsp;&nbsp;
            {`${dataOptions.roleName} - ${dataOptions.routes.length} - ${t(
              'routes'
            )} - ${
              dataOptions.remark.length > 0
                ? `${dataOptions.remark.slice(0, stringLimit)}...`
                : ''
            }`}
          </>
        );
    }
  };

  const getLabels = (dataOptions) => {
    switch (modelName) {
      case 'Cities':
      case 'Provinces':
      case 'Countries':
      case 'global_countries':
        return dataOptions.name;
      case 'global_currencies':
      case 'Currencies':
        return dataOptions.currency_name;
      case 'Features':
      case 'Photos':
      case 'Videos':
        return dataOptions.title_en;
      case 'Users':
        return dataOptions.userName;
      case 'Agencies':
        return dataOptions.agentName;
      case 'Roles':
        return dataOptions.roleName;
    }
  };

  return {
    openField,
    setOpenField,
    loadingField,
    dataOptions,
    showValuesData,
    filterValue,
    fieldValue,
    setFilterValue,
    setFieldValue,
    getLabels,
    handleAutocomplete,
  };
};

export default useDataSearch;
