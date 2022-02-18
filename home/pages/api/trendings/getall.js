const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});
const courseData = [
  {
    img: 'https://picsum.photos/id/137/270/320',
    title_en: 'Vivamus sit amet',
    title_fa: 'زیاد زندگی کن',
    rating: 5,
    price: 50,
    desc_en:
      'Ut sed eros finibus, placerat orci id, dapibus mauris. Vestibulum consequat…',
    desc_fa: 'اما این پایان اروس است، این کار یک فرد معمولی است. عواقب امروز…',
  },
  {
    img: 'https://picsum.photos/id/142/270/320',
    title_en: 'Vivamus sit amet',
    title_fa: 'زیاد زندگی کن',
    rating: 4,
    price: 10,
    desc_en:
      'Ut sed eros finibus, placerat orci id, dapibus mauris. Vestibulum consequat…',
    desc_fa: 'اما این پایان اروس است، این کار یک فرد معمولی است. عواقب امروز…',
  },
  {
    img: 'https://picsum.photos/id/145/270/320',
    title_en: 'Vivamus sit amet',
    title_fa: 'زیاد زندگی کن',
    rating: 5,
    price: 50,
    desc_en:
      'Ut sed eros finibus, placerat orci id, dapibus mauris. Vestibulum consequat…',
    desc_fa: 'اما این پایان اروس است، این کار یک فرد معمولی است. عواقب امروز…',
  },
  {
    img: 'https://picsum.photos/id/152/270/320',
    title_en: 'Vivamus sit amet',
    title_fa: 'زیاد زندگی کن',
    rating: 3,
    price: 25,
    desc_en:
      'Ut sed eros finibus, placerat orci id, dapibus mauris. Vestibulum consequat…',
    desc_fa: 'اما این پایان اروس است، این کار یک فرد معمولی است. عواقب امروز…',
  },
  {
    img: 'https://picsum.photos/id/157/270/320',
    title_en: 'Vivamus sit amet',
    title_fa: 'زیاد زندگی کن',
    rating: 5,
    price: 50,
    desc_en:
      'Ut sed eros finibus, placerat orci id, dapibus mauris. Vestibulum consequat…',
    desc_fa: 'اما این پایان اروس است، این کار یک فرد معمولی است. عواقب امروز…',
  },
  {
    img: 'https://picsum.photos/id/16/270/320',
    title_en: 'Vivamus sit amet',
    title_fa: 'زیاد زندگی کن',
    rating: 5,
    price: 40,
    desc_en:
      'Ut sed eros finibus, placerat orci id, dapibus mauris. Vestibulum consequat…',
    desc_fa: 'اما این پایان اروس است، این کار یک فرد معمولی است. عواقب امروز…',
  },
];

apiRoute.get(async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: courseData });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
});

export default apiRoute;
