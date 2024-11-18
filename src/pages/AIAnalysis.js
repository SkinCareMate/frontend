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

const ResultTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.5rem;
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
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 1rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FaceImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 600px;
  max-height: 600px;
  object-fit: contain;
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
  top: -90px;
  left: 50%;
  transform: translateX(-50%);
`;

const BottomTextContainer = styled(ResultTextContainer)`
  position: absolute;
  bottom: -70px;
  left: 50%;
  transform: translateX(-50%);
`;

const LeftTextContainer = styled(ResultTextContainer)`
  position: absolute;
  left: -250px;
  top: 50%;
  transform: translateY(-50%);
`;

const RightTextContainer = styled(ResultTextContainer)`
  position: absolute;
  right: -250px;
  top: 50%;
  transform: translateY(-50%);
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 15px;
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
                setAnalysisResult(res.data);
                setIsAnalyzing(false);
                setFaceImg(res.data.marked_image_url)
                console.log(faceImg);
                alert("피부 분석이 완료되었습니다!");
            }
        } catch (error) {
            setIsAnalyzing(false);
            setAnalysisResult(null);
            console.error("분석 중 에러 발생", error);
            window.alert("피부 분석에 실패했습니다.");
        }
    };

    const renderAnalysisResult = (result) => {
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

        return (
            <ResultSection>
                <ResultCategory>
                    <ResultContainer>
                        <FaceImage src={`http://localhost:8000${faceImg}`} alt="Face analysis" />
                        <TopTextContainer>
                            <ResultText>
                                이마 색소침착: {pigmentationMapping[foreheadPigmentation]}<br />
                                이마 수분: {moistureMapping[foreheadMoisture]}
                            </ResultText>
                        </TopTextContainer>
                        <BottomTextContainer>
                            <ResultText>
                                입술 수분: {moistureMapping[lipsDryness]}<br />
                                피부 타입: {skinTypeMapping[skinType]}
                            </ResultText>
                        </BottomTextContainer>
                        <LeftTextContainer>
                            <ResultText>
                                왼쪽 볼 수분: {moistureMapping[leftCheekMoisture]}<br />
                                왼쪽 볼 모공: {pigmentationMapping[leftCheekPore]}
                            </ResultText>
                        </LeftTextContainer>
                        <RightTextContainer>
                            <ResultText>
                                오른쪽 볼 수분: {moistureMapping[rightCheekMoisture]}<br />
                                오른쪽 볼 모공: {pigmentationMapping[rightCheekPore]}
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
                prediction_id: 2
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
            <ContentContainer style={{backgroundColor: '#00CEAF'}}>
                <DragDrop 
                    onFileChange={handleFileChange}
                    previewImage={previewImage}
                    isAnalyzing={isAnalyzing}
                    onUpload={handleUpload}
                    style={{borderColor: 'white', backgroundColor: '#00DBBC'}}
                />
            </ContentContainer>
            {analysisResult && (
                <ResultContentContainer>
                    <ResultTitle>진단 결과</ResultTitle>
                    {renderAnalysisResult(analysisResult)}
                    {!llmResult && (
                        <>
                            {isAuthenticated() ? (
                                !isGeneratingLLM ? (
                                    <LLMButton onClick={handleGenerateLLM}>
                                        AI 상세 진단 보기
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
        </MainContainer>
    );
}

export default AIAnalysis;