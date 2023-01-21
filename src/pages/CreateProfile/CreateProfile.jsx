import React, { useEffect, useState } from 'react';
import hogentLogo from '../../assets/images/HogentLogoRaw.png';
import loginImage from '../../assets/images/loginimage.png';
import hogentVolgsysteem from '../../assets/images/logo.png';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useSession } from '../../hooks/useSession';
import { useFormik } from 'formik';

const CreateProfile = () => {
    document.title = 'Register - Volgsysteem';
    const { register } = useLogin();
    const [userData, setUserData] = useState("");

    const navigate = useNavigate();


    const { handleChange, handleSubmit } = useFormik({
        initialValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
        },

        onSubmit: async (values) => {
            const registerValue = await register(values.firstName, values.lastName, values.email, values.password, "Admin");
            navigate('/');
            setUserData(registerValue);
        }
    });

    useEffect(() => {
        if (userData !== "") {
            navigate('/');
        }
    }, [userData, navigate]);


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
                                    <h2 className='text-2xl text-darkGrey pb-6'>Registreren</h2>
                                    <label htmlFor="firstName" className='block'>Voornaam
                                        <input className='w-full block' onChange={handleChange} type="text" name="firstName" id="fitstName" required />
                                    </label>
                                    <label htmlFor="lastName" className='block'>Achternaam
                                        <input className='w-full block' onChange={handleChange} type="text" name="lastName" id="lastName" required />
                                    </label>

                                    <label htmlFor="email" className='block'>Email
                                        <input className='w-full block' onChange={handleChange} type="email" name="email" id="email" required />
                                    </label>
                                    <label htmlFor="password">Wachtwoord
                                        <input className='w-full block' onChange={handleChange} type="password" name="password" id="password" required />
                                    </label>
                                    <button type="submit" className='bg-white text-darkGrey hover:bg-blue hover:text-white w-full text-xl py-1 border-2 border-blue rounded-md mt-3'>Account maken</button>
                                </form>
                                <Link to="/login" className='text-blue'>Al een account? Log dan hier in</Link>
                            </article>
                        </section>
                    </main>
                </>
                )
            }
        </>
    )
}

export default CreateProfile