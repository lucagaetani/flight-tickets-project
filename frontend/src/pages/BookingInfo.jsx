import Navbar from "../components/Navbar";
import LuggagesUserInfo from "../components/BookingInfo/LuggagesUserInfo";
import LinearProgressWithLabel from "../components/MUIComponents/LinearProgressWithLabel";

const BookingInfo = () => {
  return (
    <div>
      <Navbar />
      <LinearProgressWithLabel value={75} />
      <LuggagesUserInfo />
    </div>
  );
};

export default BookingInfo;
