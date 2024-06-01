import React, { useState, useEffect } from 'react';
import "./PreviewPdfModal.css";
import * as Yup from 'yup';
import { ImCancelCircle } from 'react-icons/im';


function JoinClassModal({ onClose, onClassAdded } : any) {
    const [error, setError] = useState(null);
    const docs = [
        { uri: "https://firebasestorage.googleapis.com/v0/b/virtual-academy-f4599.appspot.com/o/pdf-content%2F1675707198325-105_20221016-4-1xvxiib.oc79k.pdf?alt=media&token=b230a01a-dbec-432a-8b99-c1de7faae7d3" },
      ];


    return (
        <div>
            <div  className='add-modal-container join-modal'>
                <div className='modal-head'>
                    <p className="modal-title">Apply For Ongoing Academic Year</p>
                    <ImCancelCircle style={{cursor: 'pointer'}} onClick={onClose} size={22} color="#fff"/>
                </div>
                    <div className='modal-content'>

                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
           
            </div>
        </div>
    );
}

export default JoinClassModal;