import React from 'react'
import Courses from '../../components/Courses/Courses'
import Navbar from '../../components/Navbar/Navbar'

const StudentViewGroup = () => {

    document.title = 'Volgsysteem | Student view group'

    return (
        <>
            <Navbar />
            <main className='px-6 lg:mx-28 lg:px-40 bg-white w-auto h-fit pt-24 lg:h-screen'>
                <h1 className='text-4xl font-semibold text-blue py-7'>Student view</h1>
                <Courses role="Student" />
            </main>
        </>
    )
}

export default StudentViewGroup