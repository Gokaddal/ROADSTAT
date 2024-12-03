import React, { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import "./signUpPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function SignUpPage() {
  const { user, register, message, setVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const firstName = event.target[0].value;
    const lastName = event.target[1].value;
    const email = event.target[2].value;
    const phoneNumber = event.target[3].value;
    const password = event.target[4].value;
    const userType = event.target[5].value;
    try {
      register(
        firstName,
        lastName,
        email,
        password,
        email,
        userType,
        phoneNumber
      );
      setIsSubmitted(true);
      setVerificationEmail(email);
    } catch (error) {
      setSubmitted(false);
      setStatus(error);
    }
  };

  const handleClose = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPass((prevState) => !prevState);
  };

  return (
    <div className="signUp_bg">
      <div className="signUp_page">
        <AiOutlineClose className="close_icon" onClick={handleClose} />
        <h2 className="create_account">Create Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Row for First Name and Last Name */}
          <div className="row">
            <input
              type="text"
              className="signUp_text half"
              placeholder="First Name"
            />
            <input
              type="text"
              className="signUp_text half"
              placeholder="Last Name"
            />
          </div>

          {/* Row for Email and Phone Number */}
          <div className="row">
            <input
              type="text"
              className="signUp_text half"
              placeholder="Email Address"
            />
            <input
              type="number"
              className="signUp_text half"
              placeholder="Phone Number"
            />
          </div>

          {/* Row for Password and User Type */}
          <div className="row">
            <div className="password_container half">
              <input
                type={showPass ? "text" : "password"}
                id="pwd"
                className="signUp_text"
                placeholder="Password"
              />
              {showPass ? (
                <BiSolidShow
                  className="pass_icon"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <BiSolidHide
                  className="pass_icon"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <select name="userType" className="signUp_text half">
              <option value="" selected disabled>
                User Type
              </option>
              <option value="Individual">Individual</option>
              <option value="Organization">Organization</option>
            </select>
          </div>

          {/* Consent Text */}
          <div>
            <p className="consent_text">
              I hereby provide my consent to GOKADDAL INC to gather, store, and
              use my Email ID/Phone number for business purposes only. By
              creating an account, I agree to the Terms of Service and Privacy
              Policy. I may unsubscribe at any time. In order to register an
              account, I understand that I am required to adhere to the Terms
              and Conditions and Privacy Policy.
            </p>
          </div>

          {/* Submit Button */}
          <button type="submit" className="create_btn">
            Create Account
          </button>
        </form>

        {isSubmitted && <p className="success_message">{message.text}</p>}
      </div>
    </div>
  );
}

export default SignUpPage;
