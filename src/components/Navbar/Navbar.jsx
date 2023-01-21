import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import hogentLogo from '../../assets/images/logo.png';
// import './navbar.scss';
import { useSession } from '../../hooks/useSession';
import { AuthContext } from '../../contexts/AuthProvider';

const Navbar = () => {
    const { user } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const useAuth = useContext(AuthContext);

    const logout = () => {
        useAuth.logout();
    }

    const navHandler = () => {
        setIsMenuOpen((current) => !current);
    }

    const userName = user.voorNaam + " " + user.familieNaam;
    const role = user.role;
    return (
        user && (
            <header className='fixed top-0 left-0 h-20 w-screen bg-white flex items-center lg:px-28 justify-between border-b border-darkGrey sm:px-6 px-6 z-50'>
                <img src={hogentLogo} className="h-10" alt="hogentLogo" />
                <button onClick={navHandler} tabIndex={0} className="flex gap-3 text-darkGrey text-base font-medium cursor-pointer lg:text-lg">{userName}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <nav className={`absolute duration-500 ease-in-out ${isMenuOpen ? "top-20" : "-top-48"} lg:right-28 md:right-6 right-6 pt-2 bg-white border border-darkGrey rounded-lg`} >
                    <ul>
                        {/* <Link><li>Mijn profiel</li></Link> */}
                        <Link to='/' ><li className='py-1 text-darkGrey text-lg px-5 hover:bg-lightGrey hover:text-white'>Student view</li></Link>
                        {("Admin,Host".split(",").includes(role)) && <Link to='/hvg' ><li className='px-5 py-1 text-darkGrey text-lg hover:bg-lightGrey hover:text-white'>Host view</li></Link>}
                        {role === "Admin" && <Link to='/avg' ><li className='py-1 px-5 text-darkGrey text-lg hover:bg-lightGrey hover:text-white'>Admin view</li></Link>}
                        <Link to='#' onClick={() => logout()} ><li className='py-1 hover:text-white text-lg hover:bg-red px-5 text-red bg-white'>Logout</li></Link>
                    </ul>
                    <span onClick={navHandler} className="border-darkGrey border-t flex justify-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                    </span>
                </nav>
            </header>)
    )
}

export default Navbar

