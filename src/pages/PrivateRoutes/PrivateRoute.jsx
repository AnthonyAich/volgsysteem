import React from 'react';
import { useSession } from '../../hooks/useSession';
import Login from '../Login/Login';
import Error404 from '../Error404/Error404';

const PrivateRoute = ({ role, element }) => {
    const { user, isAuth } = useSession();

    return (
        <>
            {
                user && (role.includes(user.role) ? element : <Login />)
            }
            {
                !isAuth && <Login />
            }
        </>
    )
}
export default PrivateRoute