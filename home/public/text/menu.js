import Promotions from '../../src/components/Promotions/Promotions';
import Featured from '../../src/components/Featured/Featured';
import Trending from '../../src/components/Trending/Trending';
import Categories from '../../src/components/Categories/Categories';
import About from '../../src/components/About/About';
import Testimonials from '../../src/components/Testimonials/Testimonials';
import Blog from '../../src/components/Blog/Blog';

const menu = [
  {
    en: 'promotions',
    fa: 'تبلیغات',
    firstComponent: Promotions,
  },
  {
    en: 'featured',
    fa: 'ویژه',
    firstComponent: Featured,
  },
  {
    en: 'trending',
    fa: 'روند',
    firstComponent: Trending,
  },
  {
    en: 'categories',
    fa: 'دسته بندی ها',
    firstComponent: Categories,
  },
  {
    en: 'about',
    fa: 'در باره',
    firstComponent: About,
  },
  {
    en: 'testimonials',
    fa: 'توصیفات',
    firstComponent: Testimonials,
  },
  {
    en: 'blog',
    fa: 'وبلاگ',
    firstComponent: Blog,
  },
  // {
  //   en: 'news',
  //   fa: 'اخبار',
  // },
];

export default menu;
