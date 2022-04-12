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
