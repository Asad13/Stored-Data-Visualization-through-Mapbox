const express = require('express');
const { getIncidents, addIncident } = require('../controllers/incidents');

const router = express.Router();

/*router.get('/',(req,res) => {
    res.send("Hello");
});*/
router.route('/').get(getIncidents).post(addIncident);

module.exports = router;