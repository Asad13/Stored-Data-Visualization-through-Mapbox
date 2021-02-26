const Incident = require('../models/Incident');

// @desc Get all Incidents
// @route GET /api/v1/incidents
// @access Public

exports.getIncidents = async (req , res , next) => {
    try {
        const incidents = await Incident.find();

        return res.status(200).json({
            success: true,
            count: incidents.length,
            data: incidents 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Server error'
        });
    }
};

// @desc add an Incident
// @route POST /api/v1/incidents
// @access Public

exports.addIncident = async (req , res , next) => {
    try {
        //console.log(req.body);
        const incident = await Incident.create(req.body);

        return res.status(200).json({
            success: true,
            data: incident 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Server error'
        });
    }
};