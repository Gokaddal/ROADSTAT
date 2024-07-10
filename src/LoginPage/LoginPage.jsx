import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { authenticationService } from '@/_services';
import './loginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [initialValues, setInitialValues] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        if (authenticationService.currentUserValue) {
            navigate('/');
        }
    }, [navigate]);

    const onSubmit = ({ username, password }, { setStatus, setSubmitting }) => {
        setStatus();
        authenticationService.login(username, password)
            .then(
                user => {
                    const { from } = navigate.location?.state?.from || { from: { pathname: "/" } };
                    navigate(from);
                },
                error => {
                    setSubmitting(false);
                    setStatus(error);
                }
            );
    };

    const togglePasswordVisibility = () => {
        setShowPass((prevState) => !prevState);
    }

    return (
        <div className='login_bg'>
            <div>
                <img src="/images/companyLogo.png" alt="Logo" className="company_logo" />
                <img src="/images/roadstatNewLogo.png" alt="Logo" className="road_logo" />
            </div>
            <div className='login_page'>
                <h2 className='login'>Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().required('Password is required')
                    })}
                    onSubmit={onSubmit}>

                    {({ errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div>
                                <Field type="text" name="username" className={'text_bar' + (errors.username && touched.username ? ' is-invalid' : '')} placeholder="Username" />
                                <div className="error_message">
                                    <ErrorMessage name="username" />
                                </div>
                            </div>
                            <div className='password_container'>
                                <Field type={showPass ? "text" : "password"} name="password" className={'text_bar' + (errors.password && touched.password ? ' is-invalid' : '')} placeholder="Password" />
                                <div className="error_message">
                                    <ErrorMessage name="password" />
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="login_btn" disabled={isSubmitting}>Login</button>
                                {isSubmitting &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                            {status &&
                                <div className="alert_danger">{status}</div>
                            }
                            <div>
                                <p className='signup'>Don't have an account? Sign Up</p>
                            </div>

                        </Form>
                    )}

                </Formik>
            </div>
        </div>
    );
}

export { LoginPage };
