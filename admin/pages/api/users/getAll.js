const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import Users from '../../../models/Users';

// Pagination function
function paginate(array, usersPerPage, usersPageNumber) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice(
    (usersPageNumber - 1) * usersPerPage,
    usersPageNumber * usersPerPage
  );
}

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
      const userList = await Users.find({})
        .select('-password')
        .collation({ locale: locale })
        .sort({ [req.body['usersSortByField']]: usersSortBySorting });
      res.status(200).json({
        success: true,
        totalUsersLength: userList.length,
        data: paginate(userList, usersPerPage, usersPageNumber),
      });
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});
export default apiRoute;
