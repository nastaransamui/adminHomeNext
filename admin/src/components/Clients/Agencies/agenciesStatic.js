import LocationCityIcon from '@mui/icons-material/LocationCity';
import People from '@mui/icons-material/People';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import {
  AlternateEmail,
  AttachMoney,
  Grid3x3,
  Home,
  HomeWork,
  ManageAccounts,
} from '@mui/icons-material';

export const editUrl = '/admin/dashboard/client-data/clients';
export const createUrl = '/admin/dashboard/client-data/clients/client';
export const getAllUrl = `/admin/api/mainPageSetup/getAll`;
export const deleteUrl = `/admin/api/mainPageSetup/delete`;
export const exportCsvUrl = `/admin/api/clients/export`;
export const agenciesFields = [
  {
    Icon: HomeWork,
    label: 'agentName',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Grid3x3,
    label: 'agentId',
    type: 'string',
    filterable: true,
  },
  {
    Icon: AlternateEmail,
    label: 'email',
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
    filterable: true,
  },
  {
    Icon: Home,
    label: 'phones',
    type: 'array',
    filterable: false,
  },
  {
    Icon: LocationCityIcon,
    label: 'cityName',
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
    Icon: FlagIcon,
    label: 'countryName',
    type: 'string',
    filterable: true,
  },
  {
    Icon: AttachMoney,
    label: 'currencyCode',
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
    Icon: InfoIcon,
    label: 'creditAmount',
    type: 'number',
    filterable: true,
  },
  {
    Icon: InfoIcon,
    label: 'depositAmount',
    type: 'number',
    filterable: true,
  },
  {
    Icon: InfoIcon,
    label: 'remainCreditAmount',
    type: 'number',
    filterable: true,
  },
  {
    Icon: InfoIcon,
    label: 'remainDepositAmount',
    type: 'number',
    filterable: true,
  },
  {
    Icon: ManageAccounts,
    label: 'accountManager',
    type: 'number',
    filterable: true,
  },
  {
    Icon: InfoIcon,
    label: 'remark',
    type: 'string',
    filterable: true,
  },
];

export const dataGridColumns = [
  {
    field: 'agentName', // Db name
    headerAlign: 'center', //
    description: 'agentName', //Discription from translation
    width: 300,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'logoImage'],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'agentId', // Db name
    headerAlign: 'center', //
    description: 'agentId', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
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
    field: 'isActive', // Db name
    headerAlign: 'center', //
    description: 'isActive', //Discription from translation
    width: 140,
    type: 'boolean',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'email', // Db name
    headerAlign: 'center', //
    description: 'email', //Discription from translation
    width: 250,
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
    width: 140,
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
    type: 'array',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'cityName', // Db name
    headerAlign: 'center', //
    description: 'cityName', //Discription from translation
    width: 140,
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
    width: 140,
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
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'currencyCode', // Db name
    headerAlign: 'center', //
    description: 'currencyCode', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'creditAmount', // Db name
    headerAlign: 'center', //
    description: 'creditAmount', //Discription from translation
    width: 140,
    type: 'number',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'depositAmount', // Db name
    headerAlign: 'center', //
    description: 'depositAmount', //Discription from translation
    width: 140,
    type: 'number',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'remainCreditAmount', // Db name
    headerAlign: 'center', //
    description: 'remainCreditAmount', //Discription from translation
    width: 140,
    type: 'number',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'remainDepositAmount', // Db name
    headerAlign: 'center', //
    description: 'remainDepositAmount', //Discription from translation
    width: 140,
    type: 'number',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'accountManager', // Db name
    headerAlign: 'center', //
    description: 'accountManager', //Discription from translation
    width: 250,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'remark', // Db name
    headerAlign: 'center', //
    description: 'remark', //Discription from translation
    width: 140,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
];

export const Agencies = {
  dataArray: [],
  dataArrayLengh: 0,
  pageNumber: 1,
  SortBy: {
    field: 'createdAt',
    sorting: -1,
  },
  CardView: true,
  PerPage: 48,
  GridView: 4,
};
