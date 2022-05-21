import { Outlet, Navigate} from "react-router-dom";
import {getCookie} from './util/CookieMan';


function PRoute(){
    const isAuth = getCookie('user') ?? false;
    return isAuth ? <Outlet/> : <Navigate to="/"/>
}

function RRoute(){
    const isAuth = getCookie('user') ?? false;
    return isAuth ? <Navigate to="/menu "/> : <Outlet/>
}



export {PRoute, RRoute} 