const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import Users from '../../../models/Users';
import { deleteMiddleware } from '../../../middleware/userMiddleware';
import { faker } from '@faker-js/faker';
import hazelCast from '../../../helpers/hazelCast';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(verifyToken, deleteMiddleware, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      // Fake user import
      // function randomIntFromInterval(min, max) {
      //   // min and max included
      //   return Math.floor(Math.random() * (max - min + 1) + min);
      // }
      // let timeSeriesData = [];
      // for (let i = 0; i < 1000; i++) {
      //   const firstName = faker.name.firstName();
      //   const lastName = faker.name.lastName();
      //   let user = {
      //     aboutMe: faker.lorem.paragraph(),
      //     accessToken: '',
      //     city: faker.address.city(),
      //     country: faker.address.city(),
      //     createdAt: faker.date.past(),
      //     facebook: [],
      //     google: [],
      //     isAdmin: true,
      //     isVercel: false,
      //     lastName,
      //     firstName,
      //     position: faker.company.companyName(),
      //     profileImage: faker.image.avatar(),
      //     prifleImageKey: '',
      //     password: 'U2FsdGVkX18zgs/96sTDYt7AWzAWISoS6vX/oGiqtAI=',
      //     twitter: [],
      //     updatedAt: faker.date.past(),
      //     userName: faker.internet.email(firstName, lastName),
      //   };
      //   timeSeriesData.push(user);
      // }
      // Users.insertMany(timeSeriesData);
      // res.status(200).json({
      //   success: true,
      //   totalUsersLength: timeSeriesData.length,
      // });
      Users.findByIdAndDelete(req.body._id, async (err, docs) => {
        if (err) {
          res.status(500).json({ success: false, Error: err.toString() });
        } else {
          const totalUser = await Users.find().select('-password');
          const { hzErrorConnection, hz } = await hazelCast();
          console.log(totalUser.length);
          console.log(req.body._id);
          if (!hzErrorConnection) {
            const multiMap = await hz.getMultiMap('users');
            await multiMap.destroy();
            await multiMap.put('allUsers', totalUser);
            await hz.shutdown();
          }
          res.status(200).json({
            success: true,
            totalUsersLength: totalUser.length,
          });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
