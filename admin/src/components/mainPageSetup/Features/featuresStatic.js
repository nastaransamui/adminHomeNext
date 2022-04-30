import {
  Info,
  Flag,
  CheckBox,
  Title,
  Event,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';

export const editUrl = '/admin/dashboard/main-page-setup/features';
export const createUrl = '/admin/dashboard/main-page-setup/features/feature';
export const getAllUrl = `/admin/api/mainPageSetup/getAll`;
export const deleteUrl = `/admin/api/mainPageSetup/delete`;

export const featuresFields = [
  {
    Icon: CheckBox,
    label: 'isActive',
    type: 'boolean',
  },
  {
    Icon: CheckBoxOutlineBlank,
    label: 'isYoutube',
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
    width: 250,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'featureThumb'],
    hasVideo: [true, 'featureLink'],
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
    field: 'isYoutube', // Db name
    headerAlign: 'center', //
    description: 'isYoutube', //Discription from translation
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
    width: 250,
    type: 'dateTime',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
  },
  {
    field: 'updatedAt', // Db name
    headerAlign: 'center', //
    description: 'updatedAt', //Discription from translation
    width: 250,
    type: 'dateTime',
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

export const Features = {
  dataArray: [],
  dataArrayLengh: 0,
  pageNumber: 1,
  SortBy: {
    field: 'createdAt',
    sorting: -1,
  },
  CardView: true,
  PerPage: 6,
  GridView: 4,
};
