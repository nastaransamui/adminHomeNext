import { AccountBox, Dashboard, Apps } from '@mui/icons-material/';

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
    icon: AccountBox,
    state: 'pageCollapse',
    layout: '/admin',
    views: [
      {
        path: '/dashboard/user-page',
        'name_en-US': 'Users List',
        name_fa: 'لیست کاربران',
        'mini_en-US': 'UL',
        mini_fa: 'ل ک',

        layout: '/admin',
      },
      {
        path: '/dashboard/user-page/user',
        'name_en-US': 'Create user',
        name_fa: 'ایجاد کاربر ',
        'mini_en-US': 'CU',
        mini_fa: 'ا ک',

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
        state: 'multiCollapse',
        views: [
          {
            path: '/dashboard/main-page-setup/videos',
            'name_en-US': 'Videos',
            name_fa: 'فیلم های',
            'mini_en-US': 'V',
            mini_fa: 'ف',

            layout: '/admin',
          },
          {
            path: '/dashboard/main-page-setup/videos/video',
            'name_en-US': 'Video',
            name_fa: 'فیلم',
            'mini_en-US': 'V',
            mini_fa: 'ف',

            layout: '/admin',
          },
        ],
      },
    ],
  },
  {
    collapse: true,
    'name_en-US': 'Forms',
    name_fa: 'فرم ها',
    icon: 'content_paste',
    state: 'formsCollapse',
    views: [
      {
        path: '/dashboard/regular-forms',
        'name_en-US': 'Regular Forms',
        name_fa: 'فرمهای عادی',
        'mini_en-US': 'RF',
        mini_fa: 'فع',

        layout: '/admin',
      },
    ],
  },
];

export default dashRoutes;
