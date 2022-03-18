import AppsIcon from '@mui/icons-material/Apps';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ImageIcon from '@mui/icons-material/Image';

var dashRoutes = [
  {
    path: '/dashboard',
    'name_en-US': 'Dashboard',
    name_fa: 'داشبورد',
    icon: DashboardIcon,

    layout: '/admin',
  },
  {
    path: '/dashboard/user-page',
    collapse: false,
    'name_en-US': 'Users',
    name_fa: 'کاربران',
    icon: ImageIcon,
    state: 'pageCollapse',
    layout: '/admin',
    // views: [
    //   {
    //     path: '/dashboard/pricing-page',
    //     'name_en-US': 'Pricing Page',
    //     name_fa: 'صفحه قیمت',
    //     'mini_en-US': 'PP',
    //     mini_fa: 'صق',

    //     layout: '/admin',
    //   },
    // ],
  },
  {
    collapse: true,
    'name_en-US': 'Components',
    name_fa: 'اجزاء',
    icon: AppsIcon,
    state: 'componentsCollapse',
    views: [
      {
        collapse: true,
        'name_en-US': 'Multi Level Collapse',
        name_fa: 'چند سطحی',
        'mini_en-US': 'MC',
        mini_fa: 'ر',
        state: 'multiCollapse',
        views: [
          {
            path: '/dashboard/buttons',
            'name_en-US': 'Buttons',
            name_fa: 'دکمه ها',
            'mini_en-US': 'B',
            mini_fa: 'ب',

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
