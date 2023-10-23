import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="big-write">Where do you want to go today?</div>
      <div className="booking-container">
        {/* Add your booking ticket flight component here */}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
