export const editUrl = '/admin/dashboard/rbac-data';
export const createUrl = '/admin/dashboard/rbac-data/role';
export const getAllUrl = `/admin/api/mainPageSetup/getAll`;
export const deleteUrl = `/admin/api/modelsCrud/delete`;
export const exportCsvUrl = `/admin/api/rbac/export`;
import HomeWork from '@mui/icons-material/HomeWork';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import People from '@mui/icons-material/People';

export const rolesFields = [
  {
    Icon: HomeWork,
    label: 'roleName',
    type: 'string',
    filterable: true,
  },
  {
    Icon: People,
    label: 'isActive',
    type: 'boolean',
    filterable: true,
  },
  {
    Icon: InfoIcon,
    label: 'remark',
    type: 'string',
    filterable: true,
  },
  {
    Icon: EventIcon,
    label: 'createdAt',
    type: 'string',
    filterable: true,
  },
  {
    Icon: EventIcon,
    label: 'updatedAt',
    type: 'string',
    filterable: true,
  },
  {
    Icon: InfoIcon,
    label: 'users_id',
    type: 'number',
    filterable: true,
  },
  {
    Icon: InfoIcon,
    label: 'routes',
    type: 'array',
    filterable: true,
  },
];

export const dataGridColumns = [
  {
    field: 'roleName',
    headerAlign: 'center', //
    description: 'roleName', //Discription from translation
    width: 300,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    hasIcon: [true, 'icon'],
    searchAble: true,
  },
  {
    field: 'remark',
    headerAlign: 'center', //
    description: 'remark', //Discription from translation
    width: 300,
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
    width: 200,
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
    width: 200,
    type: 'dateTime',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'isActive', // Db name
    headerAlign: 'center', //
    description: 'isActive', //Discription from translation
    width: 140,
    type: 'boolean',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'users_id', // Db name
    headerAlign: 'center', //
    description: 'users_id', //Discription from translation
    width: 140,
    type: 'array',
    arrayTotal: true,
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'routes', // Db name
    headerAlign: 'center', //
    description: 'routes', //Discription from translation
    width: 140,
    type: 'array',
    arrayTotal: true,
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
];

export const Roles = {
  dataArray: [],
  dataArrayLengh: 0,
  pageNumber: 1,
  SortBy: {
    field: 'createdAt',
    sorting: -1,
  },
  CardView: true,
  PerPage: 48,
  GridView: 4,
};
