import { BsRecordCircle } from "react-icons/bs"; 
import { MdRecordVoiceOver } from "react-icons/md"; 
import { MdSettingsVoice } from "react-icons/md"; 
import React from 'react'
import { BiAlarmExclamation } from 'react-icons/bi'
import { BiQuestionMark } from 'react-icons/bi'
import { Question } from './constant'
import { BiError } from 'react-icons/bi'
import { BiExit } from 'react-icons/bi'
import { BiSkipNext } from 'react-icons/bi'
import { NavLink, Outlet } from 'react-router-dom';
import { getUser } from '../../utils/storage'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { storage } from '../../utils/firebaseConfig'
import { getDownloadURL } from 'firebase/storage'
import { uploadBytesResumable, ref } from 'firebase/storage'
import { selectExpresssionOrale } from '../../services/assessment'
import { log } from 'console'
import { setSolutionExpressionOrale } from '../../services/assessment'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { setConstantValue } from 'typescript'
import { Link } from 'react-router-dom'

const Eo : React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [record, setRecord] = useState(false)
  const [remainingTime, setRemainingTime] = useState<number>(15 * 60)
  const [selectedTask, setSelectedTask] = useState<string>('tache1'); // default task
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [sujet1, setSujet1]= useState([])
  const [sujet2, setSujet2]= useState([])
  const [sujet3, setSujet3]= useState([])
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioUrl1, setAudioUrl1] = useState<string | null>(null);
  const [audioUrl2, setAudioUrl2] = useState<string | null>(null);
  const [contenu1_id, setcontenu1_id] = useState<string | null>(null);
  const [contenu2_id, setcontenu2_id] = useState<string | null>(null);
  const [contenu3_id, setcontenu3_id] = useState<string | null>(null);

  const locate = useNavigate();
  const timeRef = useRef(0); // Utilisation d'une ref pour `time`


const handleExpressionOrale = () => {
  setLoading(true)

  selectExpresssionOrale().then((res: any) => {
      console.log('RESPONSE GET : ', res.data.data.selectedSubjects1);

      if(res.ok) {
        setData(res.data.data.selectedSubjects1);
        setSujet1(res.data.data.selectedSubjects1);
        setSujet2(res.data.data.selectedSubjects2);
        setSujet3(res.data.data.selectedSubjects3);
        setcontenu1_id( res.data.data.selectedSubjects1[0]._id)
        setcontenu2_id( res.data.data.selectedSubjects2[0]._id)
        setcontenu3_id( res.data.data.selectedSubjects3[0]._id)
      }
      console.log(sujet1, sujet2, sujet3);
      setLoading(false);
  }).catch(err => {
    console.log('error', err)
    setLoading(false);
  })
}
  const startRecording = () => {
    setRecord(true);
  }

  const stopRecording = () => {
    setRecord(false);
  };
  const addAudioElement = async (blob: Blob) => {
    
    if (!blob) {
      console.error("Blob is undefined or null");
      return;
    }
    
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  
    // Créer une référence de stockage et démarrer le téléchargement
    const storageRef = ref(storage, `audio/${Date.now()}.webm`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
  console.log(audio.src);
  
    // Suivre l'état du téléchargement
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
        // Stocker le downloadURL dans Firestore ou l'utiliser comme nécessaire
        setAudioUrl(downloadURL);
        console.log(audioUrl);
        
      }
    );
  };
  const addAudioElement1 = async (blob: Blob) => {
    if (!blob) {
      console.error("Blob is undefined or null");
      return;
    }
    
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  
    // Créer une référence de stockage et démarrer le téléchargement
    const storageRef = ref(storage, `audio/${Date.now()}.webm`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
  console.log(audio.src);
  
    // Suivre l'état du téléchargement
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
        // Stocker le downloadURL dans Firestore ou l'utiliser comme nécessaire
        setAudioUrl1(downloadURL);
        console.log(audioUrl);
        
      }
    );
  };
  const addAudioElement2 = async (blob: Blob) => {
    if (!blob) {
      console.error("Blob is undefined or null");
      return;
    }
    
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  
    // Créer une référence de stockage et démarrer le téléchargement
    const storageRef = ref(storage, `audio/${Date.now()}.webm`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
  console.log(audio.src);
  
    // Suivre l'état du téléchargement
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
        // Stocker le downloadURL dans Firestore ou l'utiliser comme nécessaire
        setAudioUrl2(downloadURL);
        console.log(audioUrl);
        
      }
    );
  };
// partie pour valider lenregistrement des donneee

  const handleSubmit =  (event?: React.FormEvent) => {
    if (event) event.preventDefault();

    if (!audioUrl || !audioUrl1 || !audioUrl2) {
      toast.error("Tous les champs audio doivent être remplis", {
          pauseOnHover: false,
          closeOnClick: true,
      });
      return; // Arrête l'exécution si les données sont manquantes
  }

    const data = {
      audioUrl,
      audioUrl1,
      audioUrl2,
      contenu1_id,
      contenu2_id,
      contenu3_id,
    };
    console.log(data);
    
    setSolutionExpressionOrale(data).then((res: any) => {
      console.log(res)
      if(res.ok) {
        toast.success("Submit with succes", {
            pauseOnHover: false,
            closeOnClick: true,
        })
        locate('/students/passexams')
    }else {
        toast.error("Error while submitting the Test", {
            pauseOnHover: false,
            closeOnClick: true,
        })
    }
    }).catch(err => {   
      console.log('ERROR CREATING: ', err);

      toast.error("ERROR", {
          pauseOnHover: false,
          closeOnClick: true,
      })
  })

  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}min ${remainingSeconds.toString().padStart(2, '0')}s`;
  };
   
  useEffect(() => {
    let time = 0

    const intervalId = setInterval(() => {
     time ++
      if(time === 1000) {
        handleSubmit();

      }

    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    handleExpressionOrale();
    let usr = getUser();
    setUser(usr);
}, [])
const renderTaskContent = () => {
  switch (selectedTask) {
    case 'tache1':
      return (
        <div className=" mt-5 py-5">
          <h1 className='text-center font-bold text-md'>Tache 1</h1>
          <div className="flex justify-center w-full">
          {sujet1?.map((data:any, index:any) => 
            <p className='w-[70%] text-center block mt-5'>
             <span className=" text-black px-2 text-md font-bold"> 
             Titre: {data?.titre}
              </span>
              <span className='block mt-5  block mb-5 border-solid border-gray-200 border-2  '>{data?.contenu}</span>
            </p>
          )}
          </div>
        
         
          
          <div  className=" flex justify-center items-center gap-5">
      <h1 className="flex items-center gap-2  mt-[5%]  mb-[5%] text-blue-500 text-sm">Enregistrement Audio <BsRecordCircle /></h1>
    
     <AudioRecorder 
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }} 
        downloadOnSavePress={true}
        downloadFileExtension="webm"
      />
     
    
     
    </div>
          
        </div>
      );
    case 'tache2':
      return (
        <div className="  mt-5 py-5">
            <h1 className='text-center font-semibold text-md '>Tache 2</h1>
          <div className="flex justify-center w-full">
        
          
          {sujet2?.map((data:any, index:any) => 
            <p className='w-[70%] text-center mt-5 '>
              <span className=" text-black px-2 text-md font-bold"> 
             Titre: {data?.titre}
              </span>
            
              <span className='block mt-5  block mb-5 border-solid border-gray-200 border-2  '>{data?.contenu}</span>
            </p>
          )}
          </div>
        
         
          <div className=" flex justify-center items-center gap-5">
          <h1 className="flex items-center gap-2 mt-[5%]  mb-[5%] text-blue-500 text-sm">Enregistrement Audio <BsRecordCircle /></h1>   
    <div className="border-gray-100 flex justify-center items-center border-solid border-2 h-[150px] w-[150px] rounded-full">
    <div className="border-gray-100 flex justify-center items-center border-solid border-2 h-[100px] w-[100px] rounded-full">
     <div className="border-gray-100 flex justify-center items-center border-solid border-2 h-[70px] w-[70px] rounded-full">   
      <AudioRecorder 
        onRecordingComplete={addAudioElement1}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }} 
        downloadOnSavePress={true}
        downloadFileExtension="webm"
      />
       </div>
      
      </div>
     </div>
    </div>
        </div>
      );
    case 'tache3':
      return (
        <div className=" mt-5 py-5">
          <h1 className='text-center font-bold text-md'>Tache 3</h1>
          <div className="flex justify-center w-full">
        
          
        {sujet3?.map((data:any, index:any) => 
          <p className='w-[70%] text-center mt-5 '>
            <span className=" text-black px-2 text-md font-bold"> 
           Titre: {data?.titre}
            </span>
          
            <span className='block mt-5  block mb-5 border-solid border-gray-200 border-2  '>{data?.contenu}</span>
          </p>
        )}
        </div>
         
          <div className=" flex justify-center items-center gap-5">
          <h1 className="flex items-center gap-2 mt-[5%]  mb-[5%] text-blue-500 text-sm">Enregistrement Audio <BsRecordCircle /></h1>
          <div className="border-gray-100 flex justify-center items-center border-solid border-2 h-[150px] w-[150px] rounded-full">
    <div className="border-gray-100 flex justify-center items-center border-solid border-2 h-[100px] w-[100px] rounded-full">
     <div className="border-gray-100 flex justify-center items-center border-solid border-2 h-[70px] w-[70px] rounded-full">    
      <AudioRecorder 
        onRecordingComplete={addAudioElement2}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }} 
        downloadOnSavePress={true}
        downloadFileExtension="webm"
      />
       </div>
      
      </div>
     </div>
    </div>
        </div>
      );
    default:
      return <div>Veuillez sélectionner une tâche.</div>;
  }
};

  return (
    <div className='bg-white'>
       <nav className='px-5 py-5 flex items-center bg-prim'>
        <span className='font-bold text-3xl text-white'>Tolkin</span>
      </nav>
      <div className='z-10 fixed left-0 px-5 bg-prim h-[80%]'>
        <span className='mt-8 block font-bold text-sm uppercase text-white  '>
          <div className="text-white flex items-center gap-2">
          <div className=" text-white h-6 w-6 bg-white flex justify-center rounded-full items-center ">
          <MdRecordVoiceOver />
          </div>
          Expression Orale
          </div></span>
        <div
          className={`mt-[30%] flex items-center gap-2 pl-2   text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache1' ? 'bg-blue-500 text-white border-white border-[1px]' : 'bg-white'}`}
          onClick={() => setSelectedTask('tache1')}
        >
          <MdSettingsVoice /> tache 1
        </div>
        <div
          className={`mt-[30%] flex items-center gap-2 pl-2  text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache2' ? 'bg-blue-500 text-white border-white border-[1px]' : 'bg-white'}`}
          onClick={() => setSelectedTask('tache2')}
        >
         <MdSettingsVoice /> tache 2
        </div>
        <div
          className={`mt-[30%] flex items-center gap-2 pl-2  text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache3' ? 'bg-blue-500 text-white border-white border-[1px]' : 'bg-white'}`}
          onClick={() => setSelectedTask('tache3')}
        >
          <MdSettingsVoice />tache 3
        </div>
      </div>
     


      <div className='z-10 fixed right-0 px-4 bg-prim h-[80%]'>
        <div className='bg-white px-5 text-gray-600 text-sm text-center rounded-md py-2'>
          <h1 className='font-bold underline underline-offset-4'>Mon profil</h1>
          <div className='py-3 text-left'>
            <span className='font-bold'>Nom: <span className='text-prim font-bolder'>{user?.username}</span></span>
            <span className='block mt-2 font-bold'>Adresse: <span className='text-prim font-bolder'>{user?.email}</span></span>
            <span className='block mt-2 font-bold'>Partie: Comprehension Orale</span>
            <span className='block mt-2 font-bold'>Durée: 15min</span>
          </div>
        </div>
        <div className='bg-white text-gray-500 mt-[30%] mb-5 rounded-md px-5 py-2'>
          <div className='text-[13px] font-bold flex items-center gap-3'>
            <BiQuestionMark className='text-white bg-blue-500 rounded-full font-bold' />
            <span>Temps: {formatTime(remainingTime)}</span>
          </div>
          <div className='mt-2 text-[13px] font-bold flex items-center gap-3'>
            <BiAlarmExclamation className='text-white bg-green-500 rounded-full font-bold' />
            <span>Temps restant:</span>
          </div>
        </div>
      </div>

      <div className='z-10 fixed bottom-0 bg-prim w-screen flex justify-between py-3 px-[10%]'>
        <div
        onClick={handleSubmit}
          className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center cursor-pointer' 
        >
          <BiSkipNext className='text-md bg-green-500 text-white' />
          <span>submit this test</span>
        </div>
    <Link to="/students/passexams">    <div className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center cursor-pointer' >
          <BiExit className='text-md bg-red-500 text-white' />
          <span>quit the examination</span>
        </div></Link>
      </div>
     
      <div className='bg-white h-[80%] w-[73%] py-2 left-[12%] px-5 text-gray-700 fixed z-0'>
        <div className='mt-5'>{renderTaskContent()}</div>
      </div>
    

    </div>
  )
}

export default Eo
