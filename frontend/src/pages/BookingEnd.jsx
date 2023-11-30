import Navbar from "../components/Navbar";
import LinearProgressWithLabel from "../components/MUIComponents/LinearProgressWithLabel";
import End from "../components/BookingEnd/End";

const BookingEnd = () => {
  return (
    <div>
      <Navbar />
      <LinearProgressWithLabel value={100} />
      <End />
    </div>
  );
};

export default BookingEnd;