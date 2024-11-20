import axios from "axios";
import { ContentContainer, MainContainer, ResultContentContainer } from "../components/container/Container";
import NavigationBar from "../components/navbar/NavigationBar";
import { useState } from "react";
import DragDrop from "../components/container/DragDrop";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/Auth";
import { getCookie } from "../Cookie";
import ReactMarkdown from 'react-markdown';
import Footer from "../components/container/Footer";

const ResultTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 3rem;
  font-weight: bold;
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

const CategoryTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 2rem;
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

const LLMButton = styled.button`
  margin: 2rem auto;
  padding: 1rem 2rem;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  margin: 0;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007AFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AIContainer = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 15px;
  width: 100%;
`;

const AIContent = styled.div`
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

const SignupButton = styled(LLMButton)`
  background-color: #34C759;

  &:hover {
    background-color: #248A3D;
  }
`;

const ResetButton = styled(LLMButton)`
  background-color: #6c757d;
  margin-top: 3rem;

  &:hover {
    background-color: #495057;
  }
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
  height: 500px
`;

function AIAnalysis() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isGeneratingLLM, setIsGeneratingLLM] = useState(false);
    const [llmResult, setLlmResult] = useState(null);
    const [faceImg, setFaceImg] = useState(null);

    const handleFileChange = (selectedFiles) => {
        if (selectedFiles.length > 0) {
            setFiles(selectedFiles);
            setPreviewImage(URL.createObjectURL(selectedFiles[0].object));
        }
    };

    const handleUpload = async () => {
        if (!files.length) {
            window.alert('사진을 업로드해주세요');
            return;
        }

        const formData = new FormData();
        formData.append('image', files[0].object);

        try {
            setIsAnalyzing(true);
            setAnalysisResult(null);
            const res = await axios.post('/api/diagnostics/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.status === 200) {
                console.log("피부 분석 완료", res.data);
                
                // 1초 대기 후 결과 처리
                setTimeout(() => {
                    setAnalysisResult(res.data);
                    setFaceImg(res.data.marked_image_url);
                    console.log(faceImg);
                    alert("피부 분석이 완료되었습니다!");
                    setIsAnalyzing(false);
                }, 1000); // 1000ms = 1초
            }
        } catch (error) {
            setIsAnalyzing(false);
            setAnalysisResult(null);
            console.error("분석 중 에러 발생", error);
            window.alert("피부 분석에 실패했습니다.");
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

        return (
            <ResultSection>
                <ResultCategory>
                    <ResultContainer>
                        <ImageContainer>
                            <FaceImage src={`http://localhost:8000${faceImg}`} alt="Face analysis" />
                        </ImageContainer>
                        <TopTextContainer>
                            <ResultText>
                                <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px'}}>이마</p>
                                <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                  {pigmentationMapping[foreheadPigmentation]}<br />
                                  {moistureMapping[foreheadMoisture]}
                                </p>
                                
                            </ResultText>
                        </TopTextContainer>
                        <BottomTextContainer>
                            <ResultText>
                              <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px'}}>입술</p>
                              <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                {lipsDrynessMapping[lipsDryness]}<br />
                              </p>
                            </ResultText>
                        </BottomTextContainer>
                        <BottomTextContainer2>
                            <ResultText>
                              <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px'}}>피부 타입</p>
                              <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                {skinTypeMapping[skinType]}
                              </p>
                            </ResultText>
                        </BottomTextContainer2>
                        <LeftTextContainer>
                            <ResultText>
                              <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px'}}>왼쪽 볼</p>
                              <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                {moistureMapping[leftCheekMoisture]}<br />
                                {pigmentationMapping[leftCheekPore]}
                              </p>
                            </ResultText>
                        </LeftTextContainer>
                        <RightTextContainer>
                            <ResultText>
                              <p style={{fontSize: '2em', marginBottom: '20px', marginTop: '20px'}}>오른쪽 볼</p>
                              <p style={{marginTop: '0', fontSize: '1.5em'}}>
                                {moistureMapping[rightCheekMoisture]}<br />
                                {pigmentationMapping[rightCheekPore]}
                              </p>
                            </ResultText>
                        </RightTextContainer>
                    </ResultContainer>
                </ResultCategory>
            </ResultSection>
        );
    };

    const handleGenerateLLM = async () => {
        try {
            setIsGeneratingLLM(true);
            const response = await axios.post("/api/generate/", {
                prediction_id: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${getCookie("accessToken")}`
                }
            });
            
            setLlmResult(response.data);
            setIsGeneratingLLM(false);
            
        } catch (error) {
            console.error("LLM 생성 실패", error);
            window.alert("AI 상세 진단 생성에 실패했습니다.");
            setIsGeneratingLLM(false);
        }
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleReset = () => {
        window.location.reload();
    };

    return (
        <MainContainer>
            <NavigationBar />
            <div style={{backgroundColor: '#00CEAF', width: '100%', marginTop: '100px', padding: '20px'}}>
                <DragDrop 
                    onFileChange={handleFileChange}
                    previewImage={previewImage}
                    isAnalyzing={isAnalyzing}
                    onUpload={handleUpload}
                    style={{borderColor: 'white', backgroundColor: '#00DBBC'}}
                />
            </div>
            <div style={{backgroundColor: '#FFE544', width: '100%'}}>
              <ResultTitle>진단 결과</ResultTitle>
              {renderAnalysisResult(analysisResult)}      
            </div>
            {analysisResult && (
                <ResultContentContainer>
                    {!llmResult && (
                        <>
                            {isAuthenticated() ? (
                                !isGeneratingLLM ? (
                                    <LLMButton onClick={handleGenerateLLM}>
                                        AI 피부 솔루션 보기
                                    </LLMButton>
                                ) : (
                                    <LoadingContainer>
                                        <LoadingSpinner />
                                        <LoadingText>AI 상세 진단 생성 중...</LoadingText>
                                    </LoadingContainer>
                                )
                            ) : (
                                <SignupButton onClick={handleSignupClick}>
                                    회원가입하고 더 자세한 진단 결과 보기
                                </SignupButton>
                            )}
                        </>
                    )}
                    {llmResult && (
                        <AIContainer>
                            <AIHeader>
                                <AIIcon>AI</AIIcon>
                                <h3>AI 상세 진단</h3>
                            </AIHeader>
                            <AIContent>
                                <ReactMarkdown>
                                    {llmResult.diagnosis_text}
                                </ReactMarkdown>
                            </AIContent>
                        </AIContainer>
                    )}
                    <ResetButton onClick={handleReset}>
                        다른 사진 분석하기
                    </ResetButton>
                </ResultContentContainer>
            )}
            <ContentContainer />
            <Footer />
        </MainContainer>
    );
}

export default AIAnalysis;