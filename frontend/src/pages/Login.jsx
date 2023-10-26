import NavbarWithoutLogin from "../components/NavbarWithoutLogin";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import LoginPageImage from "../components/LoginPageImage";
import LoginPageWrite from "../components/LoginPageWrite";

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