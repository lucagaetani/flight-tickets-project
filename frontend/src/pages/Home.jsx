import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingForm from "../components/Home/BookingForm";
import MainPageWrite from "../components/Home/MainPageWrite";
import "../css/Home.css";
import MainPageImage from "../components/Home/MainPageImage";

const Home = () => {
  return (
    <div>
      <Navbar />
      <MainPageImage />
      <MainPageWrite />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Home;
