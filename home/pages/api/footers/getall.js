const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

const footers = [
  {
    title_en: 'Company',
    description_en: ['Team', 'History', 'Contact us', 'Locations'],
    title_fa: 'شرکت',
    description_fa: ['تیم', 'تاریخ', 'با ما تماس بگیرید', 'مکان ها'],
    link: ['/', '/', '/contact', '/'],
  },
  {
    title_en: 'Resources',
    description_en: [
      'Resource',
      'Resource name',
      'Another resource',
      'Final resource',
    ],
    title_fa: 'منابع',
    description_fa: ['منبع', 'نام منبع', 'یک منبع دیگر', 'منبع نهایی'],
    link: ['/', '/', '/', '/'],
  },
  {
    title_en: 'Legal',
    description_en: ['Privacy policy', 'Terms of use', 'Terms Condition'],
    title_fa: 'مجاز',
    description_fa: ['حریم خصوصی', 'شرایط استفاده', 'شرایط'],
    link: ['/', '/'],
  },
];

apiRoute.get(async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: footers });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
});

export default apiRoute;
