import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { addTimeToOpdrachtElement, getAllRapportenOfOpdrachtElement, getAllVragenWithOpdrachtElementId, getDeelOpdrachtById, getstatusOfEveryoneInOpdrachtElement } from '../../api/assignments';
import { useEffect } from 'react';

const HostViewElement = () => {
    const [timeRested, setTimeRested] = useState(0);
    document.title = "Volgsysteem | HostView";

    const { id } = useParams();
    // getOpdrachtenByGroepId(id)
    const { data: assignment, isLoading: assignmentIsLoading, isError: assignmentIsError, error: assignmentError } = useQuery(['opdrachten', id], () => getDeelOpdrachtById(id));
    assignment && console.log(assignment.data);
    const { data: vragen, isLoading: vragenIsLoading, isError: vragenIsError, error: vragenError } = useQuery(['vragen', id], () => getAllVragenWithOpdrachtElementId(id));
    vragen && console.log("vragen", vragen);
    //  getstatusOfEveryoneInOpdrachtElement(id)
    const { data: status, isLoading: statusIsLoading, isError: statusIsError, error: statusError } = useQuery(['status', id], () => getstatusOfEveryoneInOpdrachtElement(id));
    // getAllRapportenOfOpdrachtElement(id)
    const { data: rapporten, isLoading: rapportenIsLoading, isError: rapportenIsError, error: rapportenError } = useQuery(['rapporten', id], () => getAllRapportenOfOpdrachtElement(id));
    rapporten && console.log("rapporten: ", rapporten);
    status && console.log("status: ", status.data);

    const addTime = (time) => {
        addTimeToOpdrachtElement(id, time);
    }
    const timeRestedCalculator = () => {
        setInterval(() => {
            // if assignment.data.minuten is in the past
            if (new Date(assignment.data.minuten) - new Date().getTime() < 0) {
                setTimeRested("Klaar");
            } else {

                let timeRested = new Date((new Date(assignment.data.minuten)) - new Date().getTime() - 3600000).toLocaleTimeString('nl-NL');
                setTimeRested(timeRested);
            }
        }, 1000);
    }
    assignment && timeRestedCalculator();

    return (
        <>
            <Navbar />
            {
                assignment &&
                <main className="px-6 lg:mx-28 lg:px-40 bg-white w-auto h-fit lg:h-screen pt-24">
                    <div>
                        <Link to={`/hvg/`} ><button className='py-2 px-4 text-white text-lg font-semibold rounded-md flex justify-center items-center gap-3 bg-blue hover:bg-darkGrey'>
                            <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Groepen
                        </button></Link>
                        <h1 className='text-3xl font-semibold text-darkGrey'>{assignment.data.beschrijving}</h1>
                        <div className='flex items-center gap-3 border border-darkGrey rounded-lg p-2 text-xl font-semibold w-40'>
                            <svg className='w-7 h-7  stroke-darkGrey' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {timeRested}
                        </div>
                    </div>
                    <section className='sm:flex sm:flex-col lg:grid lg:grid-cols-3 gap-5 mt-10'>

                        <section className='h-full bg-lightBlue rounded-md border border-1 border-lightGrey p-5'>
                            <div className="grid grid-cols-3 w-full px-4 h-11 items-center">
                                <p className='flex items-center gap-2 justify-center'><span className='bg-red w-4 h-4 rounded'></span>Geeft op</p>
                                <p className='flex items-center gap-2 justify-center'><span className='bg-yellow w-4 h-4 rounded'></span>Bezig</p>
                                <p className='flex items-center gap-2 justify-center'><span className='bg-green w-4 h-4 rounded'></span>klaar</p>
                            </div>
                            <div className='w-full h-64 overflow-y-auto bg-white rounded p-4 pt-6 border border-1 border-lightGrey'>
                                {
                                    status &&
                                    <div className="w-full h-full border-b-darkGrey border-l-darkGrey border border-t-white border-r-white flex items-end justify-around">

                                        <div className='bg-red w-14' style={
                                            { height: `${status.data.stopped / status.data.total * 100}%` }
                                        }>
                                            <p className='text-darkGrey text-center font-semibold -translate-y-5'>

                                                {`${status.data.stopped / status.data.total * 100}%`}
                                            </p>
                                        </div>
                                        <div className='bg-yellow w-14' style={
                                            { height: `${status.data.buzy / status.data.total * 100}%` }
                                        }>
                                            <p className='text-darkGrey  text-center font-semibold -translate-y-5'>{`${status.data.buzy / status.data.total * 100}%`}</p>
                                        </div>
                                        <div className='bg-green h-1/4 w-14' style={
                                            { height: `${status.data.done / status.data.total * 100}%` }
                                        }>
                                            <p className='text-darkGrey  text-center font-semibold -translate-y-5'>{`${status.data.done / status.data.total * 100}%`}</p>
                                        </div>
                                    </div>
                                }
                                {
                                    statusIsLoading &&
                                    <div className="loadingImgTurning"></div>
                                }
                            </div>
                        </section>
                        <section className='bg-lightBlue rounded-md h-fit w-full border border-1 border-lightGrey p-5'>
                            <h3 className='text-2xl text-darkGrey mb-3'>Vragen</h3>
                            {vragen && vragen.data.length > 0 &&

                                <div className='w-full h-64 overflow-y-auto bg-white rounded p-2 border border-1 border-lightGrey'>

                                    {
                                        vragen.data[0].VraagStudent.map((vraag, index) => {
                                            // if beschr == null return null
                                            if (vraag.beschrijving === "") return null;
                                            return (
                                                <p key={index} className='bg-blue w-fit px-3 py-1 text-white text-lg rounded-xl mb-2'>
                                                    {vraag.beschrijving}
                                                </p>
                                            )
                                        })
                                    }

                                </div>
                            }
                            {vragenIsLoading &&
                                <div className='w-full h-64 overflow-y-auto bg-white rounded p-2 border border-1 border-lightGrey'>
                                    <div className="loadingImgTurning"></div>
                                </div>
                            }

                            {
                                vragen && vragen.data.length === 0 &&
                                <div className='w-full h-64 overflow-y-auto bg-white rounded p-2 border border-1 border-lightGrey'>
                                    <p className='text-darkGrey text-center'>Momenteel zijn er geen vragen</p>
                                </div>
                            }
                        </section>

                        <section className='col-span-1 h-full bg-lightBlue rounded-md border border-1 border-lightGrey p-5'>
                            <h3 className='text-2xl text-darkGrey mb-3'>Meer tijd</h3>
                            <div className='w-full h-64 overflow-y-auto bg-white rounded p-2 border border-1 border-lightGrey'>
                                {/* +1 +5 +10 */}
                                {
                                    rapporten &&
                                    <div className='h-full gap-8 flex flex-col justify-center items-center'>
                                        <article className='w-full text-darkGrey text-lg font-semibold flex justify-between'><div className='flex'><div className='text-blue w-20'>+1 min:</div> {rapporten.data.extraMinuten1} studenten</div><button onClick={() => { addTime(1) }} className='bg-blue text-white rounded-md px-2 py-1 w-16'>+1</button></article>
                                        <article className='w-full  text-darkGrey text-lg font-semibold flex justify-between'><div className='flex'><div className='text-blue w-20'>+5 min:</div> {rapporten.data.extraMinuten5} studenten</div><button onClick={() => { addTime(5) }} className='bg-blue text-white rounded-md px-2 py-1 w-16'>+5</button></article>
                                        <article className='w-full  text-darkGrey text-lg font-semibold flex justify-between'><div className='flex'><div className='text-blue w-20'>+10 min:</div> {rapporten.data.extraMinuten10} studenten </div><button onClick={() => { addTime(10) }} className='bg-blue text-white rounded-md px-2 py-1 w-16'>+10</button></article>
                                    </div>
                                }
                            </div>
                        </section>

                    </section>
                </main>
            }
        </>
    )
}
// french draguer in duch = flirten
export default HostViewElement
