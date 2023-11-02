const express = require('express');
const { validationResult } = require('express-validator');
const seatsController = require('../controllers/seats');

const router = express.Router();

router.get('/getSeats', seatsController.getSeatsForFlight);

router.post('/book', [
    // Add express-validator validation for the request body
    // Example: check('flightNumber').isString().notEmpty(),
    //         check('seats').isArray().notEmpty(),
  ], async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    try {
      const payload = req.body;
      const result = await seatsController.bookSeats(payload);
  
      res.json(result);
    } catch (error) {
      console.error(`Error handling /book route: ${error.message}`);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

module.exports = router;