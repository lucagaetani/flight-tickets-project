/**
 * What is this?
 * 
 * It's a stress test made with Grafana k6 and xk6. I used it to test concurrency on Bookings' REST API
 * It needs a k6 executable in the same directory (stress-test) as the script to run it
 */

import http from 'k6/http';
import { check } from 'k6';


export const options = {
  stages: [
    { duration: '1s', target: 1 },
    { duration: '1s', target: 0 },
  ],
};

export default function () {
  const urlLogin = 'http://localhost:3000/users/login';
  const payloadLogin = JSON.stringify({
    email: 'stress@test.com',
    password: 'Qwerty12.-',
  });

  const paramsLogin = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const authResponse = http.get(urlLogin, payloadLogin, paramsLogin);

  check(authResponse, {
    'Login Status is 200': (r) => r.status === 200,
  });

  const url = 'http://localhost:3000/bookings/insertBookings';

  const payload1 = JSON.stringify({flightState: {
    seatsFlightsDeparture: [
      [
        {
          seatName: "adult-0",
          seatNumber: "B2",
          seatPrice: 55,
          flightNumber: "U2 2039",
          itineraryId: 4,
          arrayPassengerInfo: {
              name: "Paolo",
              surname: "Luigini",
              email: "paolo.luigini@gmail.com",
              phone: "3283724757",
              "airplane-luggage": "",
              "hold-luggage": 1
          }
        }
      ],
      [
        {
          seatName: "adult-0",
          seatNumber: "C1",
          seatPrice: 50,
          flightNumber: "U2 2835",
          itineraryId: 4,
          arrayPassengerInfo: {
              name: "Paolo",
              surname: "Luigini",
              email: "paolo.luigini@gmail.com",
              phone: "3283724757",
              "airplane-luggage": "",
              "hold-luggage": 1
          }
        }
      ]
    ],
    userEmail: "stress@test.com"
  }});

  const payload2 = JSON.stringify({flightState: {
    seatsFlightsDeparture: [
      [
        {
          seatName: "adult-0",
          seatNumber: "B2",
          seatPrice: 55,
          flightNumber: "U2 2039",
          itineraryId: 4,
          arrayPassengerInfo: {
              "name": "Mario",
              "surname": "Rossi",
              "email": "mario.rossi@gmail.com",
              "phone": "7879878789",
              "airplane-luggage": "",
              "hold-luggage": ""
          }
        }
      ],
      [
        {
          seatName: "adult-0",
          seatNumber: "A1",
          seatPrice: 50,
          flightNumber: "U2 2835",
          itineraryId: 4,
          arrayPassengerInfo: {
              "name": "Mario",
              "surname": "Rossi",
              "email": "luca.bacucca@gmail.com",
              "phone": "7879878789",
              "airplane-luggage": "",
              "hold-luggage": ""
          }
        }
      ]
    ],
    userEmail: "stress@test.com"
  }});

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const responses = http.batch([
    ['POST', url, payload1, params],
    ['POST', url, payload2, params],
  ]);

  check(responses[0], {
    'Status is 200': (r) => r.status === 200,
  });

  check(responses[1], {
    'Status is 200': (r) => r.status === 200,
  });
}