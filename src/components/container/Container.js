import styled from "styled-components";

export const MainContainer = styled.div`
  min-height: 100vh;
  margin: 0 auto;
  display: flex; /* Flexbox 사용 */
  flex-direction: column; /* 세로로 배열 */
  align-items: center;
`;

export const ContentContainer = styled.div`
  max-width: 1600px;
  width: 100%;
  margin-top: 100px;
  padding: 20px;
`;

export const CenterContainer = styled.div`
  margin: 0 auto;
`;

export const ResultContentContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 40px auto;
  padding: 30px;
  background-color: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;