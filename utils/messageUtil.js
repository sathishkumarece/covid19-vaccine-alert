'use strict';

module.exports = {
    getCenterInfo: (center)=>{
       return `Center: ${center.name}
Address: ${center.address}
Block: ${center.block_name}
State: ${center.state_name}
District: ${center.district_name}
Pincode: ${center.pincode}
Fee: ${center.fee_type}`
    }, 

    getSessionInfo: (session) => {
       return `         Date: ${session.date}
        Vaccine: ${session.vaccine}
        Age limit: ${session.min_age_limit}+
        Dose1 Availability: ${session.available_capacity_dose1}
        Dose2 Availability: ${session.available_capacity_dose2}
                ***************************`
    }
}