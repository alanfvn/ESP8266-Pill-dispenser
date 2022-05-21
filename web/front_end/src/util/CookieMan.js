import Cookies from 'universal-cookie';
const cookies = new Cookies();

function getCookie(name){
    return cookies.get(name);
}

function setCookie(name, value){
    cookies.set(name, value, {
        path: "/",
    });
}

function cleanCookies(){
    const remove = ['user'];
    remove.map(x => cookies.remove(x, {path: "/"}));
}



export {setCookie, getCookie, cleanCookies}
