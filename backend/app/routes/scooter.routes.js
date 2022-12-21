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
  app.get('/api/scooter', controller.getScooter);
  app.get('/api/scooter/edit', controller.getEditScooter);
  app.post('/api/scooter', controller.addScooter);
  app.put('/api/scooter', controller.updateScooter);
  app.delete('/api/scooter/:id', controller.deleteScooter);
  
  // -----------------------------------------------------------------------------------
};
