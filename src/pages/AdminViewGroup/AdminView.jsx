import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Navbar from '../../components/Navbar/Navbar';
import { useQuery } from '@tanstack/react-query';
import { addUsersCsvToGroup, deleteGroup, deleteStudentFromGroup, getGroupById, getGroupUsersById } from '../../api/groups';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { addStudents } from '../../api/users';
import { addDeelOpdracht, addOpdracht, deleteDeelOpdrachtById, deleteOpdrachtById, getOpdrachtenByGroepId } from '../../api/assignments';
import { useFormik } from 'formik';


const AdminView = () => {
    const [usersOfGroup, setUsersOfGroup] = useState([]);
    const [deleteGroup, setDeletePopupGroup] = useState(false);
    const [assignmentsState, setAssignmentsState] = useState();
    const [assignmentToDelete, SetAssignmentToDelete] = useState();
    const [subAssignmentToDelete, SetSubAssignmentToDelete] = useState();
    const navigate = useNavigate();

    // file upload
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone(
        {
            onDrop: (acceptedFiles) => {
                const file = acceptedFiles[0];
                const reader = new FileReader();
                reader.onabort = () => console.log('file reading was aborted');
                reader.onerror = () => console.log('file reading has failed');
                reader.onload = () => {
                    const csvFile = reader.result;
                    addStudents(csvFile);
                };
                reader.readAsText(file);
            },
        },
    );

    const files = acceptedFiles.map(file => (
        <li key={file.path} className="list-none">
            {file.path} - {file.size} bytes
        </li>
    ));

    // get id from url use params
    const { id } = useParams();
    // get name of group use query (data as groupName)
    const { data: groepNaam, isLoading, error } = useQuery(['group', id], () => getGroupById(id));
    // get users of group use query (data as users)
    const { data: users, isLoading: usersLoading, error: usersError } = useQuery(['users', id], () => getGroupUsersById(id));
    //assignments
    const { data: assignments, isLoading: isLoadingAssignments, error: errorAssignments } = useQuery(['assignments', id], () => getOpdrachtenByGroepId(id));


    useEffect(() => {
        if (users) {
            setUsersOfGroup(users.data);
        }
        if (assignments) {
            setAssignmentsState(assignments.data);
        }
    }, [assignments, users]);

    const deleteDeelopdracht = (id) => {
        deleteDeelOpdrachtById(id);
        const nieuweOpdrachten = [...assignmentsState];
        nieuweOpdrachten[0].opdrachtElementen = assignmentsState[0].opdrachtElementen.filter((opdracht) => opdracht.id !== id);
        setAssignmentsState(nieuweOpdrachten);
    };

    const deleteOpdrachtF = (id) => {
        SetAssignmentToDelete(id);
    };

    // useForm
    const { handleChange, handleSubmit } = useFormik({
        initialValues: {
            beschrijving: "",
            tijd: "",
        },
        onSubmit: async (values) => {
            const addedDeelopdracht = await addDeelOpdracht(assignments.data[0].id, values.beschrijving, values.tijd);
            const nieuweOpdracht = [...assignmentsState[0].opdrachtElementen, addedDeelopdracht.data]
            const nieuweOpdrachtState = [...assignmentsState];
            nieuweOpdrachtState[0].opdrachtElementen = nieuweOpdracht;
            setAssignmentsState(nieuweOpdrachtState);
        }
    })

    const { handleChange: opdrachtHandleChange, handleSubmit: opdrachtHandleSubmit } = useFormik({
        initialValues: {
            beschrijving: ""
        },
        onSubmit: async (values) => {
            const opdracht = await addOpdracht(id, values.beschrijving);
            setAssignmentsState([...assignmentsState, opdracht.data]);
        }
    })

    return (
        <>
            {isLoading && (<div className='h-full flex justify-center items-center'>
                <div>
                    <div className='loadingImgTurning'>

                    </div>
                    <h1 className='text-darkGrey font-semibold text-2xl animate-pulse'>Laden</h1>
                </div>
            </div>)}
            {error && <p>{error.message}</p>}
            <Navbar />
            {
                groepNaam && (<main className="px-6 lg:mx-28 lg:px-40 bg-white w-auto h-fit lg:h-screen pt-24">
                    <div className='flex items-center gap-5'>
                        <Link to="/avg"><button className='py-2 px-4 text-white text-lg font-semibold rounded-md flex justify-center items-center gap-3 bg-blue hover:bg-darkGrey'>
                            <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Groepen
                        </button></Link>
                        <h1 className='text-4xl font-semibold text-blue flex items-center gap-2 justify-between w-full'>
                            <span className='flex items-center gap-2'>
                                Admin view <span className='text-darkGrey flex items-center'>{groepNaam.data.naam}</span>
                            </span>
                            <button className='bg-red text-white border-2 border-red p-1 rounded hover:bg-white hover:text-red text-xs flex items-center gap-1' onClick={() => setDeletePopupGroup(current => !current)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                groep verwijderen
                            </button>
                        </h1>
                    </div>

                    {
                        assignments && assignmentsState && (assignmentsState.length > 0) && (
                            <>
                                <h2 className='text-xl font-semibold text-darkGrey pt-7 flex items-center gap-2'>
                                    Opdrachten
                                </h2>
                                <section className='border border-1 border-lightGrey bg-lightBlue rounded-md'>
                                    <div>
                                        {assignmentsState.map((assignment, index) => (
                                            <h3 key={index} className='
                                        bg-white text-blue font-semibold rounded-md p-4 flex justify-between
                                    '>
                                                {assignment.naam}

                                                <button onClick={() => deleteOpdrachtF(assignment.id)} className='bg-red text-white border-2 border-red p-1 rounded hover:bg-white hover:text-red text-xs flex items-center gap-1'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </h3>
                                        ))}
                                    </div>
                                    <div>
                                        {
                                            assignmentsState[0].opdrachtElementen &&
                                            assignmentsState[0].opdrachtElementen.map((deelOpdracht) => (
                                                <p key={deelOpdracht.id} className="text-darkGrey text-md font-normal p-4 flex justify-between">
                                                    {deelOpdracht.beschrijving}
                                                    <button onClick={() => deleteDeelopdracht(deelOpdracht.id)} className='bg-red text-white border-2 border-red p-1 rounded hover:bg-white hover:text-red text-xs flex items-center gap-1'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </p>
                                            ))

                                        }
                                    </div>
                                    <div className='bg-white p-2'>
                                        <form onSubmit={handleSubmit} className='grid grid-cols-5 gap-2 items-center'>
                                            <input type="text"
                                                className='col-span-3 border border-1 border-lightGrey rounded-md p-2 font-normal'
                                                placeholder='Deelopdracht die u wilt toevoegen'
                                                onChange={handleChange} name="beschrijving"
                                                required
                                            />
                                            <input type="text"
                                                className='col-span-1 border border-1 border-lightGrey rounded-md p-2 font-normal'
                                                placeholder='Aantal minuten' name="tijd"
                                                onChange={handleChange}
                                                required
                                            />
                                            <button className='bg-blue text-white border-2 p-1 border-blue rounded hover:bg-white hover:text-blue flex items-center w-full h-fit text-center'>
                                                DeelOpdracht toevoegen
                                            </button>
                                        </form>
                                    </div>
                                </section>
                            </>
                        )
                    }

                    {
                        assignments && assignmentsState && (!assignmentsState.length > 0) && (
                            <>
                                <h2 className='text-xl font-semibold text-darkGrey pt-7 flex items-center gap-1  mt-10'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Opdracht toevoegen
                                </h2>
                                <section className='border border-1 border-lightGrey bg-lightBlue rounded-md'>
                                    <div className='bg-white p-2'>
                                        <form onSubmit={opdrachtHandleSubmit} className='grid grid-cols-5 gap-2 items-center'>
                                            <input type="text"
                                                className='col-span-4 border border-1 border-lightGrey rounded-md p-2 font-normal'
                                                placeholder='Opdracht die u wilt toevoegen'
                                                name='beschrijving'
                                                onChange={opdrachtHandleChange}
                                            />
                                            <button className='bg-blue text-white border-2 p-1 px-4 border-blue rounded hover:bg-white hover:text-blue flex items-center w-full h-fit text-center'>
                                                Opdracht toevoegen
                                            </button>
                                        </form>
                                    </div>
                                </section>
                            </>
                        )
                    }
                    <section className='grid grid-cols-3 gap-5 mt-10'>
                        <article>
                            <h2 className='text-xl font-semibold text-darkGrey pt-7 flex items-center gap-2'>
                                Gebruikers toevoegen <span className='
                            text-sm font-normal text-gray-500'>
                                    CSV file
                                </span></h2>
                            <div className='' {...getRootProps()}>
                                <input  {...getInputProps()} />
                                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-lig border-dashed rounded-lg cursor-pointer bg-lightBlue hover:bg-gray-100">
                                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik om up te loaden</span> of drag and drop</p>
                                    {!files && <p className="text-xs text-gray-500">CSV</p>}
                                    {files && files}
                                </div>
                            </div>
                        </article>
                        <article className='col-span-2'>
                            <h2 className='text-xl font-semibold text-darkGrey pt-7 flex items-center gap-2'>
                                Gebruikers
                            </h2>
                            {users && <UserTable users={usersOfGroup} setUsers={setUsersOfGroup} groepNaam={groepNaam.data.naam} />}
                            {usersError && <p className='text-red-500'>{usersError}</p>}
                            {usersLoading && <p className='text-blue-500'>Loading...</p>}
                        </article>
                    </section>
                    {
                        groepNaam && (deleteGroup && <DeleteGroupPopup groepNaam={groepNaam.data.naam} groepId={groepNaam.data.id} setDeletePopupGroup={setDeletePopupGroup} navigate={navigate} />)
                    }
                    {
                        assignmentToDelete && <DeleteOpdrachtPopup assignmentToDelete={SetAssignmentToDelete} assignmentName={assignmentsState[0].naam} opdrachtId={assignmentToDelete} setAssignmentsState={setAssignmentsState} />
                    }
                    {
                        subAssignmentToDelete && <DeleteDeelOpdrachtPopup deelOpdrachtId={subAssignmentToDelete} setDeletePopupGroup={SetSubAssignmentToDelete} setAssignmentsState={setAssignmentsState} />
                    }
                </main>
                )
            }
        </>
    );
}

export default AdminView

const UserTable = ({ users, setUsers, groepNaam }) => {
    const [selectedUser, setSelectedUser] = useState();

    const deleteUser = async (user) => {
        setSelectedUser(user);
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto">
                <div className="py-2 align-middle inline-block min-w-full">
                    <div className="overflow-hidden border border-lightGrey sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 ">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue uppercase tracking-wider">
                                        Naam
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue uppercase tracking-wider">
                                        Voornaam
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red uppercase tracking-wider">
                                        Acties
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users && users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-2 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.student.familieNaam}
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.student.voorNaam}</div>
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.student.email}</div>
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                            <button className='w-50 text-white bg-red hover:text-red-700 rounded p-1 m-0 border border-red hover:bg-white hover:text-red ' onClick={() => deleteUser(user)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedUser && <DeletePopup users={users} setUsers={setUsers} selectedUser={selectedUser} groepNaam={groepNaam} setSelectedUser={setSelectedUser} />}
        </div>
    )
}

const DeletePopup = ({ selectedUser, groepNaam, setSelectedUser, setUsers, users }) => {

    const deleteHandler = async (userId) => {
        await deleteStudentFromGroup(groepId, userId);
        setSelectedUser(null);
        // delete user with userId from users with setUsers
        const newUsers = users.filter(user => user.student.id !== userId);
        setUsers(newUsers);
    }

    const removePopup = () => {
        setSelectedUser(null)
    }
    const { voorNaam, familieNaam, id } = selectedUser.student;
    const { groepId } = selectedUser;
    return (
        <div id="popup-modal" tabIndex="-1" className="fixed w-screen top-0 left-0 z-50 p-4 md:inset-0 md:h-full bg-opacity-70 bg-darkGrey flex justify-center items-center" >
            <div className="relative w-full h-full max-w-md md:h-auto ">
                <div className="bg-white rounded-lg">
                    <button onClick={removePopup} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Modal sluiten</span>
                    </button>
                    <div className="p-6 text-center">
                        <svg aria-hidden="true" className="mx-auto mb-4 text-red w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500">Ben je zeker dat je <b>{`${voorNaam} ${familieNaam}`}</b> wilt verwijderen uit de groep <b>{groepNaam}</b> ?</h3>
                        <button onClick={() => deleteHandler(id)} type="button" className="text-white bg-red bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Ja, ik ben het zeker
                        </button>
                        <button onClick={removePopup} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-lightGrey text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">Nee, ik wil het niet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DeleteGroupPopup = ({ groepNaam, groepId, setDeletePopupGroup, navigate }) => {

    const deleteHandler = (id) => {
        deleteGroup(id);
        setDeletePopupGroup(false);
        navigate('/avg');
    }

    return (
        <>
            <div className="cursor-pointer fixed w-screen top-0 left-0 z-50 p-4 md:inset-0 md:h-full bg-opacity-70 bg-darkGrey flex justify-center items-center" onClick={() => setDeletePopupGroup(current => !current)}>
            </div>
            <div className="w-fit fixed left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 z-50 h-fit max-w-md md:h-auto ">
                <div className="bg-white rounded-lg">
                    <button onClick={() => setDeletePopupGroup(current => !current)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Modal sluiten</span>
                    </button>
                    <div className="p-6 text-center">
                        <svg aria-hidden="true" className="mx-auto mb-4 text-red w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500">Ben je zeker dat je de groep <b>{`${groepNaam}`}</b> wilt verwijderen?</h3>
                        <button onClick={() => deleteHandler(groepId)} type="button" className="text-white bg-red bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Ja, ik ben het zeker
                        </button>
                        <button onClick={() => setDeletePopupGroup(current => !current)} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-lightGrey text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">Nee, ik wil het niet
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

const DeleteOpdrachtPopup = ({ assignmentName, opdrachtId, setAssignmentsState, assignmentToDelete }) => {
    const deleteHandler = (id) => {
        deleteOpdrachtById(id);
        setAssignmentsState([]);
        assignmentToDelete(false);
    }

    return (
        <>
            <div className="cursor-pointer fixed w-screen top-0 left-0 z-50 p-4 md:inset-0 md:h-full bg-opacity-70 bg-darkGrey flex justify-center items-center" onClick={() => assignmentToDelete(false)}>
            </div>
            <div className="w-fit fixed left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 z-50 h-fit max-w-md md:h-auto ">
                <div className="bg-white rounded-lg">
                    <button onClick={() => assignmentToDelete(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Modal sluiten</span>
                    </button>
                    <div className="p-6 text-center">
                        <svg aria-hidden="true" className="mx-auto mb-4 text-red w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500">Ben je zeker dat je de opdracht <b>{`${assignmentName}`}</b> wilt verwijderen?</h3>
                        <button onClick={() => deleteHandler(opdrachtId)} type="button" className="text-white bg-red bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Ja, ik ben het zeker
                        </button>
                        <button onClick={() => assignmentToDelete(false)} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-lightGrey text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">Nee, ik wil het niet
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
const DeleteDeelOpdrachtPopup = ({ assignmentName, opdrachtId, setDeletePopupGroup, setAssignmentsState }) => {
    const deleteHandler = (id) => {
        deleteOpdrachtById(id);
        setDeletePopupGroup(false);
        setAssignmentsState([]);
    }

    return (
        <>
            <div className="cursor-pointer fixed w-screen top-0 left-0 z-50 p-4 md:inset-0 md:h-full bg-opacity-70 bg-darkGrey flex justify-center items-center" onClick={() => setDeletePopupGroup(current => !current)}>
            </div>
            <div className="w-fit fixed left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 z-50 h-fit max-w-md md:h-auto ">
                <div className="bg-white rounded-lg">
                    <button onClick={() => setDeletePopupGroup(current => !current)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Modal sluiten</span>
                    </button>
                    <div className="p-6 text-center">
                        <svg aria-hidden="true" className="mx-auto mb-4 text-red w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500">Ben je zeker dat je de opdracht <b>{`${assignmentName}`}</b> wilt verwijderen?</h3>
                        <button onClick={() => deleteHandler(opdrachtId)} type="button" className="text-white bg-red bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Ja, ik ben het zeker
                        </button>
                        <button onClick={() => setDeletePopupGroup(current => !current)} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-lightGrey text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">Nee, ik wil het niet
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}