import NavbarWithoutLogin from "../components/Login/NavbarWithoutLogin";
import Footer from "../components/Footer";
import LoginForm from "../components/Login/LoginForm";
import LoginPageImage from "../components/Login/LoginPageImage";
import LoginPageWrite from "../components/Login/LoginPageWrite";

const Login = () => {
  return (
    <div>
      <NavbarWithoutLogin />
      <LoginPageImage />
      <LoginPageWrite />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default Login;
