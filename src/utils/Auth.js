import axios from 'axios';

export const login = async (email, password) => {
  try {
    const response = await axios.post('api/accounts/login', { id, password });
    const { token } = response.data;
    
    // 토큰을 로컬 스토리지에 저장 -> react-cookie로 변경
    localStorage.setItem('token', token);
    
    // axios의 기본 헤더에 토큰 설정 -> accessToken 설정
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  } catch (error) {
    console.error('로그인에 실패했습니다:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// 기타 인증 관련 함수들...