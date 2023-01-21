import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AssignmentList from '../../components/Assignment/AssignmentList';
import Navbar from '../../components/Navbar/Navbar';
import './studentView.scss'
import { getGroupById } from '../../api/groups';
import { useQuery } from '@tanstack/react-query';
import { getOpdrachtenByGroepId } from '../../api/assignments';

const StudentView = () => {
    document.title = 'Volgsysteem - Student view';

    const [restTimeString, setRestTimeString] = useState("--:--:--");
    // get id from url use params
    const { id } = useParams();
    // get name of group use query (data as groupName)
    const { data: groepNaam, isLoading, error } = useQuery(['group', id], () => getGroupById(id));
    const { data: assignments, isLoading: isLoadingAssignments, error: errorAssignments } = useQuery(['assignments', id], () => getOpdrachtenByGroepId(id));

    const restTimeCalc = () => {
        // get highest time from assignments
        setInterval(() => {

            // if the time is in the past, return "Klaar"
            let highestTime = assignments.data[0].opdrachtElementen.reduce((a, b) => a.minuten > b.minuten ? a : b);
            console.log(highestTime);

            if ((new Date(highestTime.minuten) - new Date().getTime()) < 0) {
                setRestTimeString("Klaar");
            } else {
                // get highest assignments.data[0].opdrachtElementen minuten
                let timeToday = new Date(highestTime.minuten);

                // substract 1 hour from timeToday
                let restTime = new Date((timeToday - 3600000) - new Date().getTime()).toLocaleTimeString('nl-NL');
                // hh:mm:ss
                setRestTimeString(restTime);
            }
        }, 1000);
    }
    assignments && !(assignments.data.length === 0) && restTimeCalc();

    return (
        <>
            <Navbar />
            {groepNaam && <main className='px-6 lg:mx-28 lg:px-40 bg-white w-auto h-fit pt-24 lg:h-screen'>
                <div className='flex items-center gap-5'>
                    <Link to="/"><button className='py-2 px-4 text-white text-lg font-semibold rounded-md flex justify-center items-center gap-3 bg-blue hover:bg-darkGrey'>
                        <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Groepen
                    </button></Link>
                    <h1 className='text-3xl font-semibold text-darkGrey'>{groepNaam.data.naam}</h1>
                </div>
                <section className='mt-6 border-l-2 pl-4' >
                    <div className="border border-darkGrey rounded-lg flex items-center w-fit px-5 py-1 gap-4">
                        <svg className='w-7 h-7' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className='text-xl font-semibold'>
                            {restTimeString}
                        </p>
                    </div>
                    <h1 className="text-4xl text-blue font-semibold mb-4 mt-8">
                        {assignments && !(assignments.data.length === 0) && assignments.data[0].naam}
                        {assignments && assignments.data.length === 0 && (<span className='text-red'>Er staan geen opdrachten open</span>)}
                        {isLoadingAssignments && <span className='animate-pulse'>...</span>}
                    </h1>
                    <section>
                        {assignments && !(assignments.data.length === 0) && <AssignmentList assignmentsArray={assignments.data[0].opdrachtElementen} />}
                        {isLoadingAssignments && <span className='animate-pulse'>...</span>}
                    </section>
                </section>
            </main>}
            {isLoading && (<div className='col-span-3 mt-28 h-full flex justify-center items-center'>
                <div>
                    <div className='loadingImgTurning'>

                    </div>
                    <h1 className='text-darkGrey font-semibold text-2xl animate-pulse'>Laden</h1>
                </div>
            </div>)}
            {
                error && <p>Er is iets fout gegaan (contacteer je docent)</p>
            }
        </>
    )
}

export default StudentView