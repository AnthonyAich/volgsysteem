import React, { useState } from 'react';
import hogentLogo from '../../assets/images/HogentLogoRaw.png';
import loginImage from '../../assets/images/loginimage.png';
import hogentVolgsysteem from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useSession } from '../../hooks/useSession';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import './login.scss'

const Login = () => {
    const { login, error } = useLogin();
    const { user } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (user !== "") {
            navigate('/');
        }
    }, [user, navigate])

    const { handleChange, handleSubmit } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            const { data } = await login(values.email, values.password);
            if (data !== undefined) {
                navigate('/');
            }
        }
    })

    document.title = 'Login - Volgsysteem';

    return (
        <>
            {
                (<>
                    <header className='fixed top-0 left-0 h-20 w-screen bg-white flex items-center lg:px-28 md:px-6 px-6 border-b border-darkGrey'>
                        <img src={hogentVolgsysteem} alt="hogentLogo" className='h-10' />
                    </header>
                    <main className='h-screen w-screen lg:grid lg:grid-cols-5 md:grid md:grid-cols-5 flex justify-center items-center'>
                        <img src={loginImage} alt="loginImage" className='lg:col-span-3 lg:h-screen lg:object-cover md:col-span-3 md:h-screen md:object-cover' />
                        <section className='flex items-center justify-center col-span-2'>
                            <article className='w-auto'>
                                <h1 className='text-4xl text-blue font-medium lg:pr-56'>Volgsysteem</h1>
                                <form onSubmit={handleSubmit}>
                                    <h2 className='text-2xl text-darkGrey pb-6'>Inloggen</h2>
                                    <label htmlFor="email" className='block'>Email
                                        <input className='w-full block' type="email" name="email" id="email" onChange={handleChange} required />
                                    </label>
                                    {error}
                                    <label htmlFor="password">Wachtwoord
                                        <input className='w-full block' type="password" name="password" id="password" onChange={handleChange} required />
                                    </label>
                                    <button type="submit" className='bg-white text-darkGrey hover:bg-blue hover:text-white w-full text-xl py-1 border-2 border-blue rounded-md mt-3'>Inloggen</button>
                                </form>
                                <Link to="/register" className='text-blue'>Nog geen account? Registreer hier</Link>
                            </article>
                        </section>
                    </main>
                    <div className="overlayLoader">
                        <div className="container">
                            <img src={hogentLogo} alt="hogentLogo" />
                            <h1>volgsysteem</h1>
                        </div>
                    </div>
                </>
                )
            }
            {/* all errors */}
            {error && error.response && error.response.status === 401 && (
                <div className="errorPopup">
                    <p>Jouw email of wachtwoord is niet correct.</p>
                </div>
            )}
            {error && error.response && error.response.status === 500 && (
                <div className="errorPopup">
                    <p>Oeps, er is iets misgelopen op de server.</p>
                </div>
            )}
            {/* when api not running */}
            {error && error.message === "Network Error" && (
                <div className="errorPopup">
                    <p>De server is niet bereikbaar.</p>
                </div>
            )}
        </>
    )
}

export default Login