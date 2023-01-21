import React from 'react'
import Assignment from './Assignment';

const AssignmentList = ({ assignmentsArray }) => {

    return (
        <>
            {
                assignmentsArray.map((assignment, index) => {
                    return (
                        <div key={index}>
                            <Assignment assignment={assignment} />
                        </div>
                    )
                })
            }
        </>
    )
}

export default AssignmentList