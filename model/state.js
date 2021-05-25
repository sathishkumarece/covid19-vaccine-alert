'use strict';

module.exports = (sequelize, DataTypes)=>{
    const State = sequelize.define('State', {
      state_id: DataTypes.INTEGER,
      state_name: DataTypes.STRING,
    },{})
  
    return State;
  }