const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

const list = [
  {
    title_en: 'Cras convallis lacus',
    title_fa: 'کراس کانوالیس لاکوس',
    thumb: 'https://picsum.photos/id/104/300/440',
    isYoutube: false,
    youTubeId: '',
    videoLink: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  },
  {
    title_en: 'Cras convallis lacus',
    title_fa: 'کراس کانوالیس لاکوس',
    thumb: 'https://picsum.photos/id/1039/300/440',
    isYoutube: true,
    youTubeId: 'CK1ndZEkBcE',
    videoLink: '',
  },
  {
    title_en: 'Cras convallis lacus',
    title_fa: 'کراس کانوالیس لاکوس',
    thumb: 'https://picsum.photos/id/1041/300/440',
    isYoutube: false,
    youTubeId: '',
    videoLink: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  },
];

apiRoute.get(async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
});

export default apiRoute;
