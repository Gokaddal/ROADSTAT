import { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
//import { authenticationService } from '../../../Backend/src/_services';
import "./loginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { user, login, message, clearMessage } = useAuth();
  const initialValues = {
    identifier: "", // Can be username or email
    password: "",
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (message.text) {
      // Optionally show or handle message text
      clearMessage();
    }
  }, [message, clearMessage]);

  const onSubmit = async (
    { identifier, password },
    { setStatus, setSubmitting }
  ) => {
    setStatus(null);
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      // Dynamically construct payload
      const payload = {
        ...(isEmail ? { email: identifier } : { username: identifier }),
        password,
      };

      await login(payload);
      const { from } = navigate.location?.state?.from || {
        from: { pathname: "/" },
      };
      navigate(from);
    } catch (error) {
      setSubmitting(false);
      setStatus(error);
    }
  };

  return (
    <div className="login_bg">
      <div className="logos">
        <img
          src="/images/companyLogo.png"
          alt="Logo"
          className="company_logo"
        />
        <img src="/images/roadstatLogo.png" alt="Logo" className="road_logo" />
      </div>
      <div className="half_login">
        <div className="login_page">
          <h2 className="login">Login</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              identifier: Yup.string().required(
                "Username or Email is required"
              ),
              password: Yup.string().required("Password is required"),
            })}
            onSubmit={onSubmit}
          >
            {({ errors, status, touched, isSubmitting }) => (
              <Form>
                <div className="login_forms">
                  <Field
                    type="text"
                    name="identifier"
                    className={
                      "text_bar" +
                      (errors.identifier && touched.identifier
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="Username or Email"
                  />
                  <div className="error_message">
                    <ErrorMessage name="identifier" />
                  </div>
                </div>

                <Field
                  type="password"
                  name="password"
                  className={
                    "text_bar" +
                    (errors.password && touched.password ? " is-invalid" : "")
                  }
                  placeholder="Password"
                />
                <div className="error_message">
                  <ErrorMessage name="password" />
                </div>
                <div>
                  <button
                    type="submit"
                    className="login_btn"
                    disabled={isSubmitting}
                  >
                    Login
                  </button>
                  {isSubmitting && (
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                  )}
                </div>
                {status && <div className="alert_danger">{status}</div>}
                <div>
                  <p className="signup">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
