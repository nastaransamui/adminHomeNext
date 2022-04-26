import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'react-s-alert';
import Swal from 'sweetalert2';
import usePerRowHook from '../../Hooks/usePerRowHook';
import { setCookies } from 'cookies-next';
import useSearch from '../../Hooks/useSearch';
import { getAllVideosUrl, deleteVideoUrl } from './videosStatic';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const videosHook = () => {
  const { sliderVideo, adminAccessToken } = useSelector((state) => state);
  const {
    videos,
    totalVideos,
    videosPageNumber,
    videosSortBy,
    videosCardView,
    videosPerPage,
  } = sliderVideo;

  const dispatch = useDispatch();
  const theme = useTheme();
  const { t, i18n } = useTranslation('video');
  const perRow = usePerRowHook('videosGrid');
  const { searchText, requestSearch, setSearchText, rows } = useSearch(videos);

  useEffect(() => {
    const abortController = new AbortController();
    let isMout = true;
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });

    if (isMout) {
      const getAllVideos = async () => {
        try {
          const res = await fetch(getAllVideosUrl, {
            signal: abortController.signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify({
              modelName: 'Videos',
              valuesPerPage: videosPerPage,
              valuesPageNumber: videosPageNumber,
              valuesSortByField: videosSortBy[`field`],
              valuesSortBySorting: videosSortBy[`sorting`],
              locale: i18n.language !== 'fa' ? 'en' : 'fa',
            }),
          });

          const { status } = res;
          const videos = await res.json();
          const errorText =
            videos?.ErrorCode == undefined
              ? videos.Error
              : t(`${videos?.ErrorCode}`);
          if (status !== 200 && !videos.success) {
            alertCall('error', errorText, () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            });
          } else {
            //Fixe last page if after delete number of page is wrong
            if (
              videosPageNumber >
                Math.ceil(videos.totalValuesLength / videosPerPage) &&
              videos.totalValuesLength !== 0
            ) {
              dispatch({
                type: 'SLIDER_VIDEO',
                payload: {
                  ...sliderVideo,
                  videosPageNumber: Math.ceil(
                    videos.totalValuesLength / videosPerPage
                  ),
                },
              });

              sliderVideo.videos = [];
              setCookies(
                'sliderVideo',
                JSON.stringify({
                  ...sliderVideo,
                  videosPageNumber: Math.ceil(
                    videos.totalValuesLength / videosPerPage
                  ),
                })
              );
            }
            dispatch({
              type: 'SLIDER_VIDEO',
              payload: {
                ...sliderVideo,
                videos: videos.data,
                totalVideos: videos.totalValuesLength,
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

      getAllVideos();
    }

    return () => {
      abortController.abort();
      isMout = false;
    };
  }, [totalVideos, videosPerPage, videosPageNumber, videosSortBy]);

  useEffect(() => {
    if (perRow !== undefined) {
      dispatch({
        type: 'SLIDER_VIDEO',
        payload: { ...sliderVideo, videosGrid: perRow },
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

  const sweetAlert = (video) => {
    video.modelName = 'Videos';
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
        const getAllUser = async () => {
          const res = await fetch(deleteVideoUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify(video),
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
              type: 'SLIDER_VIDEO',
              payload: {
                ...sliderVideo,
                totalVideos: response.totalValuesLength,
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
        getAllUser();
      }
    });
  };

  const paginationChange = (value) => {
    dispatch({
      type: 'SLIDER_VIDEO',
      payload: { ...sliderVideo, videosPageNumber: value },
    });

    sliderVideo.videos = [];
    setCookies(
      'sliderVideo',
      JSON.stringify({
        ...sliderVideo,
        videosPageNumber: value,
      })
    );
  };

  const perPageFunc = (list) => {
    if (Math.ceil(totalVideos / list) < videosPageNumber) {
      dispatch({
        type: 'SLIDER_VIDEO',
        payload: {
          ...sliderVideo,
          videosPerPage: Math.ceil(totalVideos / list),
        },
      });

      sliderVideo.videos = [];
      setCookies(
        'sliderVideo',
        JSON.stringify({
          ...sliderVideo,
          videosPerPage: Math.ceil(totalVideos / list),
        })
      );
    }
    dispatch({
      type: 'SLIDER_VIDEO',
      payload: { ...sliderVideo, videosPerPage: list },
    });

    sliderVideo.videos = [];
    setCookies(
      'sliderVideo',
      JSON.stringify({
        ...sliderVideo,
        videosPerPage: list,
      })
    );
  };

  const sortByFunc = (field, listNumber) => {
    dispatch({
      type: 'SLIDER_VIDEO',
      payload: {
        ...sliderVideo,
        videosSortBy: {
          field: field,
          sorting: listNumber,
        },
      },
    });

    sliderVideo.videos = [];

    setCookies(
      'sliderVideo',
      JSON.stringify({
        ...sliderVideo,
        videosSortBy: {
          field: field,
          sorting: listNumber,
        },
      })
    );
  };

  const cardViewsFunc = () => {
    // dispatch({
    //   type: 'VIDEOS_CARD_VIEW',
    //   payload: !videosCardView,
    // });
    // setCookies('videosCardView', !videosCardView);
    dispatch({
      type: 'SLIDER_VIDEO',
      payload: { ...sliderVideo, videosCardView: !videosCardView },
    });

    sliderVideo.videos = []
    setCookies(
      'sliderVideo',
      JSON.stringify({
        ...sliderVideo,
        videosCardView: !videosCardView,
      })
    );
  };

  const gridNumberFunc = (list) => {
    dispatch({
      type: 'SLIDER_VIDEO',
      payload: { ...sliderVideo, videosGrid: list },
    });
    sliderVideo.videos = []
    setCookies(
      'sliderVideo',
      JSON.stringify({
        ...sliderVideo,
        videosGrid: list,
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

export default videosHook;
