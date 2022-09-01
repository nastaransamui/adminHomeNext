import { Info, Flag, CheckBox, Title, Event } from '@mui/icons-material';

export const editUrl = '/admin/dashboard/main-page-setup/photos';
export const createUrl = '/admin/dashboard/main-page-setup/photos/photo';
export const getAllUrl = `/admin/api/mainPageSetup/getAll`;
export const deleteUrl = `/admin/api/modelsCrud/delete`;

export const photosFields = [
  {
    Icon: CheckBox,
    label: 'isActive',
    type: 'boolean',
    filterable: true,
  },
  {
    Icon: Info,
    label: 'title_en',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Info,
    label: 'title_fa',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Flag,
    label: 'button_en',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Flag,
    label: 'button_fa',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Title,
    label: 'subTitle_en',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Title,
    label: 'subTitle_fa',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Event,
    label: 'updatedAt',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Event,
    label: 'createdAt',
    type: 'string',
    filterable: true,
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
    hasAvatar: [true, 'imageShow'],
    hasVideo: [false, ''],
    searchAble: true,
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
    searchAble: false,
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
    searchAble: true,
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
    searchAble: false,
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
    searchAble: false,
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
    searchAble: true,
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
    searchAble: true,
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
    searchAble: true,
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
    searchAble: true,
  },
];

export const sliderImage = {
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
