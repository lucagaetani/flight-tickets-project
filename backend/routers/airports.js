//Routers for Airports
const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const validateAirports = [
    body('IATA_code')
    .trim()
    .notEmpty()
    .isLength({max: 3})
    .withMessage('Invalid IATA_code'),
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Invalid email')
];

const airportsController = require('../controllers/airports');

router.get('/airports', async (req, res) => {
    try {
        const result = await airportsController.getAirports();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error. Please retry' });
    }
});

router.post('/airports', validateAirports, async (req, res) => {
    // Controlla eventuali errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
  
    try {
        //Chiama il controller se i dati passati sono ok
        const result = await airportsController.insertAirports(req.body);
        res.json({ message: 'Airport added to the database', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error. Airport could not be added.' });
    }
})
  
module.exports = router;
