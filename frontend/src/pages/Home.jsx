import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";
import MainPageWrite from "../components/MainPageWrite";
import "../css/Home.css";
import MainPageImage from "../components/MainPageImage";

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
