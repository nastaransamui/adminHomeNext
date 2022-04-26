import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'react-s-alert';
import Swal from 'sweetalert2';
import usePerRowHook from '../../Hooks/usePerRowHook';
import { setCookies } from 'cookies-next';
import useSearch from '../../Hooks/useSearch';
import { getAllUrl, deleteUrl } from './photosStatic';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const photosHook = () => {
  const { adminAccessToken, sliderImage } = useSelector((state) => state);
  const {
    photos,
    totalPhotos,
    photosPageNumber,
    photosSortBy,
    photosCardView,
    photosPerPage,
  } = sliderImage;

  const dispatch = useDispatch();
  const theme = useTheme();
  const { t, i18n } = useTranslation('photos');
  const perRow = usePerRowHook('photosGrid');
  const { searchText, requestSearch, setSearchText, rows } = useSearch(photos);

  useEffect(() => {
    const abortController = new AbortController();
    let isMout = true;
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });

    if (isMout) {
      const getAllPhotos = async () => {
        try {
          const res = await fetch(getAllUrl, {
            signal: abortController.signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify({
              modelName: 'Photos',
              valuesPerPage: photosPerPage,
              valuesPageNumber: photosPageNumber,
              valuesSortByField: photosSortBy[`field`],
              valuesSortBySorting: photosSortBy[`sorting`],
              locale: i18n.language !== 'fa' ? 'en' : 'fa',
            }),
          });

          const { status } = res;
          const photos = await res.json();
          const errorText =
            photos?.ErrorCode == undefined
              ? photos.Error
              : t(`${photos?.ErrorCode}`);
          if (status !== 200 && !photos.success) {
            alertCall('error', errorText, () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            });
          } else {
            //Fixe last page if after delete number of page is wrong
            if (
              photosPageNumber >
                Math.ceil(photos.totalValuesLength / photosPerPage) &&
              photos.totalValuesLength !== 0
            ) {
              dispatch({
                type: 'SLIDER_IMAGE',
                payload: {
                  ...sliderImage,
                  photosPageNumber: Math.ceil(
                    photos.totalValuesLength / photosPerPage
                  ),
                },
              });

              sliderImage.photos =[]
              setCookies(
                'sliderImage',
                JSON.stringify({
                  ...sliderImage,
                  photosPageNumber: Math.ceil(
                    photos.totalValuesLength / photosPerPage
                  ),
                })
              );
            }
            dispatch({
              type: 'SLIDER_IMAGE',
              payload: {
                ...sliderImage,
                photos: photos.data,
                totalPhotos: photos.totalValuesLength,
              },
            });
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          }
        } catch (e) {
          abortController.abort();
          alertCall('error', e.toString(), () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          });
        }
      };

      getAllPhotos();
    }

    return () => {
      abortController.abort();
      isMout = false;
    };
  }, [totalPhotos, photosPerPage, photosPageNumber, photosSortBy]);

  useEffect(() => {
    if (perRow !== undefined) {
      dispatch({
        type: 'SLIDER_IMAGE',
        payload: { ...sliderImage, photosGrid: perRow },
      });
    }
  }, [perRow]);

  const alertCall = (type, message, callback) => {
    const backgroundColor =
      type == 'error' ? theme.palette.error.dark : theme.palette.secondary.main;
    Alert[type]('', {
      customFields: {
        message: `${message}`,
        styles: {
          backgroundColor: backgroundColor,
          color: 'black',
          zIndex: 9999,
        },
      },
      onClose: function () {
        callback();
      },
      timeout: 'none',
      position: 'bottom',
      effect: 'bouncyflip',
    });
  };

  const sweetAlert = (photo) => {
    photo.modelName = 'Photos';
    Swal.fire({
      title: `${t('deleteTitle')}`,
      text: `${t('confirmDelete')}`,
      showCancelButton: true,
      background: theme.palette.background.default,
      confirmButtonColor: theme.palette.secondary.main,
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: `<i class="fa fa-thumbs-up" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('confirmDeleteButton')}<span>`,
      cancelButtonText: `<i class="fa fa-thumbs-down" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('cancelDeleteButton')}<span>`,
      color: theme.palette.text.color,
      icon: 'question',
      showClass: {
        popup: 'animate__animated animate__zoomInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOutDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const getAllPhotos = async () => {
          const res = await fetch(deleteUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify(photo),
          });
          const { status } = res;
          const response = await res.json();
          if (status !== 200 && !res.ok) {
            alertCall('error', res.statusText, () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            });
          } else {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            dispatch({
              type: 'SLIDER_IMAGE',
              payload: {
                ...sliderImage,
                totalPhotos: response.totalValuesLength,
              },
            });
            Swal.fire({
              title: t('deleted'),
              ext: t('deleteSuccess'),
              icon: 'success',
              confirmButtonColor: theme.palette.primary.main,
              background: theme.palette.background.default,
              color: theme.palette.text.color,
              showClass: {
                popup: 'animate__animated animate__fadeInDown',
              },
              hideClass: {
                popup: 'animate__animated animate__zoomOutDown',
              },
            });
          }
        };
        getAllPhotos();
      }
    });
  };

  const paginationChange = (value) => {
    dispatch({
      type: 'SLIDER_IMAGE',
      payload: { ...sliderImage, photosPageNumber: value },
    });

    sliderImage.photos = []
    setCookies(
      'sliderImage',
      JSON.stringify({
        ...sliderImage,
        photosPageNumber: value,
      })
    );

  };

  const perPageFunc = (list) => {
    if (Math.ceil(totalPhotos / list) < photosPageNumber) {
      dispatch({
        type: 'SLIDER_IMAGE',
        payload: {
          ...sliderImage,
          photosPerPage: Math.ceil(totalPhotos / list),
        },
      });

      sliderImage.photos = []
      setCookies(
        'sliderImage',
        JSON.stringify({
          ...sliderImage,
          photosPerPage: Math.ceil(totalPhotos / list),
        })
      );
    }

    dispatch({
      type: 'SLIDER_IMAGE',
      payload: { ...sliderImage, photosPerPage: list },
    });

     sliderImage.photos = []
    setCookies(
      'sliderImage',
      JSON.stringify({
        ...sliderImage,
        photosPerPage: list,
      })
    );
  };

  const sortByFunc = (field, listNumber) => {
    dispatch({
      type: 'SLIDER_IMAGE',
      payload: {
        ...sliderImage,
        photosSortBy: {
          field: field,
          sorting: listNumber,
        },
      },
    });

    sliderImage.photos = []

    setCookies(
      'sliderImage',
      JSON.stringify({
        ...sliderImage,
        photosSortBy: {
          field: field,
          sorting: listNumber,
        },
      })
    );
  };

  const cardViewsFunc = () => {
    dispatch({
      type: 'SLIDER_IMAGE',
      payload: { ...sliderImage, photosCardView: !photosCardView },
    });

    sliderImage.photos = []
    setCookies(
      'sliderImage',
      JSON.stringify({
        ...sliderImage,
        photosCardView: !photosCardView,
      })
    );
  };

  const gridNumberFunc = (list) => {
    dispatch({
      type: 'SLIDER_IMAGE',
      payload: { ...sliderImage, photosGrid: list },
    });
    sliderImage.photos = []
    setCookies(
      'sliderImage',
      JSON.stringify({
        ...sliderImage,
        photosGrid: list,
      })
    );
  };

  return {
    alertCall,
    sweetAlert,
    searchText,
    requestSearch,
    setSearchText,
    rows,
    paginationChange,
    perPageFunc,
    sortByFunc,
    cardViewsFunc,
    gridNumberFunc,
  };
};

export default photosHook;
