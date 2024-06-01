import React, { useEffect, useState} from 'react';
import { Navigate } from "react-router";
import { getToken, getUser } from '../../utils/storage';

const Protected = ({ children } : any) => {
    if(!getToken()) {
        return <Navigate to="/login" replace/>
    }

    return children;
}

export default Protected;
