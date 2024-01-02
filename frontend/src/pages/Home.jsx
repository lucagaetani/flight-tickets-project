import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingForm from "../components/Home/BookingForm";
import "../css/Home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Home;
