import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LuggagesUserInfo from "../components/BookingInfo/LuggagesUserInfo";
import LinearProgressWithLabel from "../components/MUIComponents/LinearProgressWithLabel";

const BookingList = () => {
  return (
    <div>
      <Navbar />
      <LinearProgressWithLabel value={75} />
      <LuggagesUserInfo />
      <Footer />
    </div>
  );
};

export default BookingList;
