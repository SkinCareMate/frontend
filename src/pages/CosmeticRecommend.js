import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ContentContainer, MainContainer } from "../components/container/Container";
import NavigationBar from "../components/navbar/NavigationBar";
import { isAuthenticated } from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../Cookie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import Footer from "../components/container/Footer";

const SliderContainer = styled.div`
  .slick-prev:before,
  .slick-next:before {
    display: none;  
  }
`;

const ArrowContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  cursor: pointer;
`;

const PrevArrowContainer = styled(ArrowContainer)`
  left: 5%;
`;

const NextArrowContainer = styled(ArrowContainer)`
  right: 5%;
`;

function CosmeticRecommend() {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [surveyData, setSurveyData] = useState(null);
    const [diagnosisResults, setDiagnosisResults] = useState([]); // 진단 결과 저장
    const [selectedPredictionId, setSelectedPredictionId] = useState(null); // 선택된 prediction_id 저장
    const [recommendedData, setRecommendedData] = useState([]); // 추천 데이터 저장

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
                navigate("/mypage");
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
                            Authorization: `Bearer ${getCookie('accessToken')}` // Authorization 헤더
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

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextArrowContainer><img src="next.png" alt="Next" style={{ width: '50px', height: '50px', marginLeft: '300%' }} /></NextArrowContainer>,
        prevArrow: <PrevArrowContainer><img src="previous.png" alt="Previous" style={{ width: '50px', height: '50px', marginLeft: '-1100%' }} /></PrevArrowContainer>,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <MainContainer>
            <NavigationBar />
            <ContentContainer>
                <div style={{ backgroundColor: '#F8F8F8', textAlign: 'center', paddingTop: '20px', marginTop: '-50px' }}>
                    <h1 style={{fontSize: '3em'}}>진단 결과 선택하기</h1>
                    <SliderContainer style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Slider ref={sliderRef} {...sliderSettings} style={{ width: '90%', padding: '0 20px', marginLeft: '2.5%' }}>
                            {sortedDiagnosisResults.length === 0 ? (
                                <p>진단 결과를 불러오는 중입니다...</p>
                            ) : (
                                sortedDiagnosisResults.map((result) => (
                                    result.marked_image_url ? (
                                        <div 
                                            key={result.prediction_id} 
                                            onClick={() => handleCardClick(result.prediction_id)} // 카드 클릭 시 선택 처리
                                            style={{ 
                                                display: 'flex', // Flexbox 사용
                                                justifyContent: 'center', // 중앙 정렬
                                                alignItems: 'center', // 수직 중앙 정렬
                                                width: '300px', 
                                                height: '400px', 
                                                margin: '20px auto', // 수평 중앙 정렬
                                                border: `4px solid ${selectedPredictionId === result.prediction_id ? 'yellow' : ''}`, // 선택된 경우 테두리 색상 변경
                                                borderRadius: '8px', // 모서리 둥글게
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // 그림자 추가
                                                overflow: 'hidden', // overflow를 hidden으로 설정
                                                cursor: 'pointer', // 커서 포인터로 변경
                                                position: 'relative' // 자식 요소의 z-index를 위해 relative 설정
                                            }}
                                        >
                                            <div>
                                            <img 
                                                src={`http://localhost:8000${result.marked_image_url}`}
                                                alt="진단 결과 이미지" 
                                                style={{ width: '300px', height: '400px', objectFit: 'cover', borderRadius: '8px', marginLeft: '12%', border: `4px solid ${selectedPredictionId === result.prediction_id ? 'yellow' : '#ccc'}` }} 
                                            />
                                            <div style={{ textAlign: 'center', marginTop: '0px', fontSize: '1.3em', color: 'white', fontWeight: 'bold', backgroundColor: 'grey', width: '300px', marginLeft: '12%', borderRadius: '8px' }}>
                                                {new Date(result.created_at).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            </div>
                                            
                                        </div>
                                    ) : null
                                ))
                            )}
                        </Slider>
                    </SliderContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button onClick={handleButtonClick} style={{ marginTop: '50px', marginBottom: '30px', width: '200px', height: '50px', fontSize: '1.5em', borderRadius: '10px', backgroundColor: '#00CEAF', color: 'white', cursor: 'pointer' }}>화장품 추천 받기</button> {/* API 요청 버튼 */}
                    </div>
                </div>
                <div style={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', paddingTop: '20px', borderRadius: '20px'}}>
                    <h1 style={{textAlign: 'center', marginTop: '50px', fontSize: '3em'}}>화장품 추천 결과</h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
                    {recommendedData.length > 0 ? (
                        recommendedData.slice(0, 20).map((item, index) => (
                            <div 
                                key={item.id} 
                                style={{ 
                                    position: 'relative', // 부모 요소를 relative로 설정
                                    width: 'calc(25% - 10px)', 
                                    margin: '5px', 
                                    textAlign: 'center', 
                                    marginBottom: '50px', 
                                    borderRadius: '8px', // 모서리 둥글게
                                    overflow: 'hidden' // 내용이 카드 밖으로 나가지 않도록 설정
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute', // 위치 설정을 위해 absolute 사용
                                        top: '10px',
                                        left: '10px',
                                        width: '70px',
                                        height: '70px',
                                        backgroundColor: 'white',
                                        color: '#00CEAF',
                                        borderRadius: '50%',
                                        border: '2px solid #00CEAF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '1.2em'
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <img 
                                    src={item.logo} 
                                    alt={item.title} 
                                    style={{ 
                                        width: '190px', 
                                        height: '190px', 
                                        borderRadius: '8px' 
                                    }} 
                                />
                                <p style={{color: 'grey', fontWeight: 'bold', fontSize: '1.1em'}}>{item.brand}</p>
                                <p style={{fontSize: '1.3em'}}>{item.title}</p>
                                <p style={{color: '#00CEAF', fontWeight: 'bold', fontSize: '1.5em'}}>{item.price.toLocaleString()}원</p>
                            </div>
                        ))
                    ) : (
                        <p style={{textAlign: 'center', margin: '0 auto', marginBottom: '30px', fontSize: '1.5em'}}>먼저 진단 기록을 선택해주세요.</p>
                    )}
                    </div>
                </div>
            </ContentContainer>
            {}
            <Footer />
        </MainContainer>
    );
}

export default CosmeticRecommend;
