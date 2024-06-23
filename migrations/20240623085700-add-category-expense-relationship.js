'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Expenses', 'categoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Expenses', 'categoryId')
  }
};
