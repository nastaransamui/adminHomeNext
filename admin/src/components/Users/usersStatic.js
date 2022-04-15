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
export const userFields = [
  {
    Icon: InfoIcon,
    label: 'aboutMe',
  },
  {
    Icon: BadgeIcon,
    label: 'firstName',
  },
  {
    Icon: BadgeIcon,
    label: 'lastName',
  },
  {
    Icon: LocationCityIcon,
    label: 'city',
  },
  {
    Icon: FlagIcon,
    label: 'country',
  },
  {
    Icon: Public,
    label: 'position',
  },
  {
    Icon: People,
    label: 'isAdmin',
  },
  {
    Icon: EventIcon,
    label: 'updatedAt',
  },
  {
    Icon: EventIcon,
    label: 'createdAt',
  },
  ,
  {
    Icon: AccountCircleIcon,
    label: 'userName',
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
  },
  {
    field: 'createdAt', // Db name
    headerAlign: 'center', //
    description: 'createdAt', //Discription from translation
    width: 200,
    type: 'dateTime',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
  {
    field: 'updatedAt', // Db name
    headerAlign: 'center', //
    description: 'updatedAt', //Discription from translation
    width: 200,
    type: 'dateTime',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
  {
    field: 'isAdmin', // Db name
    headerAlign: 'center', //
    description: 'updatedAt', //Discription from translation
    width: 140,
    type: 'boolean',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
  {
    field: 'firstName', // Db name
    headerAlign: 'center', //
    description: 'firstName', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
  {
    field: 'lastName', // Db name
    headerAlign: 'center', //
    description: 'lastName', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
  {
    field: 'city', // Db name
    headerAlign: 'center', //
    description: 'city', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
  {
    field: 'country', // Db name
    headerAlign: 'center', //
    description: 'country', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
  {
    field: 'position', // Db name
    headerAlign: 'center', //
    description: 'position', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
  {
    field: 'aboutMe', // Db name
    headerAlign: 'center', //
    description: 'aboutMe', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, 'profileImage'],
  },
];
