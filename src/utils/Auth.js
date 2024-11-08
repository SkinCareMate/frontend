import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../Cookie';

export const login = async (userData) => {
  try {
    const response = await axios.post('api/accounts/login/', 
      {
        id: userData.id,
        password: userData.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    
    console.log('서버 응답:', response);  // 디버깅을 위한 로그


    if (response.data.access && response.data.refresh) {
      // 쿠키에 accessToken, refreshToken 저장
      setCookie('accessToken', response.data.access);
      setCookie('refreshToken', response.data.refresh);
      setCookie('username', response.data.user.name);
      
      // axios의 기본 헤더에 accessToken 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      return response.data;
    } else {
      throw new Error('토큰이 없습니다.');
    }
  } catch (error) {
    console.error('로그인 에러:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// 나중에 로그아웃 api 생기면 그때 추가 아님 말고
export const logout = () => {
  removeCookie('accessToken');
  removeCookie('refreshToken');
  delete axios.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  return !!getCookie('accessToken');
};

// 기타 인증 관련 함수들...