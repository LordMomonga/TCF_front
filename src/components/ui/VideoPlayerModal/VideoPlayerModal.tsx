import React, { useState, useEffect } from 'react';
import './VideoPlayerModal.css';
import * as Yup from 'yup';
import Form from '../../form/components/Form/Form';
import FormField from '../../form/components/FormField/FormField';
import Button from '../../form/components/Button/Button';
import ErrorMessage from '../../form/components/ErrorMessage/ErrorMessage';
import { ImCancelCircle } from 'react-icons/im';
import { FaCloudUploadAlt, FaTrashAlt } from  'react-icons/fa';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import BeatLoader from "react-spinners/BeatLoader";
import ProgressBar from '../../Progress/Progress';


import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage';

import { firebaseApp } from '../../../utils/firebaseConfig';

import { createCourseContent } from '../../../services/courseContent';

import { getClasses, deleteClass } from '../../../services/classroom';
import { addPassExamContent } from '../../../services/passExams';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { createAssessment } from '../../../services/assessment';

const override = {
    marginTop: '20px'
  };



function VideoPlayerModal({ onClose, video } : any) {

    return (
        <div>
            <div  className='modal-container video-modal-container'>
                <div className='modal-head'>
                    <p className="modal-title">VIEO CONTENT</p>
                    <ImCancelCircle style={{cursor: 'pointer'}} onClick={onClose} size={22} color="#fff"/>
                </div>
                <div className='modal-content'>
                    <video className="video-player" src={video} controls/>
                </div>
            </div>
            <div className="modal-shadow" onClick={onClose}>
               
            </div>
        </div>
    );
}

export default VideoPlayerModal;
