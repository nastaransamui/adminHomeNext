const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

const categoriesData = [
  {
    img: 'https://picsum.photos/300/440',
    title_en: 'Photography',
    desc_en: 'Nulla lobortis nunc vitae nisi semper semper.',
    title_fa: 'عکاسی',
    desc_fa: 'هیچ سیاستی در حال حاضر برای زندگی وجود ندارد، اما همیشه همیشه.',
  },
  {
    img: 'https://unsplash.it/300/440/?random',
    title_en: 'Artificial Intelligence',
    desc_en: 'Nulla lobortis nunc vitae nisi semper semper.',
    title_fa: 'هوش مصنوعی',
    desc_fa: 'هیچ سیاستی در حال حاضر برای زندگی وجود ندارد، اما همیشه همیشه.',
  },
  {
    img: 'https://picsum.photos/id/1019/300/440',
    title_en: 'Architect',
    desc_en: 'Nulla lobortis nunc vitae nisi semper semper.',
    title_fa: 'معمار',
    desc_fa: 'هیچ سیاستی در حال حاضر برای زندگی وجود ندارد، اما همیشه همیشه.',
  },
  {
    img: 'https://picsum.photos/id/1025/300/440',
    title_en: 'Geography',
    desc_en: 'Nulla lobortis nunc vitae nisi semper semper.',
    title_fa: 'جغرافیا',
    desc_fa: 'هیچ سیاستی در حال حاضر برای زندگی وجود ندارد، اما همیشه همیشه.',
  },
  {
    img: 'https://picsum.photos/id/1027/300/440',
    title_en: 'Art',
    desc_en: 'Nulla lobortis nunc vitae nisi semper semper.',
    title_fa: 'هنر',
    desc_fa: 'هیچ سیاستی در حال حاضر برای زندگی وجود ندارد، اما همیشه همیشه.',
  },
];

apiRoute.get(async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: categoriesData });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
});

export default apiRoute;
