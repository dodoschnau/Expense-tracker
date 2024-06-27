'use strict';

const categories = require('../public/jsons/categories.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', categories.results.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      createdAt: new Date,
      updatedAt: new Date()
    })))
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null)
  }
};
