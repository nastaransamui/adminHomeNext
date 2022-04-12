const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import Users from '../../../models/Users';

import hazelCast from '../../../helpers/hazelCast';
// Pagination function
function paginate(array, usersPerPage, usersPageNumber) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice(
    (usersPageNumber - 1) * usersPerPage,
    usersPageNumber * usersPerPage
  );
}

const sort_by = (field, reverse, primer) => {
  const key = primer
    ? function (x) {
        return primer(x[field]);
      }
    : function (x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
};

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();

  const { usersPerPage, usersPageNumber, locale, usersSortBySorting } =
    req.body;
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      //Initiate catch HZ adn if Error continue with MONGO DB
      const { hzErrorConnection, hz } = await hazelCast();
      if (hzErrorConnection) {
        const userList = await Users.find({})
          .select('-password')
          .collation({ locale: locale })
          .sort({ [req.body['usersSortByField']]: usersSortBySorting });
        res.status(200).json({
          success: true,
          totalUsersLength: userList.length,
          data: paginate(userList, usersPerPage, usersPageNumber),
        });
      } else {
        // use Catch system with Hz
        const multiMap = await hz.getMultiMap('users');
        // await multiMap.destroy();
        const dataIsExist = await multiMap.containsKey('allUsers');
        if (dataIsExist) {
          const values = await multiMap.get('allUsers');
          for (const value of values) {
            res.status(200).json({
              success: true,
              totalUsersLength: value.length,
              data: paginate(
                value.sort(
                  sort_by(
                    [req.body['usersSortByField']],
                    usersSortBySorting > 0 ? false : true,
                    (a) => a.toUpperCase()
                  )
                ),
                usersPerPage,
                usersPageNumber
              ),
            });
          }
        } else {
          const userList = await Users.find({})
            .select('-password')
            .collation({ locale: locale })
            .sort({ [req.body['usersSortByField']]: usersSortBySorting });
          await multiMap.put('allUsers', userList);
          res.status(200).json({
            success: true,
            totalUsersLength: userList.length,
            data: paginate(userList, usersPerPage, usersPageNumber),
          });
        }
        await hz.shutdown();
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});
export default apiRoute;
