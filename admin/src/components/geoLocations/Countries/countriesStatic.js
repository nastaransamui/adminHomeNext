export const getAllUrl = '/admin/api/geoLocations/getAll';
export const activeUrl = '/admin/api/geoLocations/active';
export const diActiveUrl = '/admin/api/geoLocations/diactive';
export const editUrl = '/admin/dashboard/a-locations/countries/country';
import {
  Info,
  Flag,
  Title,
  LocalPhone,
  LocationCity,
  CurrencyExchange,
  SouthAmerica,
  Update,
  Dns,
  Map,
} from '@mui/icons-material';

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
