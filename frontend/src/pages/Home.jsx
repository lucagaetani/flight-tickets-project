import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MainPage from "../components/MainPage"
import "../css/Home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <MainPage />
      <Footer />
    </div>
  );
};

export default Home;
