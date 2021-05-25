'use strict';

module.exports = (sequelize, DataTypes)=>{
    const District = sequelize.define('District', {
      state_id: DataTypes.INTEGER,
      district_id: DataTypes.INTEGER,
      district_name: DataTypes.STRING,
    },{})
  
    return District;
  }