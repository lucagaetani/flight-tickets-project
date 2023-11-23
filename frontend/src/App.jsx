import './wdyr';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BookingList from "./pages/BookingList";
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";
import Register from "./pages/Register";
import BookingSeats from "./pages/BookingSeats";
import BookingInfo from "./pages/BookingInfo";
import PrivateRoute from "./utils/PrivateRoute";
import { ThemeProvider } from "@emotion/react";
import { createTheme, responsiveFontSizes } from "@mui/material";

let THEME = createTheme({
  typography: {
   "fontFamily": `"Montserrat", sans-serif`,
   "fontSize": 14,
   "fontWeightLight": 300,
   "fontWeightRegular": 400,
   "fontWeightMedium": 500
  }
});
THEME = responsiveFontSizes(THEME);

const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/booking" element={<BookingList />} />
          <Route path="/seats" element={<PrivateRoute />}> 
            <Route path='/seats' element={<BookingSeats/>}/>
          </Route>
          <Route path="/info" element={<PrivateRoute />}> 
            <Route path='/info' element={<BookingInfo/>}/>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<PrivateRoute />}> 
            <Route path="/user" element={<UserPage />} />
          </Route>
          <Route path="/register" exact element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
