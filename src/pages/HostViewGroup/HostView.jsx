import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { getGroupById } from '../../api/groups';
import { getOpdrachtenByGroepId } from '../../api/assignments';

const HostView = () => {
    const { id } = useParams();
    // get name of group use query (data as groupName)
    const { data: groepNaam, isLoading, error } = useQuery(['group', id], () => getGroupById(id));
    const { data: assignments, isLoading: isLoadingAssignments, error: errorAssignments } = useQuery(['assignments', id], () => getOpdrachtenByGroepId(id));

    return (
        <>
            <Navbar />
            {groepNaam &&
                (<main className="px-6 lg:mx-28 lg:px-40 bg-white w-auto h-fit lg:h-screen pt-24">
                    <div className='flex items-center gap-5'>
                        <Link to="/hvg"><button className='py-2 px-4 text-white text-lg font-semibold rounded-md flex justify-center items-center gap-3 bg-blue hover:bg-darkGrey'>
                            <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Groepen
                        </button></Link>
                        <h1 className='text-3xl font-semibold text-darkGrey'>{groepNaam.data.naam}</h1>
                    </div>
                    <section className='mt-10 border border-1 border-lightGrey rounded-md'>
                        <div className='px-5'>
                            {assignments && assignments.data.length > 0 &&
                                assignments.data.map((assignment, index) => (
                                    <h3 key={index} className='
                                        text-blue text-2xl font-semibold rounded-md p-4 flex justify-between
                                    '>
                                        {assignment.naam}
                                    </h3>
                                ))
                            }
                        </div>
                        <div className='px-5'>
                            {assignments && assignments.data.length > 0 &&
                                assignments.data[0].opdrachtElementen.map((deelOpdracht) => (
                                    <Link to={`/hve/${deelOpdracht.id}`} key={deelOpdracht.id}>
                                        <div className='select-none w-full flex justify-between items-center border border-darkGrey px-4 h-16 rounded-lg mb-5'>
                                            <label className='flex justify-start items-center gap-4 cursor-pointer'>
                                                <input type="checkbox" name="opdrachtElement" className='h-4 w-4 border-2 border-blue rounded-md' />
                                                <h3 className='text-lg font-semibold'>{deelOpdracht.beschrijving}</h3>
                                            </label>
                                        </div>
                                    </Link>
                                ))
                            }
                            {
                                assignments && assignments.data.length === 0 &&
                                <h3 className='text-2xl font-semibold text-red'>Er zijn nog geen opdrachten toegevoegd</h3>
                            }
                        </div>
                    </section>
                </main>)
            }
        </>
    )
}

export default HostView
