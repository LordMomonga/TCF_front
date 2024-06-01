import React from 'react';
import { useNavigate } from "react-router-dom";
import './AuthLayout.css';

function AuthLayout({ title, subTitle, children } : any) {
    const navigate = useNavigate();

    return (
        <div>
            <div className="login-container">
            <div className="left">
                <div className="login-welcome-message ">
                  <p className="text-white">{title}</p>
                  <p className="text-white">{subTitle}</p>
                  <img src={require('../../../../assets/images/auth/banner.png')} alt="" />
                </div>
            </div>
            <div className="right">
                <div className="logo-box">
                    <span onClick={() => navigate('/')} className='font-bold cursor-pointer text-4xl text-violet-500'>Tolkin</span>
                </div>
                
                { children }
            </div>
        </div>
        </div>
    );
}

export default AuthLayout;
