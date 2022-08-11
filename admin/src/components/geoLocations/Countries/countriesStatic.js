export const getAllUrl = '/admin/api/geoLocations/getAll';
export const activeUrl = '/admin/api/geoLocations/active';
export const diActiveUrl = '/admin/api/geoLocations/diactive';
export const editUrl = '/admin/dashboard/a-locations/countries';
export const exportCsvUrl = `/admin/api/geoLocations/export`;
import Info from '@mui/icons-material/Info';
import Flag from '@mui/icons-material/Flag';
import Title from '@mui/icons-material/Title';
import LocalPhone from '@mui/icons-material/LocalPhone';
import LocationCity from '@mui/icons-material/LocationCity';
import CurrencyExchange from '@mui/icons-material/CurrencyExchange';
import SouthAmerica from '@mui/icons-material/SouthAmerica';
import Update from '@mui/icons-material/Update';
import Dns from '@mui/icons-material/Dns';
import Map from '@mui/icons-material/Map';
import HotelIcon from '@mui/icons-material/Hotel';
import Badge from '@mui/icons-material/Badge';
import AccountBox from '@mui/icons-material/AccountBox';

export const dataGridColumns = [
  {
    field: 'name', // Db name
    headerAlign: 'center', //
    description: 'name', //Discription from translation
    width: 200,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'iso2'],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'iso3', // Db name
    headerAlign: 'center', //
    description: 'iso3', //Discription from translation
    width: 100,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'iso2', // Db name
    headerAlign: 'center', //
    description: 'iso2', //Discription from translation
    width: 100,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'capital', // Db name
    headerAlign: 'center', //
    description: 'capital', //Discription from translation
    width: 100,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'currency', // Db name
    headerAlign: 'center', //
    description: 'currency', //Discription from translation
    width: 100,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'native', // Db name
    headerAlign: 'center', //
    description: 'native', //Discription from translation
    width: 200,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'numeric_code', // Db name
    headerAlign: 'center', //
    description: 'numeric_code', //Discription from translation
    width: 150,
    type: 'number',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'totalActiveHotels', // Db name
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
    field: 'isHotelsActive', // Db name
    headerAlign: 'center', //
    description: 'isHotelsActive', //Discription from translation
    width: 140,
    type: 'boolean',
    filterable: true,
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
    field: 'phone_code', // Db name
    headerAlign: 'center', //
    description: 'phone_code', //Discription from translation
    width: 200,
    type: 'number',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'region', // Db name
    headerAlign: 'center', //
    description: 'region', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'totalStates', // Db name
    headerAlign: 'center', //
    description: 'totalStates', //Discription from translation
    width: 150,
    type: 'number',
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'subregion', // Db name
    headerAlign: 'center', //
    description: 'subregion', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'timezones', // Db name
    headerAlign: 'center', //
    description: 'timezones', //Discription from translation
    width: 150,
    type: 'array',
    arrayTotal: false,
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'tld', // Db name
    headerAlign: 'center', //
    description: 'tld', //Discription from translation
    width: 150,
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
    width: 150,
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
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'currency_name', // Db name
    headerAlign: 'center', //
    description: 'currency_name', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'currency_symbol', // Db name
    headerAlign: 'center', //
    description: 'currency_symbol', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
];

export const countriesFields = [
  {
    Icon: Title,
    label: 'name',
    type: 'string',
    filterable: true,
  },
  {
    Icon: LocationCity,
    label: 'capital',
    type: 'string',
    filterable: true,
  },
  {
    Icon: CurrencyExchange,
    label: 'currency',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Info,
    label: 'native',
    type: 'string',
    filterable: false,
  },
  {
    Icon: HotelIcon,
    label: 'totalActiveHotels',
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
    Icon: HotelIcon,
    label: 'isHotelsActive',
    type: 'boolean',
    filterable: true,
  },
  {
    Icon: LocalPhone,
    label: 'phone_code',
    type: 'string',
    filterable: true,
  },
  {
    Icon: SouthAmerica,
    label: 'region',
    type: 'string',
    filterable: true,
  },
  {
    Icon: SouthAmerica,
    label: 'totalStates',
    type: 'number',
    filterable: false,
  },
  {
    Icon: SouthAmerica,
    label: 'subregion',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Update,
    label: 'timezones',
    type: 'array',
    filterable: false,
  },
  {
    Icon: Dns,
    label: 'tld',
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
    Icon: CurrencyExchange,
    label: 'currency_symbol',
    type: 'string',
    filterable: false,
  },
  {
    Icon: CurrencyExchange,
    label: 'currency_name',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Info,
    label: 'iso2',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Info,
    label: 'iso3',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Info,
    label: 'numeric_code',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Flag,
    label: 'emoji',
    type: 'string',
    filterable: false,
  },
];

export const countriesGStore = {
  dataArray: [],
  activesId: [],
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

export const countriesAStore = {
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
