import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { authenticationService } from '@/_services';
import './loginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        // redirect to home if already logged in
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

    return (
        <div className='login_page'>
            <div className="alert alert-info">
                <strong>Normal User</strong> - U: user P: user<br />
                <strong>Administrator</strong> - U: admin P: admin
            </div>
            <div className='formPage'>
            <h2>Login</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('Username is required'),
                    password: Yup.string().required('Password is required')
                })}
                onSubmit={onSubmit}>

{({ errors, status, touched, isSubmitting }) => ( // Replace render prop with child function
                    <Form>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                            <div className="error-message">{errors.username && touched.username ? <ErrorMessage name="username" /> : null}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <div className="error-message">{errors.password && touched.password ? <ErrorMessage name="password" /> : null}</div>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
                            {isSubmitting &&
                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                        </div>
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                        }
                    </Form>
                )}

            </Formik>
            </div>
        </div>
    );
}

export { LoginPage };
