import nextConnect from 'next-connect';
import Users from '../../../models/Users';
import dbConnect from '../../../helpers/dbConnect';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    const _id = req.body._id;
    try {
      Users.findOne({ _id: _id }).then(async (oldUser) => {
        oldUser.accessToken = '';
        await oldUser.save();
        res.status(200).json({ success: true, user: null });
      });
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
