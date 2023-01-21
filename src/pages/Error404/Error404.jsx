import React from 'react';
import { Link } from 'react-router-dom';
import './error404.scss';

const Error404 = () => {
    return (
        <main className='w-screen h-screen flex justify-center items-center'>
            <article>
                <svg className="mx-auto h-36 w-36 stroke-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h1 className='text-3xl mx-auto'>pagina niet gevonden</h1>
                <Link to='/'><button className='mt-5 w-full bg-blue text-white px-5 py-1 text-xl rounded-md'>Terug naar de homepagina</button></Link>
            </article>
        </main>
    )
}

export default Error404