const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Tip = db.define('Tip', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
})

Tip.belongsTo(User)
User.hasMany(Tip)

module.exports = Tip