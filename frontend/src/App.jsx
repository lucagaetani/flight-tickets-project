import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BookingList from './pages/BookingList';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/booking" element={<BookingList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/register" exact element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;