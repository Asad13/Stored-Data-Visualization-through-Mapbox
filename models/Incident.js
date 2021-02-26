const mongoose = require('mongoose');

/*
 ["incidentDate", "hour", "minute", "meridiem", "borough", "address", "resident", "notified", "crossStreet", "identifiers", "incidentdesc", "witness", "injured", "injureddesc", "treatment", "treatmentPlace", "officersName", "officersBadge", "officersCar"]
*/
const IncidentSchema = new mongoose.Schema({
    longitude:{
        type: Number,
        required: [true,'Please click on a precinct']
    },
    latitude:{
        type: Number,
        required: [true,'Please click on a precinct']
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number]
        }
    },
    incidentDate: {
        type: String
    },
    hour: {
        type: String
    },
    minute: {
        type: String
    },
    meridiem: {
        type: String
    },
    borough: {
        type: String
    },
    address: {
        type: String
    },
    resident: {
        type: String 
    },
    notified: {
        type: String 
    },
    crossStreet: {
        type: String 
    },
    identifiers: {
        type: String 
    },
    incidentdesc: {
        type: String 
    },
    witness: {
        type: String 
    },
    injured: {
        type: String 
    },
    injureddesc: {
        type: String 
    },
    treatment: {
        type: String 
    },
    treatmentPlace: {
        type: String
    },
    officersName: {
        type: String
    },
    officersBadge: {
        type: String
    },
    officersCar: {
        type: String
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
});


// Create Location
IncidentSchema.pre('save', async function(next){
   this.location = {
       type: 'Point',
       coordinates: [this.longitude,this.latitude]
   };
   //For not saving any field
   // this.field = undefined
   next();
});

module.exports = mongoose.model('Incident',IncidentSchema);