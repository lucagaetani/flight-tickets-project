import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingForm from "../components/Home/BookingForm";
import "../css/Home.css";
import OtherGraphics from "../components/Home/OtherGraphics";

const Home = () => {
  return (
    <div>
      <Navbar />
      <BookingForm />
      <OtherGraphics />
      <Footer />
    </div>
  );
};

export default Home;
