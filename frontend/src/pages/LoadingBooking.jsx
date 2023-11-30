import Navbar from "../components/Navbar";
import LinearProgressWithLabel from "../components/MUIComponents/LinearProgressWithLabel";
import Loading from "../components/LoadingBooking/Loading";

const BookingList = () => {
  return (
    <div>
      <Navbar />
      <LinearProgressWithLabel value={50} />
      <Loading />
    </div>
  );
};

export default BookingList;