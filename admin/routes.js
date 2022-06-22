import {
  AccountBox,
  Dashboard,
  Apps,
  Public,
  AttachMoney,
  DataThresholding,
  Apartment,
  SouthAmerica,
  Badge,
} from '@mui/icons-material/';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

var dashRoutes = [
  {
    path: '/dashboard',
    'name_en-US': 'Dashboard',
    name_fa: 'داشبورد',
    icon: Dashboard,

    layout: '/admin',
  },
  {
    path: '/dashboard/user-page',
    collapse: true,
    'name_en-US': 'Users',
    name_fa: 'کاربران',
    icon: Badge,
    state: 'userCollapse',
    layout: '/admin',
    views: [
      {
        path: '/dashboard/user-page',
        'name_en-US': 'Users List',
        name_fa: 'لیست کاربران',
        'mini_en-US': 'UL',
        mini_fa: 'ل ک',
        state: 'usersMultiCollapse',
        layout: '/admin',
      },
      {
        path: '/dashboard/user-page/user',
        'name_en-US': 'Create user',
        name_fa: 'ایجاد کاربر ',
        'mini_en-US': 'CU',
        mini_fa: 'ا ک',
        state: 'userMultiCollapse',
        layout: '/admin',
      },
    ],
  },
  {
    path: '/dashboard/rbac-data',
    collapse: true,
    'name_en-US': 'Roles',
    name_fa: 'نقش ها',
    icon: ManageAccountsIcon,
    state: 'roleCollapse',
    layout: '/admin',
    views: [
      {
        path: '/dashboard/rbac-data',
        'name_en-US': 'Roles List',
        name_fa: 'لیست نقش ها',
        'mini_en-US': 'RL',
        mini_fa: 'ل ن',
        state: 'rolesMultiCollapse',
        layout: '/admin',
      },
      {
        path: '/dashboard/rbac-data/role',
        'name_en-US': 'Create role',
        name_fa: 'ایجاد نقش ',
        'mini_en-US': 'CR',
        mini_fa: 'ا ن',
        state: 'roleMultiCollapse',
        layout: '/admin',
      },
    ],
  },
  {
    path: '/dashboard/main-page-setup',
    collapse: true,
    'name_en-US': 'Main page setup',
    name_fa: 'صفحه اصلی',
    icon: Apps,
    state: 'mainPageCollapse',
    views: [
      {
        collapse: true,
        'name_en-US': 'Video banner',
        name_fa: 'بنر ویدیویی',
        'mini_en-US': 'VB',
        mini_fa: 'ب و',
        state: 'videoMultiCollapse',
        path: '/dashboard/main-page-setup',
        layout: '/admin',
        views: [
          {
            path: '/dashboard/main-page-setup/videos',
            'name_en-US': 'Videos List',
            name_fa: 'فیلم های',
            'mini_en-US': 'V',
            mini_fa: 'ف',
            state: 'videosCollapse',
            layout: '/admin',
          },
          {
            path: '/dashboard/main-page-setup/videos/video',
            'name_en-US': 'Add video',
            name_fa: 'فیلم',
            'mini_en-US': 'V',
            mini_fa: 'ف',
            state: 'videoCollapse',
            layout: '/admin',
          },
        ],
      },
      {
        collapse: true,
        'name_en-US': 'Photo slider',
        name_fa: 'نوار عکس',
        'mini_en-US': 'PS',
        mini_fa: 'ن ع',
        state: 'photoMultiCollapse',
        views: [
          {
            path: '/dashboard/main-page-setup/photos',
            'name_en-US': 'Photos List',
            name_fa: 'عکس ها',
            'mini_en-US': 'P',
            mini_fa: 'ع',
            state: 'photosCollapse',
            layout: '/admin',
          },
          {
            path: '/dashboard/main-page-setup/photos/photo',
            'name_en-US': 'Add Photo',
            name_fa: 'عکس',
            'mini_en-US': 'P',
            mini_fa: 'ع',
            state: 'photoCollapse',
            layout: '/admin',
          },
        ],
      },
      {
        collapse: true,
        'name_en-US': 'Features slider',
        name_fa: 'امکانات',
        'mini_en-US': 'FS',
        mini_fa: 'ا',
        state: 'featureMultiCollapse',
        path: '/dashboard/main-page-setup',
        layout: '/admin',
        views: [
          {
            path: '/dashboard/main-page-setup/features',
            'name_en-US': 'Features List',
            name_fa: 'امکانات',
            'mini_en-US': 'F',
            mini_fa: 'ا',
            state: 'featuresCollapse',
            layout: '/admin',
          },
          {
            path: '/dashboard/main-page-setup/features/feature',
            'name_en-US': 'Add Feature',
            name_fa: 'ویژگی',
            'mini_en-US': 'F',
            mini_fa: 'و',
            state: 'featureCollapse',
            layout: '/admin',
          },
        ],
      },
      {
        'name_en-US': 'About us',
        name_fa: 'درباره',
        'mini_en-US': 'AU',
        mini_fa: 'د',
        state: 'aboutCollapse',
        path: '/dashboard/main-page-setup/about',
        layout: '/admin',
      },
    ],
  },
  {
    path: '/dashboard',
    collapse: true,
    'name_en-US': 'Main Data Activation',
    name_fa: 'فعال سازی داده های اصلی',
    icon: DataThresholding,
    state: 'mainDataCollapse',
    layout: '/admin',
    views: [
      {
        collapse: true,
        'name_en-US': 'All',
        name_fa: 'همه',
        'mini_en-US': 'A',
        mini_fa: 'ه',
        state: 'allGlobeCollapse',
        views: [
          {
            path: '/dashboard/g-locations/countries',
            'name_en-US': 'All countries',
            name_fa: 'همه کشورها',
            'mini_en-US': 'AC',
            mini_fa: 'ه ک',
            state: 'gCountriesCollapse',
            layout: '/admin',
          },
          {
            path: '/dashboard/g-currencies/currencies',
            'name_en-US': 'All currencies',
            name_fa: 'همه ارزها',
            'mini_en-US': 'AC',
            mini_fa: 'ه ا',
            state: 'gCurrenciesMultiCollapse',
            layout: '/admin',
          },
        ],
      },
      {
        collapse: true,
        'name_en-US': 'Only actives',
        name_fa: 'فقط فعال',
        'mini_en-US': 'OA',
        mini_fa: 'ف',
        state: 'activeGlobeCollapse',
        views: [
          {
            path: '/dashboard/a-locations/countries',
            'name_en-US': 'Active countries',
            name_fa: 'کشورها فعال',
            'mini_en-US': 'AC',
            mini_fa: 'ک',
            state: 'aCountriesCollapse',
            layout: '/admin',
            icon: Public,
          },
          {
            path: '/dashboard/a-locations/provinces',
            'name_en-US': 'Active provinces/states',
            name_fa: 'استان ها / ایالتهای فعال',
            'mini_en-US': 'AP',
            mini_fa: ' ا',
            state: 'aProvincesCollapse',
            layout: '/admin',
            icon: SouthAmerica,
          },
          {
            path: '/dashboard/a-locations/cities',
            'name_en-US': 'Active cities',
            name_fa: 'شهرها ی فعال',
            'mini_en-US': 'AC',
            mini_fa: 'ش',
            state: 'aCitiesCollapse',
            layout: '/admin',
            icon: Apartment,
          },
          {
            path: '/dashboard/a-currencies/currencies',
            'name_en-US': 'Active currencies',
            name_fa: 'ارزهای فعال',
            'mini_en-US': 'AC',
            mini_fa: 'ک',
            state: 'aCurrenciesMultiCollapse',
            layout: '/admin',
            icon: AttachMoney,
          },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    collapse: true,
    'name_en-US': 'Agency/Client Data',
    name_fa: 'اطلاعات آژانس/مشتری',
    icon: AccountBox,
    state: 'agencyDataCollapse',
    views: [
      {
        path: '/dashboard/client-data/clients',
        'name_en-US': 'Agencies List',
        name_fa: 'فهرست آژانس ها',
        'mini_en-US': 'AL',
        mini_fa: 'ف آ',
        state: 'agenciesCollapse',
        layout: '/admin',
      },
      {
        path: '/dashboard/client-data/clients/client',
        'name_en-US': 'Add agency',
        name_fa: 'آژانس اضافه کنید',
        'mini_en-US': 'AA',
        mini_fa: 'آا',
        state: 'agencyCollapse',
        layout: '/admin',
      },
    ],
  },
];

export default dashRoutes;
