import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { getCookie } from "../../Cookie";
import { useNavigate } from "react-router-dom";

const Title = styled.h1`
  text-align: center;
  margin: 2rem 0;
  font-size: 2rem;
  font-weight: bold;
`;

const SliderContainer = styled.div`
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
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

const ResultSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  margin-top: 2rem;
  padding: 50px 0;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
`;

const ResultCategory = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 300px;
  height: 400px;
  border: 1px solid #85EDDB;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.12s ease-in;
  background-color: #3DD7BD;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
`;

const FaceImage = styled.img`
  height: 400px;
  width: auto;
  object-fit: cover;
`;

const ResultText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #666; 
  text-align: center;
  width: 100%;
`;

const ResultTextContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
  background-color: #f8f9fa;
  width: 200px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TopTextContainer = styled(ResultTextContainer)`
  position: absolute;
  top: -140px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 130px;
`;

const BottomTextContainer = styled(ResultTextContainer)`
  position: absolute;
  bottom: -60px;
  left: 0;
  transform: translateX(-50%);
  width: 300px;
  height: 130px;
`;

const BottomTextContainer2 = styled(ResultTextContainer)`
  position: absolute;
  bottom: -60px;
  left: 100%;
  transform: translateX(-50%);
  width: 300px;
  height: 130px;
`;

const LeftTextContainer = styled(ResultTextContainer)`
  position: absolute;
  left: -300px;
  top: 40%;
  transform: translateY(-50%);
  width: 300px;
  height: 130px;
`;

const RightTextContainer = styled(ResultTextContainer)`
  position: absolute;
  right: -300px;
  top: 40%;
  transform: translateY(-50%);
  width: 300px;
  height: 130px;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 15px;
  height: 500px;
`;

const DiagnosisWrapper = styled.div`
  background-color: #F8F8F8;
  text-align: center;
  padding-top: 20px;
  margin-top: 80px;
  width: 100%;
`;

const AIContainer = styled.div`
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 15px;
  width: 100%;
  max-width: 1140px;
`;

const AIContent = styled.div`
  white-space: pre-line;
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
`;

const AIHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const AIIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #007AFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const DateText = styled.p`
  text-align: right;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

function ResultImgContainer() {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [faceImg, setFaceImg] = useState(null);
    const [diagnosisResults, setDiagnosisResults] = useState([]); // 진단 결과 저장
    const [selectedPredictionId, setSelectedPredictionId] = useState(null); // 선택된 prediction_id 저장
    const [selectedDiagnosisResult, setSelectedDiagnosisResult] = useState(null); // 선택된 진단 결과 저장
    const [aiDiagnosisResult, setAiDiagnosisResult] = useState(null); // AI 진단 결과 저장
    const [loading, setLoading] = useState(false); // 로딩 상태

    useEffect(() => {
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
        setSelectedPredictionId(prediction_id); // 선택된 prediction_id 저장
    };

    // 진단 결과를 최근 순서로 정렬
    const sortedDiagnosisResults = [...diagnosisResults].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextArrowContainer><img src="next.png" alt="Next" style={{ width: '50px', height: '50px', marginLeft: '600%' }} /></NextArrowContainer>,
        prevArrow: <PrevArrowContainer><img src="previous.png" alt="Previous" style={{ width: '50px', height: '50px', marginLeft: '-600%' }} /></PrevArrowContainer>,
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

    const handleButtonClick = async () => {
        try {
            setLoading(true); // 로딩 시작
            const response = await axios.get('/api/diagnostics/history/', {
                headers: {
                    Authorization: `Bearer ${getCookie('accessToken')}`
                }
            });
            const allResults = response.data; // 응답을 배열에 저장

            // 선택된 prediction_id에 맞는 진단 결과 필터링
            const selectedResult = allResults.find(result => result.id === selectedPredictionId);

            if (selectedResult) {
                // 선택된 진단 결과를 상태에 저장
                setSelectedDiagnosisResult(selectedResult); // 선택된 진단 결과 저장
                setFaceImg(selectedResult.marked_image_url); // 선택된 이미지 URL 저장
                console.log("선택된 진단 결과:", selectedResult);

                // AI 진단 결과 요청
                const aiResponse = await axios.post('/api/generate/', 
                    { prediction_id: selectedPredictionId }, // 요청 본문에 prediction_id 포함
                    {
                        headers: {
                            Authorization: `Bearer ${getCookie('accessToken')}` // 헤더에 토큰 추가
                        }
                    }
                );

                const aiResult = aiResponse.data; // AI 진단 결과 저장
                setAiDiagnosisResult(aiResult); // AI 진단 결과 상태에 저장
                console.log("AI 진단 결과:", aiResult);
            } else {
                window.alert("선택된 진단 결과가 없습니다.");
            }
        } catch (error) {
            console.error("AI 진단 결과 조회 실패", error);
            window.alert("AI 진단 결과를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    const renderAnalysisResult = (result) => {
        if (!result) {
            return null;
        }

        const foreheadPigmentation = result.forehead_pigmentation_prediction;
        const foreheadMoisture = result.forehead_moisture_prediction;
        const leftCheekMoisture = result.left_cheek_moisture_prediction;
        const leftCheekPore = result.left_cheek_pore_prediction;
        const rightCheekMoisture = result.right_cheek_moisture_prediction;
        const rightCheekPore = result.right_cheek_pore_prediction;
        const lipsDryness = result.lips_dryness_prediction;
        const skinType = result.skin_type_prediction;

        const pigmentationMapping = [
            "색소침착이 거의 없음",
            "색소침착의 정도가 보통",
            "색소침착의 정도가 심함"
        ];

        const moistureMapping = [
            "수분 부족",
            "수분 많음"
        ];

        const skinTypeMapping = [
            "건성",
            "중성",
            "지성"
        ];

        const lipsDrynessMapping = [
            "건조함",
            "건조함의 정도가 적당함",
            "촉촉함"
        ]

        const poreMapping = [
          "모공이 거의 보이지 않음",
          "모공이 약간 보임",
          "모공이 많이 보임"
        ]

        return (
            <ResultSection>
                <ResultCategory>
                    <ResultContainer>
                        <ImageContainer>
                            <FaceImage src={`http://localhost:8000${faceImg}`} alt="Face analysis" />
                        </ImageContainer>
                        <TopTextContainer>
                            <ResultText>
                                <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px', color: '#444444', fontWeight: 'bold'}}>이마</p>
                                <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                  {pigmentationMapping[foreheadPigmentation]}<br />
                                  {moistureMapping[foreheadMoisture]}
                                </p>
                                
                            </ResultText>
                        </TopTextContainer>
                        <BottomTextContainer>
                            <ResultText>
                              <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px', color: '#444444', fontWeight: 'bold'}}>입술</p>
                              <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                {lipsDrynessMapping[lipsDryness]}<br />
                              </p>
                            </ResultText>
                        </BottomTextContainer>
                        <BottomTextContainer2>
                            <ResultText>
                              <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px', color: '#444444', fontWeight: 'bold'}}>피부 타입</p>
                              <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                {skinTypeMapping[skinType]}
                              </p>
                            </ResultText>
                        </BottomTextContainer2>
                        <LeftTextContainer>
                            <ResultText>
                              <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px', color: '#444444', fontWeight: 'bold'}}>왼쪽 볼</p>
                              <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                {moistureMapping[leftCheekMoisture]}<br />
                                {poreMapping[leftCheekPore]}
                              </p>
                            </ResultText>
                        </LeftTextContainer>
                        <RightTextContainer>
                            <ResultText>
                              <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px', color: '#444444', fontWeight: 'bold'}}>오른쪽 볼</p>
                              <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                {moistureMapping[rightCheekMoisture]}<br />
                                {poreMapping[rightCheekPore]}
                              </p>
                            </ResultText>
                        </RightTextContainer>
                    </ResultContainer>
                </ResultCategory>
            </ResultSection>
        );
    };

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
        <DiagnosisWrapper>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{fontSize: '3em'}}>진단 결과 선택하기</h1>
                <SliderContainer>
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
                                            position: 'relative' // 자식 요소의 z-index를 위 relative 설정
                                        }}
                                    >
                                        <div>
                                            <img 
                                                src={`http://localhost:8000${result.marked_image_url}`}
                                                alt="진단 결과 이미지" 
                                                style={{ width: '300px', height: '400px', objectFit: 'cover', borderRadius: '8px', marginLeft: '25%', border: `4px solid ${selectedPredictionId === result.prediction_id ? 'yellow' : '#ccc'}` }} 
                                            />
                                            <div style={{ textAlign: 'center', marginTop: '0px', fontSize: '1.3em', color: 'white', fontWeight: 'bold', backgroundColor: 'grey', width: '300px', marginLeft: '25%', borderRadius: '8px' }}>
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
                    <button onClick={handleButtonClick} style={{ marginTop: '50px', marginBottom: '30px', width: '250px', height: '70px', fontSize: '1.5em', borderRadius: '10px', backgroundColor: '#00CEAF', color: 'white', cursor: 'pointer' }}>과거 진단결과 보기</button>
                </div>
            </div>
            {/* 과거 진단 결과 보기 버튼 클릭 시에만 결과 표시 */}
            {selectedDiagnosisResult && (
                <div style={{ marginTop: '50px', width: '100%', maxWidth: '3000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FFE544' }}>
                    <div style={{ width: '100%', minHeight: '500px', maxWidth: '800px', marginTop: '50px' }}>
                        {renderAnalysisResult(selectedDiagnosisResult)}
                    </div>
                </div>
            )}
            {/* 과거 진단 결과 보기 버튼 클릭 시에만 결과 표시 */}
            {aiDiagnosisResult && (
                <div style={{ marginTop: '50px', width: '100%', maxWidth: '3000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' }}>
                    <div style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', paddingTop: '20px', paddingBottom: '20px', width: '50%', margin: '0 auto', marginTop: '20px', paddingLeft: '200px', paddingRight: '200px', width: '1400px' }}>
                        <Title>AI 진단 결과</Title>
                        {loading ? (
                            <p style={{ textAlign: 'center' }}>진단 결과를 불러오는 중입니다...</p>
                        ) : aiDiagnosisResult ? (
                            <AIContainer>
                                <AIHeader>
                                    <AIIcon>AI</AIIcon>
                                    <h3>AI 상세 진단</h3>
                                </AIHeader>
                                <AIContent>
                                    {aiDiagnosisResult.diagnosis_text}
                                </AIContent>
                                <DateText>
                                    진단일시: {formatDate(aiDiagnosisResult.created_at)}
                                </DateText>
                            </AIContainer>
                        ) : (
                            <p style={{ textAlign: 'center' }}>진단 결과가 없습니다.</p>
                        )}
                    </div>
                </div>
            )}
        </DiagnosisWrapper>
    );
}

export default ResultImgContainer;