import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RegisterForm from "../components/Register/RegisterForm";
import RegisterPageWrite from "../components/Register/RegisterPageWrite";
import RegisterPageImage from "../components/Register/RegisterPageImage";

const Register = () => {
  return (
    <div>
      <Navbar />
      <RegisterPageImage />
      <RegisterPageWrite />
      <RegisterForm />
      <Footer />
    </div>
  );
};

export default Register;
