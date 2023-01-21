import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { askForMoreTime, getDeelOpdrachtById, getMessagesByRapportId, getRapportByUserIdAndDeelOpdrachtId, setQuestionToRapport, setStatusOfAssignment } from '../../api/assignments'
import { useFormik } from 'formik'
import { useEffect } from 'react'

const AssignmentPage = () => {
    const [tijdResterend, setTijdResterend] = useState("--:--:--");
    const [showTimeAddPopup, setShowTimeAddPopup] = useState(false);
    const [showQuestionPopup, setShowQuestionPopup] = useState(false);
    const [extraMinutes, setExtraMinutes] = useState(0);
    // get id from url
    const { id } = useParams();
    // getOpdrachtenByGroepId(id)
    const { data: assignment, isLoading: assignmentIsLoading, isError: assignmentIsError, error: assignmentError } = useQuery(['opdrachten', id], () => getDeelOpdrachtById(id));
    const { data: rapport, isLoading: rapportIsLoading, isError: rapportIsError, error: rapportError } = useQuery(['rapport', id], () => getRapportByUserIdAndDeelOpdrachtId(id));
    const timeRestedCalculator = () => {
        setInterval(() => {
            // if assignment.data.minuten is in the past
            if (new Date(assignment.data.minuten) - new Date().getTime() < 0) {
                setTijdResterend("Klaar");
            } else {

                let timeRested = new Date((new Date(assignment.data.minuten)) - new Date().getTime() - 3600000).toLocaleTimeString('nl-NL');
                setTijdResterend(timeRested);
            }
        }, 1000);
    }
    assignment && timeRestedCalculator();

    useEffect(() => {
        if (rapport && rapport.data[0] !== undefined) {
            setExtraMinutes(rapport.data[0].extraMinuten);
        }
    }, [rapport])

    return (
        <>
            {showTimeAddPopup && <AskForMoreTimePopup setExtraMinutes={setExtraMinutes} setShowTimeAddPopup={setShowTimeAddPopup} rapport={rapport} />}
            <Navbar />
            {assignment && <main className='px-6 lg:mx-28 lg:px-40 bg-white w-auto h-fit pt-24 lg:h-screen'>
                <nav className='grid gap-4 items-center md:flex'>
                    <Link to={`/stv/${assignment.data.opdracht.groepId}`}><button className='py-2 px-4 text-white text-lg font-semibold rounded-md flex justify-center items-center gap-3 bg-blue hover:bg-darkGrey'>
                        <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Opdrachten
                    </button></Link>
                    <h1 className='text-4xl font-semibold text-darkGrey'>{`${assignment.data.opdracht.naam}`}</h1>
                </nav>
                <section className='md:grid md:grid-cols-4 gap-3 mt-10 flex flex-col-reverse'>
                    <div className='flex flex-col gap-3'>
                        {rapport && (<OpdrachtStatus assignment={assignment} rapport={rapport} />)}
                        {rapport && (rapport.data[0] !== undefined && <QuestionChatBox rapportId={rapport} />)}
                    </div>
                    <article className='col-span-3'>
                        <article className='flex items-center gap-3'>
                            <div className='flex items-center gap-3 border border-darkGrey rounded-lg p-2 text-xl font-semibold w-40'>
                                <svg className='w-7 h-7  stroke-darkGrey' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {tijdResterend}
                            </div>
                            {rapport && (rapport.data[0] !== undefined) &&
                                <button tabIndex={0} onClick={() => { setShowTimeAddPopup(current => !current) }} className='relative flex bg-darkGrey p-2 rounded-md'>
                                    {
                                        rapport.data[0].extraMinuten !== 0 && <span className='absolute border-2 border-green rounded-full w-10 h-6  bg-white  -top-4 -right-4 text-darkGrey flex items-center justify-center font-semibold'>+{extraMinutes}</span>
                                    }
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 stroke-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <svg className='w-7 h-7  stroke-white' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>}
                        </article>
                        <h1 className='text-5xl font-semibold text-blue pt-3 mb-5'>{assignment.data.beschrijving}</h1>
                        <section>
                            {/* <h2 className='text-xl'>Bestanden</h2>
                            <article className='border border-dashed rounded-xl bg-lightBlue h-12'>
                            </article> */}
                        </section>
                    </article>
                </section>
                <button onClick={() => (setShowQuestionPopup(current => !current))} className='animate-bounce fixed bottom-5 right-5 bg-blue h-12 w-12 flex items-center justify-center rounded-lg hover:bg-darkGrey border-2 border-lightBlue chatButton'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                </button>
                {rapport && (rapport.data[0] !== undefined) && <MobileChatPopup rapportId={rapport} showPopup={setShowQuestionPopup} active={showQuestionPopup} />}
            </main>
            }
        </>
    )
}

export default AssignmentPage


const OpdrachtStatus = ({ assignment, rapport }) => {
    const [status, setStatusState] = useState((rapport.data[0] !== undefined ? rapport.data[0].status : 0));

    const setStatus = async (statusNummer) => {

        await setStatusOfAssignment(assignment.data.id, statusNummer);
        setStatusState(statusNummer);
        console.log("set De Status");
    }

    return (
        <form className='border border-darkGrey rounded-lg p-5 grid grid-cols-1 gap-2'>
            <h1 className='text-2xl text-blue font-bold'>Klaar?</h1>
            {/* ik doe mee, klaar, ik geef op, ik doe niet mee */}
            <label tabIndex={0} htmlFor="ikDoeMee" className='flex items-center border border-lightGrey rounded-lg text-lg px-5 py-2 gap-3 cursor-pointer font-bold text-darkGrey'>
                <input onChange={() => { setStatus(1) }} tabIndex={0} type="radio" name="status" id="ikDoeMee" className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300'
                    defaultChecked={
                        status === 1
                    }
                />
                Ik doe mee
            </label>
            <label tabIndex={0} htmlFor="klaar" className='flex items-center border border-lightGrey rounded-lg text-lg px-5 py-2 gap-3 cursor-pointer font-bold text-darkGrey'>
                <input onChange={() => setStatus(2)} type="radio" name="status" id="klaar" className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300'
                    defaultChecked={
                        status === 2
                    }
                />
                Klaar
            </label>
            <label tabIndex={0} htmlFor="ikGeefOp" className='flex items-center border border-lightGrey rounded-lg text-lg px-5 py-2 gap-3 cursor-pointer font-bold text-darkGrey'>
                <input onChange={() => setStatus(3)} type="radio" name="status" id="ikGeefOp" className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300'
                    defaultChecked={
                        status === 3
                    }
                />
                Ik geef op
            </label>
            <label tabIndex={0} htmlFor="ikDoeNietMee" className='flex items-center border border-lightGrey rounded-lg text-lg px-5 py-2 gap-3 cursor-pointer font-bold text-darkGrey'>
                <input onChange={() => setStatus(4)} type="radio" name="status" id="ikDoeNietMee" className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300'
                    defaultChecked={
                        status === 4
                    }
                />
                Ik doe niet mee
            </label>
        </form>
    )
}

const AskForMoreTimePopup = ({ setShowTimeAddPopup, rapport, setExtraMinutes }) => {

    const moreTime = (time) => {
        askForMoreTime(rapport.data[0].id, time);
        setShowTimeAddPopup(current => !current);
        setExtraMinutes(time);
    }

    return (
        <>
            <div className="cursor-pointer fixed w-screen h-screen top-0 left-0 z-50 p-4 md:inset-0 md:h-full bg-opacity-70 bg-darkGrey flex justify-center items-center" onClick={() => setShowTimeAddPopup(current => !current)}>
            </div>
            <div className="w-fit fixed left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 z-50 h-fit max-w-md md:h-auto ">
                <div className="bg-white rounded-lg shadow-2xl">
                    <button onClick={() => setShowTimeAddPopup(current => !current)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Modal sluiten</span>
                    </button>
                    <div className="p-6 text-center">
                        <svg className='w-16 h-16 stroke-red mx-auto' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mb-5 text-2xl font-semibold text-darkGrey">Wil je tijd bijvragen?</h3>
                        <article className='flex gap-5'>
                            <button onClick={() => moreTime(1)} className='border border-darkGrey h-full text-lg font-semibold text-darkGrey px-3 py-2 rounded-md hover:bg-darkGrey hover:text-white'>+ 1min</button>
                            <button onClick={() => moreTime(5)} className='border border-darkGrey h-full text-lg font-semibold text-darkGrey px-3 py-2 rounded-md hover:bg-darkGrey hover:text-white'>+ 5min</button>
                            <button onClick={() => moreTime(10)} className='border border-darkGrey h-full text-lg font-semibold text-darkGrey px-3 py-2 rounded-md hover:bg-darkGrey hover:text-white'>+ 10min</button>
                        </article>
                    </div>
                </div>
            </div>
        </>
    )

}


const QuestionChatBox = ({ rapportId }) => {

    const [question, setQuestion] = useState([]);
    // getMessagesByDeelOpdrachtId {rapportId} if rapportId.data[0].id is not null
    const { data: messages, isLoading, isError, error } = useQuery(['question', rapportId.data[0].id], () => getMessagesByRapportId(rapportId.data[0].id))

    useEffect(() => {
        if (messages) {
            setQuestion(messages.data)
        }
    }, [messages])


    const { handleChange, handleSubmit } = useFormik({
        initialValues: {
            vraag: "",
        },
        onSubmit: async (values, { resetForm }) => {
            setQuestionToRapport(values.vraag, rapportId.data[0].id)
            setQuestion(current => [...current, { beschrijving: values.vraag }])
            // where input = name clear input
            values.vraag = "";
            resetForm();
        }
    })

    return (
        <div className=' bg-white border border-darkGrey rounded-lg p-5 h-80 chatBox'>
            <h1 className='text-2xl font-bold text-blue'>Chat</h1>
            <article className='border border-lightGrey p-2 rounded overflow-y-scroll h-48'>
                {/* <p className='text-base text-darkGrey'>Hoi, ik heb een vraag over deze opdracht</p> */}
                {/* docent */}
                {/* <p className='text-base text-blue font-semibold border-l-2 border-blue pl-2'>Vraag maar</p>
                <p className='text-base text-darkGrey'>Hoe moet ik dit doen?</p>
                <p className='text-base text-blue font-semibold border-l-2 border-blue pl-2'>Het is de bedoeling dat je dit zelf vindt. Zonder vragen te stellen.</p>
                <p className='text-base text-darkGrey'>Oké, ik snap het</p>
                <p className='text-base text-blue font-semibold border-l-2 border-blue pl-2'>Goed zo!</p> */}
                {question !== [] && question.map((message, index) => {
                    return (
                        <p key={index} className='text-base font-medium text-darkGrey'>{message.beschrijving}</p>
                    )
                })}

                {isLoading && (<div className='col-span-3 mt-28 h-full flex justify-center items-center'>
                    <div>
                        <div className='loadingImgTurning'>

                        </div>
                        <h1 className='text-darkGrey font-semibold text-2xl animate-pulse'>Laden</h1>
                    </div>
                </div>)}
            </article>
            <form onSubmit={handleSubmit} >
                <input type="text" name='vraag' onChange={handleChange} placeholder='Stel een vraag...' />
            </form>
        </div >
    )
}

const MobileChatPopup = ({ rapportId, showPopup, active }) => {

    const [question, setQuestion] = useState([]);
    // getMessagesByDeelOpdrachtId {rapportId} if rapportId.data[0].id is not null
    const { data: messages, isLoading, isError, error } = useQuery(['question', rapportId.data[0].id], () => getMessagesByRapportId(rapportId.data[0].id))

    useEffect(() => {
        if (messages) {
            setQuestion(messages.data)
        }
    }, [messages])


    const { handleChange, handleSubmit } = useFormik({
        initialValues: {
            vraag: "",
        },
        onSubmit: async (values, { resetForm }) => {
            setQuestionToRapport(values.vraag, rapportId.data[0].id)
            setQuestion(current => [...current, { beschrijving: values.vraag }])
            resetForm();
        }
    })


    return (
        <>
            <div onClick={() => (showPopup(current => !current))} className={`${active ? `top-0` : `-top-full`} cursor-pointer fixed left-0 h-screen w-full bg-opacity-70 bg-darkGrey`}></div>
            <div className={`${active ? `top-32` : `-top-[100vh]`} transition-all duration-700 ease-in-out bg-white border border-darkGrey rounded-lg z-50 absolute left-5 right-5 px-10 pb-10 chatboxMobile`}>
                <div className='h-fit flex items-center justify-between my-10'>
                    <h1 className='text-2xl font-bold text-blue'>Chat</h1>
                    <button onClick={() => (showPopup(current => !current))}>
                        <svg className='w-6 h-6 stroke-darkGrey' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <article className='border border-lightGrey p-2 rounded overflow-y-scroll h-48'>
                    {question !== [] && question.map((message, index) => {
                        return (
                            <p key={index} className='text-base font-medium text-darkGrey'>{message.beschrijving}</p>
                        )
                    })}
                </article>
                <form onSubmit={handleSubmit}>
                    <input type="text" name='vraag' onChange={handleChange} placeholder='Stel een vraag...' />
                </form>
            </div>
        </>
    )
}