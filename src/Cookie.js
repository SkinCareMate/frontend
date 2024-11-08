import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name, value, options = {}) => {
    const defaultOptions = {
        path: '/',           // 모든 경로에서 쿠키에 접근 가능
        httpOnly: false,      // JavaScript를 통한 쿠키 접근 방지, 나중에 true로 변경해야 개발자도구에서 안보임
        secure: false,       // HTTP와 HTTPS 모두에서 쿠키 전송
        sameSite: 'lax',     // 일부 크로스 사이트 요청에서도 쿠키 전송 허용
        ...options
    };
    return cookies.set(name, value, defaultOptions);
};

export const getCookie = (name) => {
    const value = cookies.get(name);
    console.log(`쿠키 이름: ${name}, 쿠키 값: ${value}`); 
    return value ? decodeURIComponent(value) : null; // 디코딩 후 반환
};

export const removeCookie = (name, options = {}) => {
    const defaultOptions = {
        path: '/',
        ...options
    };
    return cookies.remove(name, defaultOptions);
};
