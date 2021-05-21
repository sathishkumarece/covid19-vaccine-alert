'use strict';

module.exports = (sequelize, DataTypes)=>{
    const Alert = sequelize.define('Alert', {
      state: DataTypes.INTEGER,
      district: DataTypes.INTEGER,
      pincode: DataTypes.INTEGER,
      vaccine_name: DataTypes.STRING,
      min_age: DataTypes.INTEGER,
      fee_type: DataTypes.STRING,
      dose_type: DataTypes.INTEGER,
      day_range: DataTypes.INTEGER,
      alert_frequency: DataTypes.INTEGER,
      phone_no: DataTypes.TEXT,
      email: DataTypes.STRING
    },{})
  
    return Alert;
  }