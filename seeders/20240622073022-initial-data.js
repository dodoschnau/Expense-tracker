'use strict';

const expenses = require('../public/jsons/expenses.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Expenses', expenses.results.map(expense => ({
      name: expense.name,
      date: expense.date,
      amount: expense.amount,
      createdAt: new Date,
      updatedAt: new Date()
    })
    ))
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Expenses', null)
  }
};