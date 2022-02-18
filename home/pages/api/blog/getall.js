const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

const blog = [
  {
    title_en: 'Vestibulum vitae tristique urna. Mauris non cursus quam',
    category_en: 'Science - Math',
    title_fa: 'زندگی غم انگیز کوزه',
    category_fa: 'علوم - ریاضی',
    createdDate: '2022-01-03T23:30:15.123Z',
    thumb: 'https://picsum.photos/id/104/300/440',
    isYoutube: false,
    youTubeId: '',
    videoLink: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  },
  {
    title_en: 'Vestibulum vitae tristique urna. Mauris non cursus quam',
    category_en: 'Science - Math',
    title_fa: 'زندگی غم انگیز کوزه',
    category_fa: 'علوم - ریاضی',
    createdDate: '2022-01-04T21:30:15.123Z',
    thumb: 'https://picsum.photos/id/1039/300/440',
    isYoutube: true,
    youTubeId: 'CK1ndZEkBcE',
    videoLink: '',
  },
  {
    title_en: 'Vestibulum vitae tristique urna. Mauris non cursus quam',
    category_en: 'Science - Math',
    title_fa: 'زندگی غم انگیز کوزه',
    category_fa: 'علوم - ریاضی',
    createdDate: '2022-01-01T13:30:15.123Z',
    thumb: 'https://picsum.photos/id/1041/300/440',
    isYoutube: false,
    youTubeId: '',
    videoLink: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  },
];

apiRoute.get(async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
});

export default apiRoute;
