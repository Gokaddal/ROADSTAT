import React, { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { AiOutlineClose } from 'react-icons/ai';
import './signUpPage.css';
import { useNavigate } from 'react-router-dom';


function SignUpPage() {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        // setIsSubmitted(true);
    }

    const handleClose = () => {
        navigate('/login');
    }

    const togglePasswordVisibility = () => {
        setShowPass((prevState) => !prevState);
    }

    return (<div className="signUp_bg">
        <div className="signUp_page">
            <AiOutlineClose className="close_icon" onClick={handleClose} />
            <h2 className="create_account">Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" className="signUp_text" placeholder="First Name" />
                <input type="text" className="signUp_text" placeholder="Last Name" />
                <input type="text" className="signUp_text" placeholder="Email Address" />
                <input type="number" className="signUp_text" placeholder="Phone Number" />
                <div classname="password_container">
                    <input type={showPass ? "text" : "password"} id="pwd" className="signUp_text" placeholder="Password" />
                </div>
                {showPass ? (<BiSolidShow className="pass_icon" onClick={togglePasswordVisibility} />) :
                    (<BiSolidHide className="pass_icon" onClick={togglePasswordVisibility} />)}
                <select name="userType" className="signUp_text">
                    <option value="" selected disabled>User Type</option>
                    <option value="Individual" >Individual</option>
                    <option value="Organization">Organization</option>
                </select>
                <div>
                    <p className="consent_text">
                        I hereby provide my consent to GOKADDAL INC to gather,store and use
                        my Email ID/Phone number for business purpose only. By creating an
                        account, I agree to the Terms of Service and Privacy Policy. I may
                        unsubscribe at any time. In order to register an account, I understand
                        that I am required to adhere to the Terms and Conditions and Privacy Policy.
                    </p>
                </div>
                <button type="submit" className="create_btn">Create Account</button>
            </form>
            {isSubmitted && <p class="success_message">Account created Successfully! Please go back to login Page</p>}
        </div>
    </div>);
}

export { SignUpPage };