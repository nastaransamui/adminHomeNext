import {
  Info,
  Flag,
  CheckBox,
  Title,
  Event,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';

export const editUrl = '/admin/dashboard/main-page-setup/videos';
export const createUrl = '/admin/dashboard/main-page-setup/videos/video';
export const getAllVideosUrl = `/admin/api/mainPageSetup/getAll`;
export const deleteVideoUrl = `/admin/api/mainPageSetup/delete`;

export const videosFields = [
  {
    Icon: CheckBox,
    label: 'isActive',
    type: 'boolean',
  },
  {
    Icon: CheckBoxOutlineBlank,
    label: 'youTubeBanner',
    type: 'boolean',
  },
  {
    Icon: Info,
    label: 'title_en',
    type: 'string',
  },
  {
    Icon: Info,
    label: 'title_fa',
    type: 'string',
  },
  {
    Icon: Flag,
    label: 'button_en',
    type: 'string',
  },
  {
    Icon: Flag,
    label: 'button_fa',
    type: 'string',
  },
  {
    Icon: Title,
    label: 'subTitle_en',
    type: 'string',
  },
  {
    Icon: Title,
    label: 'subTitle_fa',
    type: 'string',
  },
  {
    Icon: Event,
    label: 'updatedAt',
    type: 'string',
  },
  {
    Icon: Event,
    label: 'createdAt',
    type: 'string',
  },
  {
    Icon: Title,
    label: 'youTubeId',
    type: 'string',
  },
];

export const dataGridColumns = [
  {
    field: 'title_en', // Db name
    headerAlign: 'center', //
    description: 'title_en', //Discription from translation
    width: 200,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'videoPoster'],
    hasVideo: [true, 'videoLink'],
  },
  {
    field: 'isActive', // Db name
    headerAlign: 'center', //
    description: 'isActive', //Discription from translation
    width: 120,
    type: 'boolean',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'youTubeBanner', // Db name
    headerAlign: 'center', //
    description: 'youTubeBanner', //Discription from translation
    width: 120,
    type: 'boolean',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'title_fa', // Db name
    headerAlign: 'center', //
    description: 'title_fa', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'createdAt', // Db name
    headerAlign: 'center', //
    description: 'createdAt', //Discription from translation
    width: 150,
    type: 'dateTime',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'updatedAt', // Db name
    headerAlign: 'center', //
    description: 'updatedAt', //Discription from translation
    width: 150,
    type: 'dateTime',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'button_en', // Db name
    headerAlign: 'center', //
    description: 'button_en', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'button_fa', // Db name
    headerAlign: 'center', //
    description: 'button_fa', //Discription from translation
    width: 130,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'subTitle_en', // Db name
    headerAlign: 'center', //
    description: 'subTitle_en', //Discription from translation
    width: 220,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'subTitle_fa', // Db name
    headerAlign: 'center', //
    description: 'subTitle_fa', //Discription from translation
    width: 200,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'youTubeId', // Db name
    headerAlign: 'center', //
    description: 'youTubeId', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [true, 'youTubeId'],
  },
];

export const sliderVideo = {
  videos: [],
  totalVideos: 0,
  videosPageNumber: 1,
  videosSortBy: {
    field: 'createdAt',
    sorting: -1,
  },
  videosCardView: true,
  videosPerPage: 6,
  videosGrid: 4,
};
