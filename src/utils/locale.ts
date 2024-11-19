import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // language resources
    resources: {
      en: {
        translation: {
         home_welcome: "Welcome To",
         home_title: "Tolkin is : ",
         home_descriptioon: "Are you looking to improve your language skills and effectively prepare for your exams? Tolkin is here to help. Our application offers a wide range of test simulations designed to replicate real exam conditions, allowing you to evaluate yourself and progress at your own pace.",
         register_text: "Signup",
         login_text: "Login",
         how_it_works: "How It Works",
         step_one_title: "Create your user account",
         step_one_description: "Create an account  and login to get started",
         step_two_title: "Pass a Realistic simulations ",
         step_two_description: "passed different type of french test",
         step_three_title: "Receive a Detailed analysis",
         step_three_description: "Upload comments and share your thoughts",
         waiting_question: "What are you waiting for?",
         features_one: "Join live simulation sessions",
         features_two: "Access past exams and their solutions",
         features_three: "Access recorded versions of simulation sessions",
         copywright_text: "© 2024 Tolkin. All rights reserved",
         login_title: "Login",
         account_text: "Don't have an account?",
         welcome_back_text: "Welcome Back",
         welcome_back_sub: "Nice to see you",
         email_required_error: "Email field is required",
         email_valid_error: "Enter a valid email",
         password_length_error: "Password must be above 4 characters",
         password_required_error: "Password Required",
         c_password_required_error: "Confirm password is required",
         login_success_text: "Logged In Succesfuly",
         login_error_text: "Email or password is wrong",
         username_required_error: "Username is required",
         password_match_error: "Passwords Must Match",
         registered_successfully: "User Registered",
         register_failed_error: "Resgistration Failed",
         create_account_title: "Create Account",
         create_account_sub: "What are you waiting for ?",
         register_form_titlle: "Register",
         r_account_text: "Already have an account? ",
         username_label: "Username",
         password_label: "Password",
         c_password_label: "Confirm Password",
         hello:"Hello",

         layout:{
             dashboard:"Dashboard",
             home:"Home",
             strategie:"strategie content",
             simulation: "pass simulation",
             results:"My results",
             table: "Time Table",
             report:"Submit Report",
            deadline: "Fees Deadlines",
            payement:"Fees Payment",
            compte:"Payement Accounts",
            user:"User",
            setting:"Settings",
            logout:'Logout',
            abonnement:"Subscription",
            gererPay:"Make Payement",
            title:"Add Subscription",
            title_course:"Course Content",
            button_cours:"Select Type Test",
            secret:"The Secret",









         },
         secret:{
            time:"Time",
            heure:"Hours",
            conseil:"Tips and tricks",
            section:{
                title1:"Task 1: Candidate Presentation (2 minutes)",
                content1:{
                    first1:"Prelude: Your name is requested",
                    first2:"Brief and overall presentation of yourself",
                    first3:"Civility",
                    first4:"Origins",
                    first5:"Studies",
                    first6:"Profession",
                    first7:"Hobbies",
                    first8:"Food preferences",
                    first9:"Projects",
                    first10:"Stay serene, very calm, and composed",
                    first11:"Make sure your interlocutor can hear you clearly"
                },
                title2:"Task 2: Exchange in Dialogue Form (5 minutes)",
                content2: {
                    first1:"2 minutes to prepare using a draft",
                    first2:"3 minutes of dialogue",
                    first3:"Ask the examiner at least 10 questions",
                    first4:"Prioritize open-ended questions",
                    first5:"Adapt to the context (informal or formal tone)",
                    first6:"Follow up on the answers to ask new questions"
                },
                  title3:"Task 3: Argumentative Point of View (Time not specified)",
                content3: {
                    first1:"Defend your point of view on a given topic",
                    first2:"Possible topics: current events, education, sports, etc.",
                    first3:"Use multiple examples to support your arguments",
                    first4:"Maintain a fluent speech",
                    first5:"Use good vocabulary",
                    first6:"Polish your linguistic style and tone"
                }

            }
           
         },
         student_layout:{
            dashboard:"Dashboard",
            course_content:"Course Content",
            assignment:"Assignments",
            assessment:"Assessments",
            assessment_submission:"Assessment Submissions",
        },
         landing:{
            cards:{
                stat_card_classroom:"Total Classrooms",
                stat_card_course_content:"Total Course Content",
                stat_card_application:"Total Applications",
                stat_card_assessments:"Total Assessments",
            },
            data_table:{
                layout_title:"Dashboard",
                title:"Student Application",
                student_name:"Student",
                class_name:"Class Name",
                status:"Status",
                submitted_date:"Submitted Date",
            },
        },
         classroom:{
            data_table:{
                layout_title:"Class Rooms",
                title:"You have: ",
                title2:"Classroom  ",
                button:"Add Classroom",
                class_name:"Name",
                class_url:"Class Url",
                created_date:"Created Date"
            }
        },
         course_content:{
            data_table:{
                layout_title:"Course Content",
                button:"Add Content",
                title:"Title",
                classroom:"Classroom",
                pdf_content:"Pdf Content",
                video_content:"Video Content",
                assignment_file:"Assignment File",
                assignment_solution:"Assignment Solution",
                published_date:"Published Date",

            },
        },
         assessment:{
                data_table:{
                    layout_title:"Assessments",
                    modal_btn:"Create Assessment",
                    title:"Title",
                    question_file:"Question File",
                    answer_pdf:"Answer Pdf",
                    publish_date:"Publish Date",
                    created_date:"Created Date",
                }
            },
         assessment_submission:{
                data_table:{
                    layout_title:"Assessment Submissions",
                    title:"Title",
                    student_name:"Student Name",
                    question_file:"Question File",
                    answer_pdf:"Answer Pdf",
                    submitted_date:"Submitted Date",
                    created_date:"Created Date",
                }
            },
         assignment:{
                data_table:{
                    layout_title:"Soumission des évaluations",
                    select_class:"Select Class",
                    select_course_content:"Select Course Content",
                    student_name:"Student Name",
                    solution:"Solution",
                    comment:"Comment",
                    submitted_date:"Submitted Date",
                }
            },
         pass_exams:{
             data_table:{
                 layout_title:"Pass Exams",
                 button:"Add content",
                 title:"Title",
                 class:"Class",
                 question_file:"Question File",
                 answer_pdf:"Answer Pdf",
                 answer_video:"Answer Video",
                 publish_date:"Publish Date",
                 created_date:"Created Date",
             }
         },
         create_live:{
                data_table:{
                    layout_title:"Live Sessions",
                    heading:"All Live Sessions",
                    button:"Create Live Session",
                    meeting_code: "Meeting Code",
                    class:"Class",
                    participants: "#Participants",
                    status:"Status",
                    session_date:"Session Date",
                }
            }


        },
      },

      fr: {
        translation: {
            home_welcome: "Bienvenue à",
            home_title: "  Tolkin ",
            home_descriptioon: "Vous cherchez à améliorer vos compétences linguistiques et à vous préparer efficacement pour vos examens ? Tolkin est là pour vous aider. Notre application vous offre une multitude de simulations de tests conçues pour vous mettre en situation réelle, vous permettant ainsi de vous évaluer et de progresser à votre rythme.",
            register_text: "S'inscrire",
            login_text: "S'identifier",
            how_it_works: "Comment ça fonctionne",
            step_one_title: "Créez votre compte utilisateur",
            step_one_description: "Créez un compte  et connectez-vous pour commencer",
            step_two_title: "Choisissez votre abonnement",
            step_two_description: "passez des simulation en fonction de votre abonnement",
            step_three_title: "Consulter vos resultats",
            step_three_description: "Determinez votre niveau en fonction des simulations",
            waiting_question: "Qu'est-ce que tu attends?",
            features_one: "Rejoignez des sessions de Simulation en direct",
            features_two: "Accéder aux examens passés et à leurs solutions",
            features_three: "Accéder aux versions enregistrées des sessions de Simulations",
            copywright_text: "© 2023 237  Tolkin. Tous les droits sont réservés",
            login_title: "Connexion",
            account_text: "Vous n'avez pas de compte ?",
            welcome_back_text: "Content de te revoir",
            welcome_back_sub: "Ravi de vous voir",
            email_required_error: "Le champ email est requis",
            email_valid_error: "Entrez un email valide",
            password_length_error: "Le mot de passe doit avoir plus de 4 caractères",
            password_required_error: "Mot de passe requis",
            c_password_required_error: "Confirmer le mot de passe est requis",
            login_success_text: "Connexion réussie",
            login_error_text: "Email ou mot de passe incorrect",
            username_required_error: "Nom d'utilisateur est nécessaire",
            password_match_error: "Les mots de passe doivent correspondre",
            registered_successfully: "Utilisateur enregistré",
            register_failed_error: "L'enregistrement a échoué",
            create_account_title: "Créer un compte",
            create_account_sub: "Qu'est-ce que vous attendez?",
            register_form_titlle: "S'enregistrer",
            r_account_text: "Vous avez déjà un compte? ",
            username_label: "Nom d'utilisateur",
            password_label: "Mot de passe",
            c_password_label: "Confirmez le mot de passe",
            hello:"Salut",
            layout:{
                dashboard:"Tableau de bord",
                home:"Accueil",
                strategie:"cours stratégie",
                simulation: "Faire une simulation",
                results:"mes resultats",
                table: "Programme",
                report:"Faire une Requète",
                deadline: "Délais de Paiement",
                payement:" Paiement des Frais",
                compte:"Comptes de Paiement",
                user:"utilisateur",
                setting:"paramètre",
                logout:'Déconnecter',
                abonnement:"Abonnement",
                gererPay:"Gérer Payement",
                title:"Ajouter Un Abonnement",
                title_course:"Cours A Savoir",
                button_cours:"Type De Test",
                secret:"LE SECRET",





            },
            secret:{
            time:"Durée",
            heure:"Heure",
            conseil:"Conseils Et Astuces",
            section:{
                title1:"Task 1: Candidate Presentation (2 minutes)",
                content1:{
                    first1:"Prélude: Votre nom vous est demandé",
                    first2: "Présentation brève et globale de votre personne",
                    first3: "Civilité",
                    first4: "Origines",
                    first5: "Études",
                    first6: "Profession",
                    first7: "Hobbies",
                    first8: "Préférences alimentaires",
                    first9: "Projets",
                    first10: "Restez serein, très calme et posé",
                    first11:"Faites-vous entendre clairement par votre interlocuteur"
                },
                title2:"Tâche 2: Échange sous forme de dialogue (5 minutes)",
                content2:{ 
                    firt1:"2 minutes de préparation sur un brouillon",
                    firt2:"3 minutes d'échange",
                    firt3:"Posez des questions à l'examinateur (au moins 10)",
                    firt4:"Privilégiez les questions ouvertes",
                    firt5:"Adaptez-vous au contexte (tutoiement ou vouvoiement)",
                    firt6:"Rebondissez sur les réponses pour poser de nouvelles questions"
                },
                  title3:"Tâche 3: Argumentaire d'un point de vue (Temps non spécifié)",
                  content3:  {
                    firt1:"Défendez votre point de vue sur un thème donné",
                    firt2:"Thématiques possibles: actualités, éducation, sports, etc.",
                    firt3:"Utilisez plusieurs exemples pour étayer vos arguments",
                    firt4:"Maintenez un discours fluide",
                    firt5:"Employez un bon vocabulaire",
                    firt6:"Soignez votre style linguistique et le genre"
                }
  
            }


            },
            student_layout:{
                dashboard:"Tableau de bord",
                course_content:"Contenu du Cours",
                assignment:"Devoirs",
                assessment:"Évaluations",
                assessment_submission:"Soumission des évaluations",
            },
            landing:{
                cards:{
                    stat_card_classroom:"Nombre Total de Salles de Classe",
                    stat_card_course_content:"Total Contenu des cours",
                    stat_card_application:"Nombre Total de Demandes",
                    stat_card_assessments:"Nombre Total d'évaluations",
                },
                data_table:{
                    layout_title:"Tableau de bord",
                    title:"Demande des étudiant(e)s",
                    student_name:"Étudiant(e)",
                    class_name:"Titre du cours",
                    status:"Statut",
                    submitted_date:"Date de Soumission",
                },
            },
            classroom:{
                data_table:{
                    layout_title:"Salle de Classes",
                    title:"Vous avez: ",
                    title2:"Salle de Classe  ",
                    button:"Ajouter Une Salle",
                    class_name:"Nom",
                    class_url:"Lien de la Classe",
                    created_date:"Date de Création"
                }
            },
            course_content:{
                data_table:{
                    layout_title:"Contenu du Cours",
                    button:"Ajouter Un Contenu",
                    title:"Titre",
                    classroom:"Salle de Classe",
                    pdf_content:"Contenu Pdf",
                    video_content:"Contenu vidéo",
                    assignment_file:"Devoirs",
                    assignment_solution:"Solution aux Devoirs",
                    published_date:"Date de Publication",

                },
            },
            assessment:{
                data_table:{
                    layout_title:"Évaluations",
                    modal_btn:"Créer l'évaluation",
                    title:"Titre",
                    question_file:"Fichier de questions",
                    answer_pdf:"Pdf pour Solution",
                    publish_date:"Date de publication",
                    created_date:"Date de création",
                }
            },
            assessment_submission:{
                data_table:{
                    layout_title:"Soumission des évaluations",
                    title:"Titre",
                    student_name:"Étudiant(e)",
                    question_file:"Fichier de questions",
                    answer_pdf:"Pdf pour Solution",
                    submitted_date:"Date de soumission",
                    created_date:"Date de création",
                },

            },
            assignment:{
                data_table:{
                    layout_title:"Soumission des évaluations",
                    select_class:"choisir une classe",
                    select_course_content:"choisir le contenu des cours",
                    student_name:"Étudiant(e)",
                    solution:"Solution",
                    comment:"Commentaire",
                    submitted_date:"Date de soumission",
                }
            },
            pass_exams:{
                data_table:{
                    layout_title:"Épreuves précédentes",
                    button:"Ajouter un contenu",
                    title:"Titre",
                    class:"Cours",
                    question_file:"Fichier de questions",
                    answer_pdf:"Pdf pour Solution",
                    answer_video:"Vidéo pour Solution",
                    publish_date:"Date de publication",
                    created_date:"Date de création",
                }
            },
            create_live:{
                data_table:{
                    layout_title:"Séances en Direct",
                    heading:"Toutes les séances en direct",
                    button:"Creer Une séance",
                    meeting_code: "Identifiant de la séance",
                    class:"Classe",
                    participants: "#Participant(e)s",
                    status:"Statut",
                    session_date:"Date de séance",
                }
            }

        }
      },
    }
  });

export default i18n;