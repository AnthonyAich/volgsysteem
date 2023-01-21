import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Assignment = ({ assignment }) => {
    const [timeRested, setTimeRested] = useState("--:--:--");

    const timeRestedCalculator = () => {
        setInterval(() => {
            if (new Date(assignment.minuten) - new Date().getTime() < 0) {
                setTimeRested("Klaar");
            } else {

                // get highest assignments.data[0].opdrachtElementen minuten
                let timeToday = new Date(assignment.minuten);

                // substract 1 hour from timeToday
                let restTime = new Date((timeToday - 3600000) - new Date().getTime()).toLocaleTimeString('nl-NL');
                // hh:mm:ss
                setTimeRested(restTime);

            }
        }, 1000);
    }
    timeRestedCalculator();

    return (
        <Link to={`/assignment/${assignment.id}`} tabIndex={0}>
            <div className='select-none w-full grid grid-cols-5 gap-4 items-center border border-darkGrey px-4 h-16 rounded-lg mb-5'>
                <h3 className='col-span-3 text-xl font-semibold truncate w-full'>{assignment.beschrijving}</h3>
                <div className="border border-darkGrey flex items-center justify-between px-3 gap-3 py-1 rounded-lg w-36 col-span-2  ml-auto">
                    <svg className='h-7 w-7' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className='text-xl font-semibold'>{timeRested}</p>
                </div>
            </div>
        </Link >
    )
}

export default Assignment