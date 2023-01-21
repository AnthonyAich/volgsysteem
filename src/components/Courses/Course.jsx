import React from 'react'
import { Link } from 'react-router-dom'

export const Course = ({ group }) => {
    return (
        <Link to={`stv/${group.id}`} tabIndex={0} className="focus:ring-blue focus:ring focus:outline-none rounded-md">
            <article className='relative border h-28 border-lightGrey rounded-md flex justify-between items-center px-6 hover:border-blue'>
                {/* tooltip round */}
                {group.opdrachtElementen > 0 &&
                    <span className='absolute -top-3 -right-2 w-6 bg-white h-6 rounded-full border-2 font-semibold border-red flex items-center justify-center'>
                        {group.opdrachtElementen}
                    </span>
                }

                <p className='text-2xl font-semibold'>{group.naam}</p>
                <svg xmlns="http://www.w3.org/2000/svg" className=' h-8 lg:h-10' fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </article>
        </Link>
    )
}

export const AdminCourse = ({ group }) => {
    return (
        <Link to={`/av/${group.id}`} tabIndex={0} className="focus:ring-blue focus:ring focus:outline-none rounded-md">
            <article className='border h-28 border-lightGrey rounded-md flex justify-between items-center px-6 hover:border-blue'>
                <p className='text-2xl font-semibold'>{group.naam}</p>
                <svg xmlns="http://www.w3.org/2000/svg" className=' h-8 lg:h-10' fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </article>
        </Link>
    )
}

// hostcourse 
export const HostCourse = ({ group }) => {
    return (
        <Link to={`/hv/${group.id}`} tabIndex={0} className="focus:ring-blue focus:ring focus:outline-none rounded-md">
            <article className='border h-28 border-lightGrey rounded-md flex justify-between items-center px-6 hover:border-blue'>
                <p className='text-2xl font-semibold'>{group.naam}</p>
                <svg xmlns="http://www.w3.org/2000/svg" className=' h-8 lg:h-10' fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </article>
        </Link>
    )
}