export const getAllUrl = '/admin/api/geoLocations/getAllProvinces';
export const editUrl = '/admin/dashboard/a-locations/provinces';
export const exportCsvUrl = `/admin/api/geoLocations/export`;
import Info from '@mui/icons-material/Info';
import Flag from '@mui/icons-material/Flag';
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
    description: 'stateName', //Discription from translation
    width: 300,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'iso2'],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'country', // Db country
    headerAlign: 'center', //
    description: 'country', //Discription from translation
    width: 300,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'totalCities', // Db name
    headerAlign: 'center', //
    description: 'cities', //Discription from translation
    width: 150,
    type: 'number',
    arrayTotal: false,
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
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
    field: 'state_code',
    headerAlign: 'center', //
    description: 'state_code',
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
];

export const provincesFields = [
  {
    Icon: Title,
    label: 'country',
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
  {
    Icon: Domain,
    label: 'totalCities',
    type: 'number',
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
];

export const provincesStore = {
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
