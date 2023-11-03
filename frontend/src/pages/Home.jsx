import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingForm from "../components/Home/BookingForm";
import MainPageWrite from "../components/Home/MainPageWrite";
import "../css/Home.css";
import MainPageImage from "../components/Home/MainPageImage";
import OtherGraphics from "../components/Home/OtherGraphics";

const Home = () => {
  return (
    <div>
      <Navbar />
      <MainPageImage />
      <MainPageWrite />
      <BookingForm />
      <OtherGraphics />
      <Footer />
    </div>
  );
};

export default Home;
