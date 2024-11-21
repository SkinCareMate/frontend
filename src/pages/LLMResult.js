import axios from "axios";
import { ContentContainer, MainContainer, ResultContentContainer } from "../components/container/Container";
import NavigationBar from "../components/navbar/NavigationBar";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ResultImgContainer from "../components/container/ResultImgContainer";
import Footer from "../components/container/Footer";

// const Title = styled.h1`
//   text-align: center;
//   margin: 2rem 0;
//   font-size: 2rem;
//   font-weight: bold;
// `;

// const AIContainer = styled.div`
//   margin: 2rem auto;
//   padding: 2rem;
//   background-color: #f8f9fa;
//   border-radius: 15px;
//   width: 100%;
//   max-width: 1140px;
// `;

// const AIContent = styled.div`
//   white-space: pre-line;
//   line-height: 1.8;
//   font-size: 1.1rem;
//   color: #333;
// `;

// const AIHeader = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 1.5rem;
//   gap: 1rem;
// `;

// const AIIcon = styled.div`
//   width: 40px;
//   height: 40px;
//   background-color: #007AFF;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
//   font-weight: bold;
// `;

// const DateText = styled.p`
//   text-align: right;
//   color: #666;
//   font-size: 0.9rem;
//   margin-top: 1rem;
// `;

function LLMResult() {
    const navigate = useNavigate();
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/");
            window.alert("로그인이 필요한 서비스입니다.");
            return;
        }

        // const fetchDiagnosisResult = async () => {
        //     try {
        //         const response = await axios.post("/api/generate/", {
        //             prediction_id: 17
        //         });
        //         setDiagnosisResult(response.data);
        //         setLoading(false);
        //     } catch (error) {
        //         console.error("진단 결과 조회 실패", error);
        //         window.alert("진단 결과를 불러오는데 실패했습니다.");
        //         setLoading(false);
        //     }
        // };

        // fetchDiagnosisResult();
    }, [navigate]);
    
const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    

    return (
        <MainContainer>
            <NavigationBar />
            <ResultImgContainer />
            {/* <ContentContainer>
                <div style={{borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', paddingTop: '50px', paddingBottom: '50px', width: '80%', margin: '0 auto' }}>
                    <Title>AI 진단 결과</Title>
                    {loading ? (
                        <p style={{ textAlign: 'center' }}>진단 결과를 불러오는 중입니다...</p>
                    ) : diagnosisResult ? (
                        <AIContainer>
                            <AIHeader>
                                <AIIcon>AI</AIIcon>
                                <h3>AI 상세 진단</h3>
                            </AIHeader>
                            <AIContent>
                                {diagnosisResult.diagnosis_text}
                            </AIContent>
                            <DateText>
                                진단일시: {formatDate(diagnosisResult.created_at)}
                            </DateText>
                        </AIContainer>
                    ) : (
                        <p style={{ textAlign: 'center' }}>진단 결과가 없습니다.</p>
                    )}
                </div>
                
            </ContentContainer> */}
            <ContentContainer />
            <Footer />
        </MainContainer>
    );
}

export default LLMResult;