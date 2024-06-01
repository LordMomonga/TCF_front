import { iconsImgs } from "../utils/images";
import { personsImgs } from "../utils/images";
import { BiBus } from "react-icons/bi";
import { BiCar } from "react-icons/bi";
export const navigationLinks = [
    { id: 1, title: 'Home', image: iconsImgs.home, link: "/dash" },
    { id: 2, title: 'Profil', image: iconsImgs.budget },
    { id: 3 , title: 'Reports', image: iconsImgs.report },
    { id: 4, title: 'Abonnements', image: iconsImgs.wallet },
    { id: 5, title: 'conseil financier', image: iconsImgs.wealth },
    { id: 6, title: 'compte', image: iconsImgs.user },
];
export const AdminnavigationLinks = [
    { id: 1, title: 'Home', image: iconsImgs.home, link: "/dash" },
    { id: 2, title: 'Profil', image: iconsImgs.budget },
    { id: 3 , title: 'Assignements', image: iconsImgs.report },
    { id: 4 , title: 'nouveau utilisateur', image: iconsImgs.plus },

    { id: 4, title: 'Abonnements', image: iconsImgs.wallet },
    { id: 6, title: 'compte', image: iconsImgs.user },
];
export const test = [
    {id: 1, title: 'comprehension orale', color:'bg-orange-200', icone:'', link:'/comporale'},
    {id: 1, title: 'comprehension Ecrite', color: 'bg-red-500',link:'/compecrite'},
    {id: 1, title: 'Expression orale', color:'bg-blue-500', icone:'', link:'eorale'},
    {id: 1, title: 'Expression Ecrite', color: 'bg-pink-500', icone:'', link:''}

]
