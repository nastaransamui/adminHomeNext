const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});
const sliderData = [
  {
    image: 'https://picsum.photos/id/1048/300/440',
    subtitle_en: 'Vivamus sit amet',
    subtitle_fa: 'لورم ایپسوم متن',
    title_en: 'The Lorem Ipsum Dolor Sit',
    title_fa: 'لورم ایپسوم متن ساختگی با',
    rating: 5,
    desc_en:
      'Vestibulum faucibus eget erat eget pretium. Donec commodo convallis eget suscipit orci.',
    desc_fa: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و',
  },
  {
    image: 'https://picsum.photos/id/1059/300/440',
    subtitle_en: 'Vivamus sit amet',
    subtitle_fa: 'لورم ایپسوم متن',
    title_en: 'The Lorem Ipsum Dolor Sit',
    title_fa: 'لورم ایپسوم متن ساختگی با',
    rating: 2,
    desc_en:
      'Vestibulum faucibus eget erat eget pretium. Donec commodo convallis eget suscipit orci.',
    desc_fa: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و.',
  },
  {
    image: 'https://picsum.photos/id/1068/300/440',
    subtitle_en: 'Vivamus sit amet',
    subtitle_fa: 'لورم ایپسوم متن',
    title_en: 'The Lorem Ipsum Dolor Sit',
    title_fa: 'لورم ایپسوم متن ساختگی با',
    rating: 3,
    desc_en:
      'Vestibulum faucibus eget erat eget pretium. Donec commodo convallis eget suscipit orci.',
    desc_fa: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و',
  },
  {
    image: 'https://picsum.photos/id/1080/300/440',
    subtitle_en: 'Vivamus sit amet',
    subtitle_fa: 'لورم ایپسوم متن',
    title_en: 'The Lorem Ipsum Dolor Sit',
    title_fa: 'لورم ایپسوم متن ساختگی با',
    rating: 3,
    desc_en:
      'Vestibulum faucibus eget erat eget pretium. Donec commodo convallis eget suscipit orci.',
    desc_fa: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و',
  },
];
apiRoute.get(async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: sliderData });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
});

export default apiRoute;
