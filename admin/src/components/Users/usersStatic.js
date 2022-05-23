import BadgeIcon from '@mui/icons-material/Badge';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import People from '@mui/icons-material/People';
import Public from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const editUrl = '/admin/dashboard/user-page';
export const createUrl = '/admin/dashboard/user-page/user';
export const getAllUrl = `/admin/api/mainPageSetup/getAll`;
export const deleteUrl = `/admin/api/mainPageSetup/delete`;
export const exportCsvUrl = `/admin/api/users/export`;
export const userFields = [
  {
    Icon: AccountCircleIcon,
    label: 'userName',
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
    Icon: BadgeIcon,
    label: 'firstName',
    type: 'string',
    filterable: true,
  },
  {
    Icon: BadgeIcon,
    label: 'lastName',
    type: 'string',
    filterable: true,
  },
  {
    Icon: LocationCityIcon,
    label: 'city',
    type: 'string',
    filterable: true,
  },
  {
    Icon: LocationCityIcon,
    label: 'province',
    type: 'string',
    filterable: true,
  },
  {
    Icon: FlagIcon,
    label: 'country',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Public,
    label: 'position',
    type: 'string',
    filterable: true,
  },
  {
    Icon: People,
    label: 'isAdmin',
    type: 'boolean',
    filterable: true,
  },
  {
    Icon: InfoIcon,
    label: 'aboutMe',
    type: 'string',
    filterable: true,
  },
];

export const dataGridColumns = [
  {
    field: 'userName', // Db name
    headerAlign: 'center', //
    description: 'userName', //Discription from translation
    width: 300,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'profileImage'],
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
    field: 'isAdmin', // Db name
    headerAlign: 'center', //
    description: 'isAdmin', //Discription from translation
    width: 140,
    type: 'boolean',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'firstName', // Db name
    headerAlign: 'center', //
    description: 'firstName', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'lastName', // Db name
    headerAlign: 'center', //
    description: 'lastName', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'city', // Db name
    headerAlign: 'center', //
    description: 'city', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'province', // Db name
    headerAlign: 'center', //
    description: 'province', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'country', // Db name
    headerAlign: 'center', //
    description: 'country', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'position', // Db name
    headerAlign: 'center', //
    description: 'position', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'aboutMe', // Db name
    headerAlign: 'center', //
    description: 'aboutMe', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
];

export const Users = {
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
