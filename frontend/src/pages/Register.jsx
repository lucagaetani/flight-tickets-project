import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RegisterForm from "../components/RegisterForm";
import RegisterPageWrite from "../components/RegisterPageWrite";
import RegisterPageImage from "../components/RegisterPageImage";

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