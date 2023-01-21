import React, { useEffect, useState } from 'react'
import { AdminCourse, Course, HostCourse } from './Course';
import { addGroup, getMyGroups, searchGroepByName } from '../../api/groups';
import { useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { set } from 'react-hook-form';

const Courses = ({ role }) => {
    const [groups, setGroups] = useState([]);
    const { isLoading, data, isError, error
    } = useQuery({
        queryKey: ['groups'],
        queryFn: getMyGroups,
    });

    useEffect(() => {
        if (data) {
            setGroups(data.data);
        }
    }, [data]);

    // when value is changed in searchbar this function is called (formik)
    const handleChange = (e) => {
        e.preventDefault();

        searchGroepByName(e.target.value).then((res) => {
            if (res) {
                console.log(res.data);
                setGroups(res.data);
            }
        })
    }

    const [addForm, setAddForm] = useState(false);
    return (
        <>
            <section className="grid lg:grid-cols-3 gap-5 md:grid-cols-2 grid-cols-1 py-5 items-center">
                <div className="relative w-full z-0">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <form>
                        <input name="searchValue" onChange={handleChange} type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Zoek in cursusgroepen..." required />
                    </form>
                </div>
                {
                    role === 'Admin' ?
                        <button onClick={() => setAddForm(true)} className='flex items-center gap-2 bg-blue hover:bg-blue-600 text-white rounded-md w-fit px-3 py-2 my-3 font-semibold'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Groep toevoegen
                        </button>
                        :
                        null
                }

            </section>
            <section className='grid lg:grid-cols-3 gap-5 md:grid-cols-2 grid-cols-1 py-5' >
                {isLoading && (<div className='col-span-3 mt-28 h-full flex justify-center items-center'>
                    <div>
                        <div className='loadingImgTurning'>

                        </div>
                        <h1 className='text-darkGrey font-semibold text-2xl animate-pulse'>Laden</h1>
                    </div>
                </div>)}
                {isError && (<h1>{error.message}</h1>)}
                {groups && (role === 'Admin' ?
                    groups.map((group, index) => {
                        return (
                            <AdminCourse key={index} group={group} />
                        )
                    })
                    :
                    (role === "Student" ? groups.map((group, index) => {
                        return (
                            <Course key={index} group={group} />
                        )
                    }) : groups.map((group, index) => {
                        return (
                            <HostCourse key={index} group={group} />
                        )
                    }))
                )
                }
            </section>
            {
                addForm ?
                    <AddCousePopup setAddForm={setAddForm} />
                    : null
            }
        </>
    )
}

export default Courses;

const AddCousePopup = ({ setAddForm }) => {
    const navigate = useNavigate();

    const { handleChange, handleSubmit } = useFormik({
        initialValues: {
            newGroupName: "",
        },
        onSubmit: async (values) => {
            const newGroup = await addGroup(values.newGroupName);
            if (newGroup) {
                navigate(`/av/${newGroup.data.id}`);
            }

        }
    })

    const removePopup = () => {
        setAddForm(false);
    }

    return (
        <div id="popup-modal" tabIndex="-1" className="fixed w-screen top-0 left-0 p-4 md:inset-0 md:h-full bg-opacity-70 bg-darkGrey flex justify-center items-center" >
            <div className="relative w-full h-full max-w-md md:h-auto ">
                <div className="bg-white rounded-lg shadow-2xl">
                    <button onClick={removePopup} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Modal sluiten</span>
                    </button>
                    <div className="p-6 text-center">
                        <h3 className="mb-5 text-2xl font-normal text-gray-500 flex justify-start items-center gap-2 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Groep aanmaken</h3>
                        <div className="mb-5">
                            <label className="block text-left text-sm font-medium text-gray-700 mb-2" htmlFor="default-search">
                                Groepsnaam
                            </label>
                            <form onSubmit={handleSubmit}><input onChange={handleChange} name="newGroupName" type="text" id="default-search" className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" required /></form></div>
                        <article className='flex justify-start'>
                            <button onClick={handleSubmit} type="button" className="text-white bg-green bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Groep toevoegen
                            </button>
                            <button onClick={removePopup} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900">Sluiten
                            </button>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    )

}
