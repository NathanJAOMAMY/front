import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {userInfo} = useAuth()
    
    // afficher la page de login si l'information de l'utilisateur n'est pas présente
    if(!userInfo){
        return <Navigate to = "/login"/>
    }

    // 
    return children
};

export default ProtectedRoute;