export const getAllUrl = '/admin/api/exchange/getAll';
export const activeUrl = '/admin/api/exchange/active';
export const diActiveUrl = '/admin/api/exchange/diactive';
export const editUrl = '/admin/dashboard/a-currencies/currencies';
export const exportCsvUrl = `/admin/api/exchange/export`;
import {
  Info,
  Flag,
  CurrencyExchange,
  Public,
  AttachMoney,
  Numbers,
} from '@mui/icons-material';

export const dataGridColumns = [
  {
    field: 'currency_name', // Db name
    headerAlign: 'center', //
    description: 'currency_name', //Discription from translation
    width: 300,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'iso2'],
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
    field: 'name', // Db name
    headerAlign: 'center', //
    description: 'country_name', //Discription from translation
    width: 300,
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
    field: 'numeric_code', // Db name
    headerAlign: 'center', //
    description: 'numeric_code', //Discription from translation
    width: 250,
    type: 'number',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
];

export const currenciesFields = [
  {
    Icon: CurrencyExchange,
    label: 'currency_name',
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
    Icon: Public,
    label: 'name',
    type: 'string',
    filterable: true,
  },
  {
    Icon: AttachMoney,
    label: 'currency_symbol',
    type: 'string',
    filterable: false,
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
    Icon: Numbers,
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

export const currenciesGStore = {
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

export const currenciesAStore = {
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
