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
    imageMobileShow: 'https://picsum.photos/id/124/1280/720',
    videoPoster: 'https://picsum.photos/id/13/1280/720',
    videoLink: 'http://media.w3.org/2010/05/bunny/movie.mp4',
    youTubeId: 'CK1ndZEkBcE',
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
