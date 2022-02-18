const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

const testiContent = [
  {
    text_en:
      'Vivamus sit amet interdum elit. Proin lacinia erat ac velit tempus auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam nec ex aliquet, aliquam neque non.',
    name_en: 'John Doe',
    title_en: 'Chief Digital Officer',
    text_fa:
      'در حال حاضر زندگی کردن لذت بخش است. زمان انتخاب و نویسنده بود گاهی گرسنگی و گرسنگی باورنکردنی در مقابل او، به خصوص در گلو. حتی از موز هم نیست، بعضی ها اینطور نیستند.',
    name_fa: 'جان دو',
    title_fa: 'مدیر ارشد دیجیتال',
  },
  {
    text_en:
      'Vestibulum sit amet tortor sit amet libero lobortis semper at et odio. In eu tellus tellus. Pellentesque ullamcorper aliquet ultrices. Aenean facilisis vitae purus facilisis semper. Nam vitae scelerisque lorem, quis tempus libero.',
    name_en: 'Jean Doe',
    title_en: 'Chief Digital Officer',
    text_fa:
      'دوست داشتن همیشه در کارتن رایگان و متنفر بودن باید بسیار دردناک باشد. در سرزمین زمین مرد انتقام جو موز می آورد زندگی آسان انیاس همیشه پاک و آسان است. برای عمر وسیله نقلیه شکلاتی، هر زمان به صورت رایگان.',
    name_fa: 'ژان دو',
    title_fa: 'مدیر ارشد دیجیتال',
  },
  {
    text_en:
      'Cras convallis lacus orci, tristique tincidunt magna consequat in. In vel pulvinar est, at euismod libero.',
    name_en: 'Jena Doe',
    title_en: 'Graphic Designer',
    text_fa:
      'در دره دریاچه، مردم عادی، غمگین برای شروع با عواقب بزرگ است. بالشتک در مخمل است، اما خاطرات رایگان هستند.',
    name_fa: 'جنا دو',
    title_fa: 'طراح گرافیک',
  },
  {
    text_en: 'Sed imperdiet enim ligula, vitae viverra justo porta vel.',
    name_en: 'Jovelin Doe',
    title_en: 'Senior Graphic Designer',
    text_fa: 'اما ناجی زندگی فقط یک دروازه یا یک کارتون است.',
    name_fa: 'جوولین دو',
    title_fa: 'طراح ارشد گرافیک',
  },
  {
    text_en:
      'Cras convallis lacus orci, tristique tincidunt magna consequat in. In vel pulvinar est, at euismod libero.',
    name_en: 'Jihan Doe',
    title_en: 'CEO Software House',
    text_fa:
      'در دره دریاچه، مردم عادی، غمگین برای شروع با عواقب بزرگ است. بالشتک در مخمل است، اما خاطرات رایگان هستند.',
    name_fa: 'جیهان دو',
    title_fa: 'مدیر عامل خانه نرم افزار',
  },
  {
    text_en:
      'Vestibulum sit amet tortor sit amet libero lobortis semper at et odio. In eu tellus tellus. Pellentesque ullamcorper aliquet ultrices. Aenean facilisis vitae purus facilisis semper. Nam vitae scelerisque lorem, quis tempus libero.',
    name_en: 'Jovelin Doe',
    title_en: 'Senior Graphic Designer',
    text_fa:
      'دوست داشتن همیشه در کارتن رایگان و متنفر بودن باید بسیار دردناک باشد. در سرزمین زمین مرد انتقام جو موز می آورد زندگی آسان انیاس همیشه پاک و آسان است. برای عمر وسیله نقلیه شکلاتی، هر زمان به صورت رایگان.',
    name_fa: 'جوولین دو',
    title_fa: 'طراح ارشد گرافیک',
  },
];
apiRoute.get(async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: testiContent });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
});

export default apiRoute;
