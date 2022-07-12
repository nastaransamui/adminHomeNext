import nextConnect from 'next-connect';
import { authenticate, localStrategy } from '../../../middleware/passport';
import passport from 'passport';
import cors from 'cors';
import { updateAccessToken, createUserIsEmpty } from '../../../helpers/auth';
import dbConnect from '../../../helpers/dbConnect';

passport.use(localStrategy);
const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute
  .use(cors())
  .use(passport.initialize())
  .post(createUserIsEmpty, async (req, res) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      const { strategy } = req.body;
      try {
        const user = await authenticate(strategy, req, res);
        if (!user.message) {
          const { accessToken, accessRole, errorMessage } =
            await updateAccessToken(user, res);
          if (errorMessage !== null) {
            res.status(401).send(errorMessage);
          } else {
            res.status(200).send({
              success: true,
              accessToken: accessToken,
              accessRole: accessRole,
            });
          }
        } else {
          res.send({ success: false, user });
        }
      } catch (error) {
        res.status(401).send(error.message);
      }
    }
  });

export default apiRoute;
