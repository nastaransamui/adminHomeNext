export const getAllUrl = '/admin/api/geoLocations/getAllCities';
export const editUrl = '/admin/dashboard/a-locations/cities';
export const exportCsvUrl = `/admin/api/geoLocations/export`;
import Flag from '@mui/icons-material/Flag';
import Info from '@mui/icons-material/Info';
import Title from '@mui/icons-material/Title';
import Map from '@mui/icons-material/Map';
import Domain from '@mui/icons-material/Domain';
import HotelIcon from '@mui/icons-material/Hotel';
import Badge from '@mui/icons-material/Badge';
import AccountBox from '@mui/icons-material/AccountBox';

export const dataGridColumns = [
  {
    field: 'name', // Db name
    headerAlign: 'center', //
    description: 'cityName', //Discription from translation
    width: 300,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'iso2'],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'state_name', // Db country
    headerAlign: 'center', //
    description: 'state_name', //Discription from translation
    width: 300,
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
    width: 250,
    type: 'string',
    arrayTotal: false,
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'totalHotels', // Db name
    headerAlign: 'center', //
    description: 'totalActiveHotels', //Discription from translation
    width: 150,
    type: 'number',
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'totalUsers', // Db name
    headerAlign: 'center', //
    description: 'totalUsers', //Discription from translation
    width: 150,
    type: 'number',
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'totalAgents', // Db name
    headerAlign: 'center', //
    description: 'totalAgents', //Discription from translation
    width: 150,
    type: 'number',
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'latitude', // Db name
    headerAlign: 'center', //
    description: 'latitude', //Discription from translation
    width: 200,
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
    width: 200,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'id',
    headerAlign: 'center', //
    description: 'cityid',
    width: 200,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
];

export const citiesFields = [
  {
    Icon: Title,
    label: 'country',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Domain,
    label: 'state_name',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Flag,
    label: 'emoji',
    type: 'string',
    filterable: false,
  },
  {
    Icon: Title,
    label: 'name',
    type: 'string',
    filterable: true,
  },
  {
    Icon: HotelIcon,
    label: 'totalHotels',
    type: 'number',
    filterable: true,
  },
  {
    Icon: Badge,
    label: 'totalUsers',
    type: 'number',
    filterable: true,
  },
  {
    Icon: AccountBox,
    label: 'totalAgents',
    type: 'number',
    filterable: true,
  },
  {
    Icon: Title,
    label: 'id',
    type: 'number',
    filterable: true,
  },
  {
    Icon: Info,
    label: 'iso2',
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

export const citiesStore = {
  dataArray: [],
  dataArrayLengh: 0,
  pageNumber: 1,
  SortBy: {
    field: 'name',
    sorting: 1,
  },
  CardView: true,
  PerPage: 6,
  GridView: 4,
};
