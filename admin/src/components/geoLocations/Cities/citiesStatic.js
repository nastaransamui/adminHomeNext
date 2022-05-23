export const getAllUrl = '/admin/api/geoLocations/getAllCities';
export const editUrl = '/admin/dashboard/a-locations/cities/city';
export const exportCsvUrl = `/admin/api/geoLocations/export`;
import { Info, Flag, Title, Map, Domain } from '@mui/icons-material';

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
