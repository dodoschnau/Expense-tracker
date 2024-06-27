'use strict';

const expenses = require('../public/jsons/expenses.json')
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    let transaction

    try {

      transaction = await queryInterface.sequelize.transaction()

      // Insert Users first
      const hash = await bcrypt.hash('12345678', 10)
      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          name: '廣志',
          email: 'User1@example.com',
          password: hash,
          createdAt: new Date,
          updatedAt: new Date()
        },
        {
          id: 2,
          name: '小新',
          email: 'User2@example.com',
          password: hash,
          createdAt: new Date,
          updatedAt: new Date()
        },
      ], { transaction })

      // Insert expenses Finally
      await queryInterface.bulkInsert('Expenses', expenses.results.map((expense, index) => ({
        id: expense.id,
        name: expense.name,
        date: expense.date,
        amount: expense.amount,
        categoryId: 1,
        userId: index < 3 ? 1 : 2,
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
    await queryInterface.bulkDelete('Expenses', null)
    await queryInterface.bulkDelete('Users', null)
  }
};
