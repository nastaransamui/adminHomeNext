const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});
const content = [
  {
    title_en: 'title',
    title_fa: 'عنوان',
    topTitle_en: 'Top title',
    topTitle_fa: 'عنوان برتر',
    subTitle_en: 'Sub title',
    subTitle_fa: 'عنوان فرعی',
    button_en: 'Read More',
    button_fa: 'ادامه مطلب',
    image: 'https://picsum.photos/id/12/1280/640',
  },
  {
    title_en: 'title',
    title_fa: 'عنوان',
    topTitle_en: 'Top title',
    topTitle_fa: 'عنوان برتر',
    subTitle_en: 'Sub title',
    subTitle_fa: 'عنوان فرعی',
    button_en: 'Discover',
    button_fa: 'کشف کردن',
    image: 'https://picsum.photos/id/866/1280/640',
  },
  {
    title_en: 'title',
    title_fa: 'عنوان',
    topTitle_en: 'Top title',
    topTitle_fa: 'عنوان برتر',
    subTitle_en: 'Sub title',
    subTitle_fa: 'عنوان فرعی',
    button_en: 'Buy now',
    button_fa: 'هم اکنون خریداری کنید',
    image: 'https://picsum.photos/id/120/1280/640',
  },
];

apiRoute.get(async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
});

export default apiRoute;
