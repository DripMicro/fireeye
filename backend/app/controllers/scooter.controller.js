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
      let page = (req.query.page && req.query.page) || 1;
      let sortfield = req.query.sort_by;
      let sortOrder = req.query.descending == 'true' ? 'DESC' : 'ASC';
      let limit = req.query.rows_per_page * 1 || 10;
      let pages = Math.ceil(data.count / limit);
      let offset = limit * (page - 1);
      let search = req.query.search;

       Scooter
          .findAll({
            limit: limit,
            offset: offset,
            order: [[sortfield || 'id', sortOrder || 'ASC']], // fixed at here
            where: {
              firstname: {$regex : search}
            }
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
};

exports.getEditScooter = (req, res) => {

  
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  req.query.id
  
      Scooter
        .findOne({
           where: { id: req.query.id } 
        })
        .then(users => {
          res.status(200).json({
            status: 1,
            message: "Data has been retrieved",
            result: users,
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

exports.getSearchScooter = (req, res) => {
    Scooter
        .findAll({
           where: { id:  {'$regex': req.query.search} } 
        })
        .then(users => {
          res.status(200).json({
            status: 1,
            message: "Data has been retrieved",
            result: users,
          });
    })
    .catch(err => {
      res.status(500).json({
        status: 0,
        message: "Data is not retrieved from database"
      });
    });
};

exports.updateScooter = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

    const updateValues = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone, 
      barcode: req.body.barcode,
      model: req.body.model,
      termen: req.body.termen,
      problem: req.body.problem,
      price: req.body.price,
      statusId: req.body.statusId
    };
    Scooter.update(updateValues, { where: { id: req.body.id } }).then((data) => {
      res.status(200).send(data);
    });

};

exports.deleteScooter = (req, res) => {
  sequelize
    .query('DELETE FROM scooters WHERE id = ' + req.params.id , {
      type: sequelize.QueryTypes.DELETE
    })
    .then((users) => {
      res.status(200).send({ message: 'Deleted successfully!' });
    });
  // Scooter.deleteOne({ id: req.params.id }).then((data) => {
  //   res.status(200).send({ message: 'Deleted successfully!' });
  // })
};

exports.addScooter = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }


  // const accessToken = authorization.split(' ')[1];
  // const { companyId } = jwt.verify(accessToken, JWT_SECRET);
  Scooter.create(req.body).then((officeList) => {
    const data = {
      id: officeList.id
    };
    res.status(200).send(data);
  });

};

