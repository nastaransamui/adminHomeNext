import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import avatar from '../../../public/images/faces/avatar1.jpg';

import SvgIcon from '@mui/material/SvgIcon';
import Close from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';

const useAutoComplete = (
  modelName,
  optionsUrl,
  setValues,
  values,
  arrayIdName,
  setRoleNameError,
  setUpdateRoleName,
  componentName,
  nameValue,
  componentInUse
) => {
  const { adminAccessToken } = useSelector((state) => state);
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { _id } = urlParams;
  const [openOption, setOpenOption] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  let loadingOption = openOption && stateOptions.length == 0;
  const [stateFilter, setStateFilter] = useState('');

  const handleAutocomplete = (name, newValue) => {
    switch (componentName) {
      case 'Roles':
        if (newValue == null) {
          if (_id !== undefined) {
            setUpdateRoleName((oldValue) => ({ ...oldValue, changed: false }));
            setRoleNameError(true);
          }
          setValues({ ...values, [nameValue]: '', [arrayIdName]: [] });
        } else {
          if (_id !== undefined) {
            setUpdateRoleName((oldValue) => ({
              ...oldValue,
              changed: true,
            }));
          }
          values.role_id = [];
          values.role_id.push(newValue._id);
          values.roleName = newValue.roleName;
          setRoleNameError(false);
          setValues({ ...values });
        }
        break;
      case 'Cities':
        if (newValue == null) {
          values[nameValue] = '';
          values.city_id = [];
          values.provinceName = '';
          values.province_id = [];
          values.countryName = '';
          values.country_id = [];
          if (componentInUse == 'Hotel') {
            values.countryFolder = '';
            values.countryIso2 = '';
            setRoleNameError((oldValue) => ({
              ...oldValue,
              cityName: true,
              provinceName: true,
              countryName: true,
            }));
          }
          setValues({ ...values });
        } else {
          values[nameValue] = newValue.name;
          values.city_id.push(newValue._id);
          values.province_id = [];
          values.province_id.push(newValue.state_id);
          values.provinceName = newValue.state_name;
          values.country_id = [];
          values.country_id.push(newValue.country_id);
          values.countryName = newValue.country;
          if (componentInUse == 'Hotel') {
            values.countryFolder = newValue.iso2;
            values.countryIso2 = newValue.iso2;
            setRoleNameError((oldValue) => ({
              ...oldValue,
              cityName: false,
              provinceName: false,
              countryName: false,
            }));
          }
          setValues({ ...values });
        }
        break;
      case 'Provinces':
        if (newValue == null) {
          values[nameValue] = '';
          values.province_id = [];
          values.cityName = '';
          values.city_id = [];
          setValues({ ...values });
          if (componentInUse == 'Hotel') {
            setRoleNameError((oldValue) => ({
              ...oldValue,
              provinceName: true,
              countryName: true,
            }));
          }
        } else {
          values.cityName = '';
          values.city_id = [];
          values.province_id = [];
          values.province_id.push(newValue._id);
          values.provinceName = newValue.name;
          values.country_id = [];
          values.country_id.push(newValue.country_id);
          values.countryName = newValue.country;
          if (componentInUse == 'Hotel') {
            values.countryFolder = newValue.iso2;
            values.countryIso2 = newValue.iso2;
            setRoleNameError((oldValue) => ({
              ...oldValue,
              provinceName: false,
              countryName: false,
            }));
          }
          setValues({ ...values });
        }
        break;
      case 'Countries':
        if (newValue == null) {
          values[nameValue] = '';
          values.country_id = [];
          if (componentInUse == 'Hotel') {
            values.countryFolder = '';
            values.countryIso2 = '';
            setRoleNameError((oldValue) => ({
              ...oldValue,
              countryName: true,
            }));
          }
          setValues({ ...values });
        } else {
          values.cityName = '';
          values.city_id = [];
          values.provinceName = '';
          values.province_id = [];
          values.country_id = [];
          values.country_id.push(newValue._id);
          values.countryName = newValue.name;
          if (componentInUse == 'Hotel') {
            values.countryFolder = newValue.iso2;
            values.countryIso2 = newValue.iso2;
            setRoleNameError((oldValue) => ({
              ...oldValue,
              countryName: false,
            }));
          }
          setValues({ ...values });
        }
        break;
      case 'Currencies':
        if (newValue == null) {
          setValues({ ...values, [nameValue]: '', currencyCode_id: [] });
        } else {
          values.currencyCode = newValue.currency;
          values.currencyCode_id.push(newValue._id);
          setValues({
            ...values,
          });
        }
        break;
      case 'AccountManager':
        if (newValue == null) {
          setValues({ ...values, [nameValue]: '', accountManager_id: [] });
        } else {
          values.accountManager = newValue.userName;
          values.accountManager_id.push(newValue._id);
          setValues({
            ...values,
          });
        }
        break;
    }
  };

  const sleep = (delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };

  const getOptions = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(optionsUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: modelName,
          filter: stateFilter,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setStateOptions([
          {
            roleName: response.Error,
            icon: '⚠️',
            error: true,
          },
        ]);
      } else {
        setStateOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
  };

  useEffect(() => {
    let isMount = true;
    if (!loadingOption) {
      return undefined;
    }

    (async () => {
      await sleep(1e3);
      if (isMount) {
        getOptions();
      }
    })();

    return () => {
      isMount = false;
    };
  }, [loadingOption, stateFilter]);

  useEffect(() => {
    let isMount = true;
    if (isMount && stateFilter !== '') {
      getOptions();
    }
    return () => {
      isMount = false;
    };
  }, [stateFilter]);

  const renderBox = (theme, stateOptions, classes) => {
    switch (componentName) {
      case 'Roles':
        return (
          <Fragment>
            <SvgIcon
              style={{ color: theme.palette.secondary.main }}
              sx={{ mr: 2 }}>
              <path d={`${stateOptions.icon}`} />
            </SvgIcon>
            {'  '}
            {stateOptions.roleName}{' '}
            {stateOptions.isActive ? (
              <Done className={classes.autocompleteIconDone} />
            ) : (
              <Close className={classes.autocompleteIconClose} />
            )}
          </Fragment>
        );
      case 'Cities':
        return (
          <Fragment>
            {stateOptions.emoji} {stateOptions.name} {stateOptions.state_name}{' '}
            {stateOptions.iso2}
          </Fragment>
        );
      case 'Provinces':
        return (
          <Fragment>
            {stateOptions.emoji} {stateOptions.name} {stateOptions.iso2}
          </Fragment>
        );
      case 'Countries':
        return (
          <Fragment>
            {stateOptions.emoji} {stateOptions.name} {stateOptions.iso2}
          </Fragment>
        );
      case 'Currencies':
        return (
          <Fragment>
            {stateOptions.emoji} {stateOptions.currency}{' '}
            {stateOptions.currency_name}
          </Fragment>
        );
      case 'AccountManager':
        return (
          <Fragment>
            <img
              height={30}
              width={30}
              style={{ borderRadius: '50%' }}
              src={`${stateOptions.profileImage || avatar.src}`}
              alt=''
            />
            &nbsp;&nbsp;&nbsp;
            {`${stateOptions.userName}`}
          </Fragment>
        );
    }
  };

  const getLabels = (dataOptions) => {
    switch (componentName) {
      case 'Roles':
        return dataOptions.roleName;
      case 'Cities':
      case 'Provinces':
      case 'Countries':
        return dataOptions.name;
      case 'Currencies':
        return dataOptions.currency;
      case 'AccountManager':
        return dataOptions.userName;
    }
  };

  const onBlurFunc = () => {
    switch (componentName) {
      case 'Roles':
        if (
          stateOptions.map((a) => a.roleName).indexOf(values.roleName) == -1
        ) {
          setValues({ ...values, roleName: '', role_id: [] });
        }
        break;
      case 'Cities':
        if (stateOptions.map((a) => a.name).indexOf(values.cityName) == -1) {
          setValues({ ...values, cityName: '', city_id: [] });
        }
        break;
      case 'Provinces':
        if (
          stateOptions.map((a) => a.name).indexOf(values.provinceName) == -1
        ) {
          setValues({ ...values, provinceName: '', province_id: [] });
        }
        break;
      case 'Countries':
        if (stateOptions.map((a) => a.name).indexOf(values.countryName) == -1) {
          setValues({ ...values, countryName: '', country_id: [] });
        }
        break;
      case 'Currencies':
        if (
          stateOptions.map((a) => a.currency).indexOf(values.currencyCode) == -1
        ) {
          setValues({ ...values, currencyCode: '', currencyCode_id: [] });
        }
        break;
      case 'AccountManager':
        if (
          stateOptions.map((a) => a.userName).indexOf(values.accountManager) ==
          -1
        ) {
          setValues({ ...values, accountManager: '', accountManager_id: [] });
        }
        break;
    }
  };

  return {
    openOption,
    setOpenOption,
    stateOptions,
    loadingOption,
    sleep,
    setStateFilter,
    handleAutocomplete,
    _id,
    renderBox,
    getLabels,
    onBlurFunc,
  };
};

export default useAutoComplete;
