import { BiAlarmExclamation } from 'react-icons/bi'
import { BiQuestionMark } from 'react-icons/bi'
import { Question } from './constant'
import { BiError } from 'react-icons/bi'
import { BiExit } from 'react-icons/bi'
import { BiSkipNext } from 'react-icons/bi'
import { NavLink, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getUser } from '../../utils/storage'
import { useEffect } from 'react'
import { selectExpresssionEcrite } from '../../services/assessment'
import { setSolutionExpressionEcrite } from '../../services/assessment'
import { toast } from 'react-toastify';
import { Console, log } from 'console'
import { Link } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}



const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className='text-gray-700 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-5 rounded-md text-center'>
        <p className='mb-4'>{message}</p>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onConfirm}
            className='bg-red-500 text-white px-4 py-2 rounded-md'
          >
            Oui
          </button>
          <button
            onClick={onCancel}
            className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md'
          >
            Non
          </button>
        </div>
      </div>
    </div>
  );
};


const EE: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [remainingTime, setRemainingTime] = useState<number>(35 * 60)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);

  const [sujet1, setSujet1]= useState([])
  const [sujet2, setSujet2]= useState([])
  //solution de chaque epreuve de l'expression ecrite 

  const [contenu1, setContenu1] = useState<string>('');
  const [contenu2, setContenu2] = useState<string>('');
  const [contenu3, setContenu3] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [wordCount1, setWordCount1] = useState<number>(0);
  const [wordCount2, setWordCount2] = useState<number>(0);
  const [contenu1_id, setcontenu1_id] = useState<string | null>(null);
  const [contenu2_id, setcontenu2_id] = useState<string | null>(null);
  const [contenu3_id, setcontenu3_id] = useState<string | null>(null);
  const locate = useNavigate();
  const [sujet3, setSujet3]= useState([])

  const handleExpressionEcrite = () => {
    setLoading(true)
    selectExpresssionEcrite().then((res: any) =>{
      console.log('RESPONSE GET: ', res);
      if(res.ok) {
        setData(res.data.data);
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
      console.log('error: ', err);
      setLoading(false);
    })
  }
  const handleTextareaChange1 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContenu1(text);
    
    // Compter les mots
    const words = text.trim().split(/\s+/); // Diviser par les espaces
    setWordCount1(words.filter(word => word.length > 0).length); // Filtrer les mots vides
  };
  const handleTextareaChange2 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContenu2(text);
    
    // Compter les mots
    const words = text.trim().split(/\s+/); // Diviser par les espaces
    setWordCount2(words.filter(word => word.length > 0).length); // Filtrer les mots vides
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContenu3(text);
    
    // Compter les mots
    const words = text.trim().split(/\s+/); // Diviser par les espaces
    setWordCount(words.filter(word => word.length > 0).length); // Filtrer les mots vides
  };

  const handleSubmit =  (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      contenu1,
      contenu2,
      contenu3,
      contenu1_id,
      contenu2_id,
      contenu3_id
    };
    console.log(data);
    
    setSolutionExpressionEcrite(data).then((res: any) => {
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
    handleExpressionEcrite();
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
    let usr = getUser();
    setUser(usr);
}, [])

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);
  const [selectedTask, setSelectedTask] = useState<string>('tache1'); // default task
  const navigate = useNavigate();

  const handleSkipTest = () => {
    setShowConfirmation(true);
    setConfirmationAction(() => () => navigate('/home'));
  };

  const handleQuitExam = () => {
    setShowConfirmation(true);
    setConfirmationAction(() => () => navigate('/home'));
  };

  const handleConfirm = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmationAction(null);
  };

  const renderTaskContent = () => {
    switch (selectedTask) {
      case 'tache1':
        return (
          <div>
            <h1 className='text-center font-bold text-xl'>Tache 1</h1>
            {sujet1?.map((data:any, index:any) => 
            <p className='w-[100%] text-center mt-5'>
            {data?.titre}
              <span className='block mt-2 font-bold'>{data?.contenu}</span>
            </p>
          )}
            <div>
              <textarea
                placeholder='ecrivez votre redaction ici'
                className='mx-[5%] min-h-[240px] mt-10 text-center w-[90%] border-[1px] border-gray-500'
                value={contenu1}
                onChange={handleTextareaChange1}
              >
              </textarea>
              <div className='mt-2 text-end mr-7'>
        Nombre de mots : {wordCount1}
      </div>
            </div>
          </div>
        );
      case 'tache2':
        return (
          <div>
            <h1 className='text-center font-bold text-xl'>Tache 2</h1>
            {sujet2?.map((data:any, index:any) => 
              <p className='w-[100%] text-center mt-5'>
              {data?.titre}
                <span className='block mt-2 font-bold'>{data?.contenu}</span>
              </p>
            )}
            <div>
              <textarea
                placeholder='ecrivez votre redaction ici'
                className='mx-[5%] min-h-[240px] mt-10 text-center w-[90%] border-[1px] border-gray-500'
                value={contenu2}
                onChange={handleTextareaChange2}
              >
              </textarea>
              <div className='mt-2 text-end mr-7'>
          Nombre de mots : {wordCount2}
            </div>
            </div>
          </div>
        );
      case 'tache3':
        return (
          <div>
            <h1 className='text-center font-bold text-xl'>Tache 3</h1>
            {sujet3?.map((data:any, index:any) => 
            <p className='w-[100%] text-center mt-5'>
            {data?.titre}
              <span className='block mt-2 font-bold'>{data?.contenu}</span>
            </p>
          )}
            <div>
              <textarea
                placeholder='ecrivez votre redaction ici'
                className='mx-[5%] min-h-[240px] mt-10 text-center w-[90%] border-[1px] border-gray-500'
                value={contenu3}
                onChange={handleTextareaChange}
              >
              </textarea>
              <div className='mt-2 text-end mr-7'>
        Nombre de mots : {wordCount}
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
        <span className='mt-8 block font-bold text-sm uppercase text-white '>Expression Ecrite</span>
        <div
          className={`mt-[30%] text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache1' ? 'bg-blue-500 text-white border-white border-[1px]' : 'bg-white'}`}
          onClick={() => setSelectedTask('tache1')}
        >
          tache 1
        </div>
        <div
          className={`mt-[30%] text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache2' ? 'bg-blue-500 text-white border-white border-[1px]' : 'bg-white'}`}
          onClick={() => setSelectedTask('tache2')}
        >
          tache 2
        </div>
        <div
          className={`mt-[30%] text-gray-700 text-center rounded-md py-1 cursor-pointer ${selectedTask === 'tache3' ? 'bg-blue-500 text-white border-white border-[1px]' : 'bg-white'}`}
          onClick={() => setSelectedTask('tache3')}
        >
          tache 3
        </div>
      </div>
      <div className='z-10 fixed right-0 px-4 bg-prim h-[80%]'>
        <div className='bg-white px-5 text-gray-600 text-sm text-center rounded-md py-2'>
          <h1 className='font-bold underline underline-offset-4'>Mon profil</h1>
          <div className='py-3 text-left'>
            <span className='font-bold'>Nom: <span className='text-prim font-bolder'>{user?.username}</span></span>
            <span className='block mt-2 font-bold'>Adresse: <span className='text-prim font-bolder'>{user?.email}</span></span>
            <span className='block mt-2 font-bold'>Partie: Expression Ecrite</span>
            <span className='block mt-2 font-bold'>Durée: 45min</span>
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
          className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center cursor-pointer'
          onClick={handleSubmit}
        >
          <BiSkipNext className='text-md bg-green-500 text-white' />
          <span>submit this test</span>
        </div> 
        <Link to="/students/course-contents">  <div
          className='bg-white text-gray-600 px-5 py-2 rounded-xl font-bold flex gap-2 items-center cursor-pointer'
        >
          <BiExit className='text-md bg-red-500 text-white' />
          <span>quit the examination</span>
        </div></Link>
      </div>
      <div className='bg-white h-[80%] w-[70%] py-2 left-[12%] px-5 text-gray-700 fixed z-0'>
        <div className='mt-5'>{renderTaskContent()}</div>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to proceed?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default EE;

