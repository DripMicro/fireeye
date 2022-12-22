module.exports = (sequelize, Sequelize) => {
  const Scooter = sequelize.define('scooter', {
    firstname: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    lastname: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    phone: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    barcode: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    model: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    termen: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    problem: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    content: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    price: {
      type: Sequelize.STRING,
      defaultValue: '0'
    },
    statusId: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  });

  return Scooter;
};
