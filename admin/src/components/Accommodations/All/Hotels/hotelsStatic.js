export const getAllListUrl = '/admin/api/hotels/listOfAll';
export const activeUrl = '/admin/api/hotels/active';
export const diActiveUrl = '/admin/api/hotels/diactive';
import HotelIcon from '@mui/icons-material/Hotel';
import Title from '@mui/icons-material/Title';
import Info from '@mui/icons-material/Info';

export const dataGridColumns = [
  {
    field: 'title_en', // Db name
    headerAlign: 'center', //
    description: 'name', //Discription from translation
    width: 250,
    type: 'string',
    filterable: true,
    hasAvatar: [true, 'iso2'],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'iso2', // Db name
    headerAlign: 'center', //
    description: 'iso2', //Discription from translation
    width: 150,
    type: 'string',
    filterable: true,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: true,
  },
  {
    field: 'totalHotel', // Db name
    headerAlign: 'center', //
    description: 'totalHotel', //Discription from translation
    width: 150,
    type: 'number',
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'hotelReady', // Db name
    headerAlign: 'center', //
    description: 'hotelReady', //Discription from translation
    width: 150,
    type: 'number',
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
  {
    field: 'hotelNotComplete', // Db name
    headerAlign: 'center', //
    description: 'hotelNotComplete', //Discription from translation
    width: 150,
    type: 'number',
    filterable: false,
    hasAvatar: [false, ''],
    hasVideo: [false, ''],
    searchAble: false,
  },
];

export const hotelsFields = [
  {
    Icon: Title,
    label: 'title_en',
    type: 'string',
    filterable: true,
  },
  {
    Icon: Title,
    label: 'title_fa',
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
    Icon: HotelIcon,
    label: 'totalHotel',
    type: 'number',
    filterable: false,
  },
  {
    Icon: HotelIcon,
    label: 'hotelReady',
    type: 'number',
    filterable: false,
  },
  {
    Icon: HotelIcon,
    label: 'hotelNotComplete',
    type: 'number',
    filterable: false,
  },
];

export const hotelsGStore = {
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
