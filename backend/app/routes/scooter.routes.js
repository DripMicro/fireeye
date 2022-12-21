const controller = require('../controllers/scooter.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // --------------------- Office Getting List section --------------------------------------------------------------

  // --------------------- Office CRUD section --------------------------------------------------------------
  app.post('/api/scooter', controller.addScooter);
  app.get('/api/scooter', controller.getScooter);
  
  // -----------------------------------------------------------------------------------
};
