import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FlightsList from "../components/BookingList/FlightsList"

const BookingList = () => {
  return (
    <div>
      <Navbar />
      <FlightsList />
      <Footer />
    </div>
  );
};

export default BookingList;