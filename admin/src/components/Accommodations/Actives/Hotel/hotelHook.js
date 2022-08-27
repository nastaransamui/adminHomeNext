import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import alertCall from '../../../Hooks/useAlert';
import { useTheme } from '@mui/material';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { useHistory } from 'react-router-dom';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
} from 'react-google-maps';
import { getHotelUrl, pushUrl, createUrl, editUrl } from './hotelStatic';

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const hotelHook = (reactRoutes) => {
  const theme = useTheme();
  const router = useRouter();
  const location = useLocation();
  const history = useHistory();
  const { adminAccessToken, profile } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('hotels');
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { _id } = urlParams;
  const hotelRoute = reactRoutes.filter((a) => a.componentName == 'Hotel')[0];
  const hotelsRoute = reactRoutes.filter((a) => a.componentName == 'Hotels')[0];
  if (!hotelsRoute.crud[0]?.active) {
    pushUrl = '/admin/dashboard';
  }
  const [values, setValues] = useState({
    Giataid: '',
    address: '',
    cityName: '',
    city_id: [],
    countryFolder: '',
    countryIso2: '',
    countryName: '',
    country_id: [],
    email: '',
    facilities_id: [],
    fax: '',
    finalFolder: 'hotels',
    folderId: makeid(20),
    hotelId: new Date().getTime(),
    hotelImages: [],
    hotelName: '',
    hotelRating: '',
    hotelThumb: '',
    isActive: true,
    latitude: '',
    longitude: '',
    phones: '',
    provinceName: '',
    province_id: [],
    rooms_id: [],
    url: '',
    userCreated: [profile._id],
    userUpdated: [profile._id],
    _id: _id || '',
    remark: '',
    modelName: 'Hotels',
    imageKey: [],
  });

  const [fileObjects, setFileObjects] = useState([]);
  const [errorRequied, setErrorRequied] = useState({
    hotelId: false,
    hotelName: false,
    hotelRating: false,
    email: false,
    cityName: false,
    provinceName: false,
    countryName: false,
    hotelThumb: false,
  });

  const getHotel = async () => {
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
    const res = await fetch(getHotelUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Brearer ${adminAccessToken}`,
      },
      body: JSON.stringify({
        _id: _id,
        modelName: 'Hotels',
      }),
    });
    const { status } = res;
    if (status !== 200 && !res.ok) {
      const { Error } = await res.json();
      alertCall(
        theme,
        'error',
        t(`${Error}`, { ns: 'common' }) || res.statusText,
        () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
          if (Error == 'Notfind') {
            history.push(pushUrl);
          }
        }
      );
    } else {
      const response = await res.json();
      delete response.data.__v;
      imageToBlob(response.data.hotelImages);
      setValues({ ...response.data, modelName: 'Hotels', deletedImage: [] });
      dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
    }
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (_id !== undefined) {
        //Hotel information is inside location.state and will use it
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        if (location.state !== undefined) {
          delete location?.state.__v;
          setValues({
            ...location.state,
            modelName: 'Hotels',
            deletedImage: [],
          });
          imageToBlob(location.state.hotelImages);
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        } else {
          getHotel();
        }
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);

  //Create file from Images
  const imageToBlob = async (imgArr) => {
    let newImageObj = [];
    await imgArr.map(async (element) => {
      const response = await fetch(element);
      const linkOfImageArray = element.split('/');
      const fileName = linkOfImageArray[linkOfImageArray.length - 1];
      const blob = await response.blob();
      const file = new File([blob], `${fileName}`, { type: blob.type });
      newImageObj.push({
        thumbnail: element,
        data: element,
        file: file,
      });
      setFileObjects(newImageObj);
    });
  };

  const formSubmit = async () => {
    if (_id == undefined) {
      //Create Hotel
      try {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const res = await fetch(createUrl, {
          method: 'POST',
          headers: {
            token: `Brearer ${adminAccessToken}`,
          },
          body: toFormData(values),
        });
        const { status } = res;

        if (status !== 200 && !res.ok) {
          const { Error } = await res.json();
          alertCall(
            theme,
            'error',
            t(`${Error}`, { ns: 'common' }) || res.statusText,
            () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              }
            }
          );
        } else {
          const response = await res.json();
          alertCall(
            theme,
            'success',
            `${response.data.hotelName} ${t('hotelCreateSuccess')}`,
            () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              } else {
                history.push(pushUrl);
              }
            }
          );
        }
      } catch (error) {
        alertCall(theme, 'error', error, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      }
    } else {
      //Edit Hotel
      values.userUpdated = [profile._id];
      console.log(values);
      try {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const res = await fetch(editUrl, {
          method: 'POST',
          headers: {
            token: `Brearer ${adminAccessToken}`,
          },
          body: toFormData(values),
        });
        const { status } = res;
        if (status !== 200 && !res.ok) {
          const { Error } = await res.json();
          alertCall(
            theme,
            'error',
            t(`${Error}`, { ns: 'common' }) || res.statusText,
            () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              }
            }
          );
        } else {
          const response = await res.json();
          alertCall(
            theme,
            'success',
            `${response.data.hotelName} ${t('hotelEditSuccess')}`,
            () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              } else {
                history.push(pushUrl);
              }
            }
          );
        }
      } catch (error) {
        alertCall(theme, 'error', error, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      }
    }
  };

  const RegularMap = useMemo(() => {
    return withScriptjs(
      withGoogleMap(() => (
        <GoogleMap
          defaultZoom={10}
          onClick={(t) => {
            setValues((oldValue) => {
              return {
                ...oldValue,
                latitude: t.latLng.lat(),
                longitude: t.latLng.lng(),
              };
            });
          }}
          defaultCenter={{
            lat: values.latitude !== '' ? parseFloat(values.latitude) : 0,
            lng: values.longitude !== '' ? parseFloat(values.longitude) : 0,
          }}
          defaultOptions={{
            scrollwheel: true,
          }}>
          <Marker
            position={{
              lat: parseFloat(values.latitude),
              lng: parseFloat(values.longitude),
            }}
          />
        </GoogleMap>
      ))
    );
  }, [values.latitude, values.longitude, theme]);

  const isPublicDataValidated = () => {
    return true;
    switch ('') {
      case values.hotelId:
      case values.hotelName:
      case values.hotelRating:
      case values.email:
        if (values.hotelId == '') {
          setErrorRequied((oldValue) => ({ ...oldValue, hotelId: true }));
        }
        if (values.hotelName == '') {
          setErrorRequied((oldValue) => ({ ...oldValue, hotelName: true }));
        }
        if (values.hotelRating == '') {
          setErrorRequied((oldValue) => ({ ...oldValue, hotelRating: true }));
        }
        if (values.email == '') {
          setErrorRequied((oldValue) => ({ ...oldValue, email: true }));
        }
        return false;
      default:
        if (
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,3}))$/.test(
            values.email
          )
        ) {
          return true;
        }
        return false;
    }
  };

  const handleChange = (name) => (event) => {
    if (typeof values[name] == 'boolean') {
      setValues({ ...values, [name]: !values[name] });
    } else {
      setErrorRequied((oldValue) => ({ ...oldValue, [name]: false }));
      setValues({ ...values, [name]: event.target.value });
    }
  };

  const isLocationDataValidated = () => {
    return true;
    switch ('') {
      case values.cityName:
      case values.provinceName:
      case values.countryName:
        if (values.cityName == '') {
          setErrorRequied((oldValue) => ({ ...oldValue, cityName: true }));
        }
        if (values.provinceName == '') {
          setErrorRequied((oldValue) => ({ ...oldValue, provinceName: true }));
        }
        if (values.countryName == '') {
          setErrorRequied((oldValue) => ({ ...oldValue, countryName: true }));
        }
        return false;
      default:
        return true;
    }
  };

  const imageChanged = (files) => {
    if (Array.isArray(files)) {
      //Delete image
      values.hotelImages = files;
      setValues({ ...values });
    } else {
      values.hotelImages.push(files);
      setValues({ ...values });
    }
  };

  const isImageValidate = () => {
    if (values.hotelImages.length > 0 && values.hotelThumb == '') {
      setErrorRequied((oldValue) => ({ ...oldValue, hotelThumb: true }));
      return false;
    } else {
      return true;
    }
  };

  const onImageAdd = (newFileObjs) => {
    newFileObjs.map((a) => {
      a.thumbnail = a.data;
      const random = (Math.random() + 1).toString(36).substring(7);
      const file = a.file;
      let blob = file.slice(0, file.size, file.type);
      let newFile = new File([blob], file.name, {
        type: file.type,
      });
      imageChanged(newFile);
      setFileObjects([].concat(fileObjects, newFileObjs));
    });
  };

  const onImageDelete = (deleteFileObj) => {
    const index = fileObjects.indexOf(deleteFileObj);
    if (index !== -1) {
      fileObjects.splice(index, 1);
      values.hotelImages.splice(index, 1);
      values.imageKey.splice(index, 1);
      imageChanged(values.hotelImages);
      setFileObjects(fileObjects);
    }
  };

  const onThumbButtonClick = (slide, isThumbImage) => {
    if (values.hotelThumb !== '' && isThumbImage) {
      values.hotelThumb = '';
      setValues({ ...values });
      if (values.hotelImages.length > 0) {
        setErrorRequied((oldValue) => ({
          ...oldValue,
          hotelThumb: true,
        }));
      }
    } else {
      if (slide.data.startsWith('data')) {
        values.hotelThumb = slide.file;
      } else {
        values.hotelThumb = slide.data;
      }
      setValues({ ...values });
      setErrorRequied((oldValue) => ({
        ...oldValue,
        hotelThumb: false,
      }));
    }
  };

  const onDeleteButtonClick = (index, isThumbImage) => {
    if (_id !== undefined) {
      values.deletedImage.push(...values.imageKey.splice(index, 1));
    }
    // console.log(...values.imageKey.splice(index, 1));
    // values.deletedImage.push(...values.imageKey.splice(index, 1));
    // console.log(values.deletedImage);
    fileObjects.splice(index, 1);
    values.hotelImages.splice(index, 1);
    if (isThumbImage) {
      values.hotelThumb = '';
    }
    if (values.hotelImages.length == 0) {
      setErrorRequied((oldValue) => ({
        ...oldValue,
        hotelThumb: false,
      }));
    }
    imageChanged(values.hotelImages);
    setFileObjects(fileObjects);
  };

  console.log(values);

  return {
    formSubmit,
    values,
    setValues,
    _id,
    isPublicDataValidated,
    hotelRoute,
    handleChange,
    errorRequied,
    setErrorRequied,
    isLocationDataValidated,
    RegularMap,
    imageChanged,
    isImageValidate,
    fileObjects,
    setFileObjects,
    onImageAdd,
    onImageDelete,
    onThumbButtonClick,
    onDeleteButtonClick,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce((d, e) => {
    if (e[0] == 'country_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'province_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'city_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'facilities_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'rooms_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (o._id !== '' && e[0] == 'hotelThumb') {
      console.log(e[1]);
      typeof e[1] == 'object' && d.append('hotelThumb', e[1]);
    }
    if (o._id !== '') {
      // if (e[0] == 'imageKey') {
      //   e[1] = JSON.stringify(e[1]);
      // }
      if (e[0] == 'deletedImage') {
        e[1] = JSON.stringify(e[1]);
      }
      if (e[0] == 'hotelImages') {
        //On Edit seperate files from string
        const files = e[1].filter(function (obj) {
          return typeof obj !== 'string';
        });
        //Stringfy the string part
        e[1] = JSON.stringify(
          e[1].filter(function (obj) {
            return typeof obj == 'string';
          })
        );
        // loop throw files and append to formdata
        for (let i = 0; i < files.length; i++) {
          if (typeof files[i] == 'object') {
            d.append('hotelImages', files[i]);
          }
        }
      }
    }
    if (o._id == '') {
      //On create append all files to formData
      if (e[0] == 'hotelImages') {
        if (e[1].length > 0) {
          for (let i = 0; i < e[1].length; i++) {
            d.append('hotelImages', e[1][i]);
          }
        } else {
          e[1] = JSON.stringify(e[1]);
        }
      }
    }
    if (e[0] == 'imageKey') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'userCreated') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'userUpdated') {
      e[1] = JSON.stringify(e[1]);
    }
    return d.append(...e), d;
  }, new FormData());
}

export default hotelHook;
