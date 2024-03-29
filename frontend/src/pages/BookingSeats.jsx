import Navbar from "../components/Navbar";
import SeatPicker from "../components/BookingSeats/SeatPicker";
import LinearProgressWithLabel from "../components/MUIComponents/LinearProgressWithLabel";

const BookingList = () => {
  return (
    <div>
      <Navbar />
      <LinearProgressWithLabel value={50} />
      <SeatPicker />
    </div>
  );
};

export default BookingList;
