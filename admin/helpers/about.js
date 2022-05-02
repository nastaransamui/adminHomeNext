import dbConnect from './dbConnect';
import About from '../models/About';
import mongoose from 'mongoose';

export async function createAboutIsEmpty(req, res, next) {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    const isVercel =
      process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;

    const firstThumb = isVercel
      ? 'https://recminvestment.s3.ap-southeast-1.amazonaws.com/about/l1zbvg/1.jpg'
      : 'http://localhost:4000/admin/about/l1zbvg/1.jpg';
    const firstThumbKey = isVercel
      ? 'about/l1zbvg/1.jpg'
      : '/home/majid/host/work/adminHomeNext/admin/public/about/l1zbvg/1.jpg';

    const secondThumb = isVercel
      ? 'https://recminvestment.s3.ap-southeast-1.amazonaws.com/about/l1zbvg/2.jpg'
      : 'http://localhost:4000/admin/about/l1zbvg/2.jpg';
    const secondThumbKey = isVercel
      ? 'about/l1zbvg/2.jpg'
      : '/home/majid/host/work/adminHomeNext/admin/public/about/l1zbvg/2.jpg';
    const thirdThumb = isVercel
      ? 'https://recminvestment.s3.ap-southeast-1.amazonaws.com/about/l1zbvg/3.jpg'
      : 'http://localhost:4000/admin/about/l1zbvg/3.jpg';
    const thirdThumbKey = isVercel
      ? 'about/l1zbvg/3.jpg'
      : '/home/majid/host/work/adminHomeNext/admin/public/about/l1zbvg/3.jpg';

    const about = {
      title_en: 'About us',
      title_fa: 'درباره ما',
      desc_en:
        'Our mission is to diversify the tech industry through accessible education and apprenticeship, unlocking the door to opportunity and empowering people to achieve their dreams.',
      desc_fa:
        'ماموریت ما تنوع بخشیدن به صنعت فناوری از طریق آموزش و کارآموزی در دسترس، باز کردن قفل فرصت ها و توانمندسازی افراد برای رسیدن به رویاهایشان است.',
      button_en: 'Join Now',
      button_fa: 'ملحق شوید',
      firstThumb: firstThumb,
      firstThumbKey: firstThumbKey,
      firstTop: 15,
      firstRight: -69,
      secondThumb: secondThumb,
      secondThumbKey: secondThumbKey,
      secondTop: 4,
      secondRight: -69,
      thirdThumb: thirdThumb,
      thirdThumbKey: thirdThumbKey,
      thirdTop: 20,
      thirdRight: -84,
      finalFolder: 'about',
      modelName: 'About',
      folderId: 'l1zbvg',
      isVercel: isVercel,
    };
    try {
      const { modelName } = req.body;
      var collection = mongoose.model(modelName);
      const newValue = await new collection(about);
      await newValue.save(async (err, result) => {
        if (err) {
          res.status(403).json({
            success: false,
            Error: err.toString(),
            ErrorCode: err?.code,
          });
        } else {
          res.status(200).json({
            success: true,
            data: result,
          });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
}
