import Navbar from "../components/Navbar";
import FlightsList from "../components/BookingList/FlightsList";
import LinearProgressWithLabel from "../components/MUIComponents/LinearProgressWithLabel";

const BookingList = () => {
  return (
    <div>
      <Navbar />
      <LinearProgressWithLabel value={25} />
      <FlightsList />
    </div>
  );
};

export default BookingList;
