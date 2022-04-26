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
export const getAllUserUrl = `/admin/api/mainPageSetup/getAll`;
export const deleteUserUrl = `/admin/api/mainPageSetup/delete`;
export const exportCsvUrl = `/admin/api/users/export`;
export const userFields = [
  {
    Icon: InfoIcon,
    label: 'aboutMe',
    type: 'string',
  },
  {
    Icon: BadgeIcon,
    label: 'firstName',
    type: 'string',
  },
  {
    Icon: BadgeIcon,
    label: 'lastName',
    type: 'string',
  },
  {
    Icon: LocationCityIcon,
    label: 'city',
    type: 'string',
  },
  {
    Icon: FlagIcon,
    label: 'country',
    type: 'string',
  },
  {
    Icon: Public,
    label: 'position',
    type: 'string',
  },
  {
    Icon: People,
    label: 'isAdmin',
    type: 'boolean',
  },
  {
    Icon: EventIcon,
    label: 'updatedAt',
    type: 'string',
  },
  {
    Icon: EventIcon,
    label: 'createdAt',
    type: 'string',
  },
  {
    Icon: AccountCircleIcon,
    label: 'userName',
    type: 'string',
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
  },
  {
    field: 'isAdmin', // Db name
    headerAlign: 'center', //
    description: 'updatedAt', //Discription from translation
    width: 140,
    type: 'boolean',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
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
  },
];

export const Users = {
  users: [],
  totalUsers: 0,
  usersPageNumber: 1,
  usersSortBy: {
    field: 'createdAt',
    sorting: -1,
  },
  usersCardView: true,
  usersPerPage: 48,
  usersGrid: 4,
};
