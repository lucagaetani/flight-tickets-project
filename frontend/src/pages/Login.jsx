import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import LoginPageImage from "../components/LoginPageImage";
import LoginPageWrite from "../components/LoginPageWrite";

const Login = () => {
  return (
    <div>
      <Navbar />
      <LoginPageImage />
      <LoginPageWrite />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default Login;