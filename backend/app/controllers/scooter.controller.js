/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */

const jwt = require('jsonwebtoken');
const db = require('../models');

const config = require('../config/auth.config');

const JWT_SECRET = config.secret;

const Scooter = db.scooter;
const Company = db.company;
const { sequelize } = db;

exports.getScooter = (req, res) => {

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }


  Scooter
    .findAndCountAll()
    .then(data => {
      console.log("hello world", req.params);
      console.log("count", data.count);
      let page = (req.params.page && req.params.page) || 1;
      let sortfield = req.params.sort_by;
      let sortOrder = req.params.descending ? 'DESC' : 'ASC';
      let limit = req.params.rows_per_page || 10;
      let pages = Math.ceil(data.count / limit);
      let offset = limit * (page - 1);
      console.log(page);
      console.log(sortfield);
      console.log(limit);
      Scooter
        .findAll({
          limit: limit,
          offset: offset,
          order: [[sortfield || 'id', sortOrder || 'DESC']] // fixed at here
        })
        .then(users => {
          res.status(200).json({
            status: 1,
            message: "Data has been retrieved",
            result: users,
            count: data.count,
            pages: pages
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        status: 0,
        message: "Data is not retrieved from database"
      });
    });
  // Scooter.find({}).then((scooter) => {
  //     res.status(200).send(scooter);
  // });
};

exports.getManagerList = (req, res) => {
  sequelize
    .query('SELECT officeId, userId FROM `user_offices` WHERE isManager = 1', {
      type: sequelize.QueryTypes.SELECT
    })
    .then((users) => {
      res.status(200).send(users);
    });
};

exports.updateOfficeList = (req, res) => {
  const officeList = req.body;
  officeList.map((reqOffice) => {
    const updateValues = {
      emoji: reqOffice.emoji,
      name: reqOffice.name,
      capacity: reqOffice.capacity
    };
    Office.update(updateValues, { where: { id: reqOffice.id } });

    const sql = `UPDATE user_offices SET isManager = 0`;
    sequelize
      .query(sql, {
        type: sequelize.QueryTypes.UPDATE
      })
      .then(() => {
        reqOffice.managers.map((manager) => {
          const sql = `
          UPDATE user_offices
          SET isManager = 1
          WHERE userId = ${manager.id} and officeId = ${reqOffice.id};
        `;
          sequelize.query(sql, {
            type: sequelize.QueryTypes.UPDATE
          });
        });
      });
  });
  res.status(200).send('success');
};

exports.deleteOffice = (req, res) => {
  const { officeId } = req.body;
  Office.update(
    { isActive: 0 },
    {
      where: {
        id: officeId
      }
    }
  );
  res.status(200).send({ message: 'Deleted successfully!' });
};

exports.addScooter = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  console.log(req.body);

  // const accessToken = authorization.split(' ')[1];
  // const { companyId } = jwt.verify(accessToken, JWT_SECRET);
  Scooter.create(req.body).then((officeList) => {
    const data = {
      id: officeList.id
    };
    res.status(200).send(data);
  });

};

