import Navbar from "../components/Navbar";

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