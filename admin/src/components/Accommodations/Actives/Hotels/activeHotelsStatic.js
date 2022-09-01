export const editUrl = '/admin/dashboard/hotel-data/hotels';
export const createUrl = '/admin/dashboard/hotel-data/hotels/hotel';
export const getAllUrl = '/admin/api/mainPageSetup/getAll';
export const deleteUrl = `/admin/api/modelsCrud/delete`;
export const exportCsvUrl = `/admin/api/hotels/export`;

import Title from '@mui/icons-material/Title';
import Grid3x3 from '@mui/icons-material/Grid3x3';
import People from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import FlagIcon from '@mui/icons-material/Flag';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Home from '@mui/icons-material/Home';
import AlternateEmail from '@mui/icons-material/AlternateEmail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Dns from '@mui/icons-material/Dns';
import Map from '@mui/icons-material/Map';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

export const dataGridColumns = [
  {
    field: 'hotelName', // Db name
    headerAlign: 'center', //
    description: 'hotelName', //Discription from translation
    width: 200,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'hotelThumb'],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'hotelRating', // Db name
    headerAlign: 'center', //
    description: 'hotelRating', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'countryName', // Db name
    headerAlign: 'center', //
    description: 'countryName', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'provinceName', // Db name
    headerAlign: 'center', //
    description: 'provinceName', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'cityName', // Db name
    headerAlign: 'center', //
    description: 'cityName', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'isActive', // Db name
    headerAlign: 'center', //
    description: 'isActive', //Discription from translation
    width: 150,
    type: 'boolean',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
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
    field: 'email', // Db name
    headerAlign: 'center', //
    description: 'email', //Discription from translation
    width: 220,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'address', // Db name
    headerAlign: 'center', //
    description: 'address', //Discription from translation
    width: 200,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'phones', // Db name
    headerAlign: 'center', //
    description: 'phones', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'fax', // Db name
    headerAlign: 'center', //
    description: 'fax', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'url', // Db name
    headerAlign: 'center', //
    description: 'url', //Discription from translation
    width: 220,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'latitude', // Db name
    headerAlign: 'center', //
    description: 'latitude', //Discription from translation
    width: 110,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'longitude', // Db name
    headerAlign: 'center', //
    description: 'longitude', //Discription from translation
    width: 110,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'hotelId', // Db name
    headerAlign: 'center', //
    description: 'hotelId', //Discription from translation
    width: 120,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'Giataid', // Db name
    headerAlign: 'center', //
    description: 'Giataid', //Discription from translation
    width: 120,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
];

export const hotelsFields = [
  {
    Icon: Title,
    label: 'hotelName',
    type: 'string',
    filterable: true,
  },
  {
    Icon: ThumbsUpDownIcon,
    label: 'hotelRating',
    type: 'rating',
    filterable: false,
  },
  {
    Icon: FlagIcon,
    label: 'countryName',
    type: 'string',
    filterable: true,
  },
  {
    Icon: LocationCityIcon,
    label: 'provinceName',
    type: 'string',
    filterable: true,
  },
  {
    Icon: LocationCityIcon,
    label: 'cityName',
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
    Icon: Grid3x3,
    label: 'hotelId',
    type: 'number',
    filterable: true,
  },
  {
    Icon: Grid3x3,
    label: 'Giataid',
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
    Icon: Home,
    label: 'address',
    type: 'string',
    filterable: false,
  },
  {
    Icon: AlternateEmail,
    label: 'email',
    type: 'string',
    filterable: true,
  },
  {
    Icon: LocalPhoneIcon,
    label: 'fax',
    type: 'string',
    filterable: true,
  },
  {
    Icon: LocalPhoneIcon,
    label: 'phones',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Dns,
    label: 'url',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Map,
    label: 'latitude',
    type: 'string',
    filterable: false,
  },
  {
    Icon: Map,
    label: 'longitude',
    type: 'string',
    filterable: false,
  },
];

export const Hotels = {
  dataArray: [],
  activesId: [],
  dataArrayLengh: 0,
  pageNumber: 1,
  SortBy: {
    field: 'hotelName',
    sorting: 1,
  },
  CardView: true,
  PerPage: 6,
  GridView: 4,
};
