import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm"
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
