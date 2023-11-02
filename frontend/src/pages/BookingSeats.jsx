import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SeatPicker from "../components/BookingSeats/BookingSeats"

const BookingList = () => {
  return (
    <div>
      <Navbar />
      <SeatPicker />
      <Footer />
    </div>
  );
};

export default BookingList;