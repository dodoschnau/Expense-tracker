'use strict';

const expenses = require('../public/jsons/expenses.json')
const categories = require('../public/jsons/categories.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    let transaction

    try {

      transaction = await queryInterface.sequelize.transaction()

      await queryInterface.bulkInsert('Categories', categories.results.map(category => ({
        name: category.name,
        icon: category.icon,
        createdAt: new Date,
        updatedAt: new Date()
      })), { transaction })

      await queryInterface.bulkInsert('Expenses', expenses.results.map(expense => ({
        name: expense.name,
        date: expense.date,
        amount: expense.amount,
        categoryId: 3,
        createdAt: new Date,
        updatedAt: new Date()
      })), { transaction })

      await transaction.commit()

    } catch (error) {
      console.error('Error in seeding: ', error)
      if (transaction) await transaction.rollback()
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null)
    await queryInterface.bulkDelete('Expenses', null)
  }
};