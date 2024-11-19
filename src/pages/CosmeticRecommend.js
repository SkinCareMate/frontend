import React, { useState, useEffect } from "react";
import axios from "axios";
import { ContentContainer, MainContainer } from "../components/container/Container";
import NavigationBar from "../components/navbar/NavigationBar";
import { isAuthenticated } from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../Cookie";

function CosmeticRecommend() {
    const navigate = useNavigate();
    const [surveyData, setSurveyData] = useState(null);
    const [diagnosisResults, setDiagnosisResults] = useState([]); // 진단 결과 저장
    const [selectedPredictionId, setSelectedPredictionId] = useState(null); // 선택된 prediction_id 저장
    const [recommendedData, setRecommendedData] = useState([]); // 추천 데이터 저장
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 인덱스 상태

    useEffect(() => {
        // 로그인 되어있는지 확인
        if (!isAuthenticated()) {
            navigate("/");
            window.alert("로그인이 필요한 서비스입니다.");
            return; // 로그인하지 않은 경우 더 이상 진행하지 않음
        }

        const fetchSurveyData = async () => {
            const user_id = getCookie('userid');
            try {
                const response = await axios.get(`/api/surveys/${user_id}/`);
                if (!response.data) {
                    window.alert("설문을 먼저 완료해주세요.");
                } else {
                    setSurveyData(response.data); // 설문 데이터 저장
                }
            } catch (error) {
                window.alert("설문 데이터를 불러오지 못 했습니다.");
                navigate("/설문");
            }
        };

        fetchSurveyData();

        // 분석했던 진단 결과 및 사진 가져오기
        const fetchDiagnosisResults = async () => {
            let diagnosisResults = []; // 진단 결과를 저장할 배열

            try {
                const predictionResponse = await axios.get('/api/diagnostics/history/', {
                    headers: {
                        Authorization: `Bearer ${getCookie('accessToken')}`
                    }
                });
                diagnosisResults = predictionResponse.data.map(item => ({
                    prediction_id: item.id,
                    marked_image_url: item.marked_image_url,
                    created_at: item.created_at
                })); // 필요한 데이터만 저장
                console.log("결과보기 2: ", diagnosisResults);
                
                // 상태 업데이트
                setDiagnosisResults(diagnosisResults);
            } catch (error) {
                window.alert("진단 결과를 불러오지 못했습니다.");
                navigate("/");
                return; // 오류 발생 시 함수 종료
            }

            if (diagnosisResults.length === 0) {
                window.alert("진단 결과가 없습니다.");
                return; // id가 없을 경우 함수 종료
            }
        };

        fetchDiagnosisResults();
    }, [navigate]); // navigate를 의존성 배열에 추가

    const handleCardClick = (prediction_id) => {
        setSelectedPredictionId(prediction_id === selectedPredictionId ? null : prediction_id); // 선택 토글
    };

    const handleButtonClick = async () => {
        if (selectedPredictionId) {
            try {
                const response = await axios.post('/api/recommendations_data/', 
                    { prediction_id: selectedPredictionId }, // 요청 본문에 prediction_id 추가
                    {
                        headers: {
                            Authorization: `Bearer ${getCookie('accessToken')}` // Authorization 헤더 추가
                        }
                    }
                ); 
                console.log("API 응답: ", response.data);
                setRecommendedData(response.data.recommended_data); // 추천 데이터 저장
            } catch (error) {
                window.alert("API 요청에 실패했습니다.");
            }
        } else {
            window.alert("선택된 진단 결과가 없습니다.");
        }
    };

    // 진단 결과를 최근 순서로 정렬
    const sortedDiagnosisResults = [...diagnosisResults].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 카드 넘기기 함수
    const nextCards = () => {
        if (currentIndex + 3 < sortedDiagnosisResults.length) {
            setCurrentIndex(currentIndex + 3);
        }
    };

    const prevCards = () => {
        if (currentIndex - 3 >= 0) {
            setCurrentIndex(currentIndex - 3);
        }
    };

    return (
        <MainContainer>
            <NavigationBar />
            <ContentContainer>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <button onClick={prevCards} disabled={currentIndex === 0} style={{ marginRight: '10px' }}>이전</button>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {sortedDiagnosisResults.length === 0 ? (
                                <p>진단 결과를 불러오는 중입니다...</p>
                            ) : (
                                sortedDiagnosisResults.slice(currentIndex, currentIndex + 3).map((result) => (
                                    result.marked_image_url ? (
                                        <div 
                                            key={result.prediction_id} 
                                            onClick={() => handleCardClick(result.prediction_id)} // 카드 클릭 시 선택 처리
                                            style={{ 
                                                width: '400px', 
                                                height: '600px', 
                                                margin: '10px', 
                                                border: `2px solid ${selectedPredictionId === result.prediction_id ? 'yellow' : '#ccc'}`, // 선택된 경우 테두리 색상 변경
                                                borderRadius: '8px', // 모서리 둥글게
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // 그림자 추가
                                                overflow: 'hidden', // overflow를 hidden으로 설정
                                                cursor: 'pointer' // 커서 포인터로 변경
                                            }}
                                        >
                                            {console.log("결과 보기 1: ", result.marked_image_url)}
                                            <img 
                                                src={`http://localhost:8000${result.marked_image_url}`}
                                                alt="진단 결과 이미지" 
                                                style={{ 
                                                    width: '100%', 
                                                    height: '90%', 
                                                    objectFit: 'cover', 
                                                    borderTopLeftRadius: '8px', // 모서리 둥글게
                                                    borderTopRightRadius: '8px' // 모서리 둥글게
                                                }} 
                                            />
                                            <p style={{ margin: '10px', textAlign: 'center' }}>{new Date(result.created_at).toLocaleString()}</p> {/* 날짜 텍스트 중앙 정렬 */}
                                        </div>
                                    ) : null
                                ))
                            )}
                        </div>
                        <button onClick={nextCards} disabled={currentIndex + 3 >= sortedDiagnosisResults.length} style={{ marginLeft: '10px' }}>다음</button>
                    </div>
                </div>
                <button onClick={handleButtonClick} style={{ marginTop: '20px' }}>화장품 추천 받기</button> {/* API 요청 버튼 */}
                <h1 style={{textAlign: 'center'}}>화장품 추천 결과</h1>

                {/* 추천 결과 표시 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
                    {recommendedData.length > 0 ? (
                        recommendedData.slice(0, 20).map((item, index) => (
                            <div key={item.id} style={{ width: 'calc(25% - 10px)', margin: '5px', textAlign: 'center' }}>
                                <img 
                                    src={item.logo} 
                                    alt={item.title} 
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                                />
                                <p>{item.brand}</p>
                                <p>{item.title}</p>
                                <p>{item.price.toLocaleString()}원</p>
                            </div>
                        ))
                    ) : (
                        <p>추천 결과가 없습니다.</p>
                    )}
                </div>
            </ContentContainer>
        </MainContainer>
    );
}

export default CosmeticRecommend;
