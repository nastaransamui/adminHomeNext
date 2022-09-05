const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';
import Users from '../../../models/Users';
import Currencies from '../../../models/Currencies';
import Agencies from '../../../models/Agencies';

import Badge from '@mui/icons-material/Badge';
import AccountBox from '@mui/icons-material/AccountBox';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Public from '@mui/icons-material/Public';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

const createDashobardArray = (valuesList) => {
  let dashboardArray = [];
  valuesList.map((a) => {
    //Agent collection is empty add 0 data
    if (a.totalAgents == undefined) {
      a.totalAgents = {
        _id: 'agencies',
        totalAgents: 0,
        activeAgents: 0,
        deactiveAgents: 0,
      };
    }
    //Currency collection is empty add 0 data
    if (a.totalCurrency == undefined) {
      a.totalCurrency = { _id: 'currencies', totalCurrency: 0 };
    }
    //country collection is empty add 0 data
    if (a.totalCountries == undefined) {
      a.totalCountries = { _id: 'countries', totalCountries: 0 };
    }
    Object.keys(a).map((key, i) => {
      let header_icon = '';
      let show = '';
      let social = '';
      let color = '';
      let title_en = '';
      let title_fa = '';
      let firstNumber = '';
      let secondNumber = '';
      let unit = '';
      let footer_icon = '';
      let footer_en = '';
      let footer_fa;
      switch (a[key]._id) {
        case 'users':
          header_icon = Badge.type?.render().props.children.props.d;
          show = true;
          social = false;
          color = 'warning';
          title_en = 'Users: Total / Actvie';
          title_fa = 'مجموع کاربران';
          firstNumber = `${a[key].totalUsers}`;
          secondNumber = `${a[key].activeUsers}`;
          unit = '';
          footer_icon = 'warning';
          footer_en = `Deactivate users ${a[key].deactiveUsers}`;
          footer_fa = `کاربران غیر فعال ${a[key].deactiveUsers}`;
          break;
        case 'agencies':
          header_icon = AccountBox.type?.render().props.children.props.d;
          show = true;
          social = false;
          color = 'dark';
          title_en = 'Agents: Total/Active';
          title_fa = 'مجموع نمایندگان';
          firstNumber = `${a[key].totalAgents}`;
          secondNumber = `${a[key].activeAgents}`;
          unit = '';
          footer_icon = 'warning';
          footer_en = `Deactivate agents ${a[key].deactiveAgents}`;
          footer_fa = `نمایندگان غیر فعال ${a[key].deactiveAgents}`;
          break;
        case 'currencies':
          header_icon = AttachMoney.type?.render().props.children.props.d;
          show = true;
          social = false;
          color = 'danger';
          title_en = 'Active currencies';
          title_fa = 'ارزهای فعال';
          firstNumber = `${a[key].totalCurrency}`;
          break;
        case 'countries':
          header_icon = Public.type?.render().props.children.props.d;
          show = true;
          social = true;
          color = 'info';
          title_en = 'Active countries';
          title_fa = 'کشورهای فعال';
          firstNumber = `${a[key].totalCountries}`;
          break;
        default:
          console.log(a[key]._id);
          console.log(i);
          break;
      }
      dashboardArray.push({
        header_icon: header_icon,
        show: show,
        social: social,
        color: color,
        'title_en-US': title_en,
        title_fa: title_fa,
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        unit: unit,
        footer_icon: footer_icon,
        'footer_en-US': footer_en,
        footer_fa: footer_fa,
      });
    });
  });
  return dashboardArray;
};

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { hzErrorConnection, hz } = await hazelCast();
      console.log({ hzErrorConnection });
      async function dbAggregate() {
        var valuesList = await Users.aggregate([
          {
            $facet: {
              totalUsers: [
                {
                  $group: {
                    _id: 'users',
                    totalUsers: { $sum: 1 },
                    activeUsers: { $sum: { $cond: ['$isAdmin', 1, 0] } },
                    deactiveUsers: { $sum: { $cond: ['$isAdmin', 0, 1] } },
                  },
                },
              ],
            },
          },
          {
            $unwind: { path: '$totalUsers', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'agencies',
              as: 'totalAgents',
              pipeline: [
                {
                  $group: {
                    _id: 'agencies',
                    totalAgents: { $sum: 1 },
                    activeAgents: { $sum: { $cond: ['$isActive', 1, 0] } },
                    deactiveAgents: { $sum: { $cond: ['$isActive', 0, 1] } },
                  },
                },
              ],
            },
          },
          {
            $unwind: { path: '$totalAgents', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'currencies',
              as: 'totalCurrency',
              pipeline: [
                { $group: { _id: 'currencies', totalCurrency: { $sum: 1 } } },
              ],
            },
          },
          {
            $unwind: {
              path: '$totalCurrency',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'countries',
              as: 'totalCountries',
              pipeline: [
                { $group: { _id: 'countries', totalCountries: { $sum: 1 } } },
              ],
            },
          },
          {
            $unwind: {
              path: '$totalCountries',
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
        if (valuesList.length !== 0) {
          const dashboardArray = createDashobardArray(valuesList);
          res.status(200).json({ success: true, data: dashboardArray });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      }
      if (hzErrorConnection) {
        await dbAggregate();
      } else {
        // use Catch system with Hz
        const multiMapu = await hz.getMultiMap('Users');
        const multiMapc = await hz.getMultiMap('Countries');
        const multiMapCu = await hz.getMultiMap('Currencies');
        const multiMapAg = await hz.getMultiMap('Agencies');
        const usersIsExist = await multiMapu.containsKey(`allUsers`);
        const countriesIsExist = await multiMapc.containsKey(`allCountries`);
        const currenciesIsExist = await multiMapCu.containsKey(`allCurrencies`);
        const agenciesIsExist = await multiMapAg.containsKey(`allAgencies`);
        if (
          usersIsExist &&
          countriesIsExist &&
          currenciesIsExist &&
          agenciesIsExist
        ) {
          let valuesList = [
            {
              totalUsers: {},
              totalAgents: {},
              totalCurrency: {},
              totalCountries: {},
            },
          ];
          const users = await multiMapu.get(`allUsers`);
          const agencies = await multiMapAg.get(`allAgencies`);
          const currencies = await multiMapCu.get(`allCurrencies`);
          const countries = await multiMapc.get(`allCountries`);
          for (const user of users) {
            valuesList[0].totalUsers._id = 'users';
            valuesList[0].totalUsers.totalUsers = user.length;
            valuesList[0].totalUsers.activeUsers = user.filter(
              (a) => a.isAdmin
            ).length;
            valuesList[0].totalUsers.deactiveUsers = user.filter(
              (a) => !a.isAdmin
            ).length;
          }
          for (const agent of agencies) {
            valuesList[0].totalAgents._id = 'agencies';
            valuesList[0].totalAgents.totalAgents = agent.length;
            valuesList[0].totalAgents.activeAgents = agent.filter(
              (a) => a.isActive
            ).length;
            valuesList[0].totalAgents.deactiveAgents = agent.filter(
              (a) => !a.isActive
            ).length;
          }
          for (const currency of currencies) {
            valuesList[0].totalCurrency._id = 'currencies';
            valuesList[0].totalCurrency.totalCurrency = currency.length;
          }
          for (const country of countries) {
            valuesList[0].totalCountries._id = 'countries';
            valuesList[0].totalCountries.totalCountries = country.length;
          }
          const dashboardArray = createDashobardArray(valuesList);
          res.status(200).json({ success: true, data: dashboardArray });
          await hz.shutdown();
        } else {
          await dbAggregate();
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
