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
                    // navigate("/설문");
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
            let predictionIds = []; // predictionIds를 상위 스코프에 정의

            try {
                const predictionResponse = await axios.get('/api/diagnostics/history/');
                predictionIds = predictionResponse.data.map(item => item.id); // id만 모아서 배열에 저장
                console.log(predictionIds);
            } catch (error) {
                window.alert("진단 결과를 불러오지 못했습니다.");
                navigate("/");
                return; // 오류 발생 시 함수 종료
            }

            if (predictionIds.length === 0) {
                window.alert("진단 결과가 없습니다.");
                return; // id가 없을 경우 함수 종료
            }

            // prediction_id를 내림차순으로 정렬하여 요청
            for (const id of predictionIds.sort((a, b) => b - a)) {
                try {
                    const resultResponse = await axios.post('/api/generate/', {
                        prediction_id: id // 각 prediction_id로 요청
                    });
                    setDiagnosisResults(prevResults => [...prevResults, resultResponse.data]); // 결과 저장
                } catch (error) {
                    window.alert("진단 결과를 불러오지 못했습니다.");
                    navigate("/"); // 이럴 일은 별로 없지만 혹시나
                }
            }
        };

        fetchDiagnosisResults();
    }, [navigate]); // navigate를 의존성 배열에 추가

    return (
        <MainContainer>
            <NavigationBar />
            <ContentContainer>
                여기에 LMS의 카드 형식으로 넣어주기 토글 형식으로 더보기 넣어주고 최근꺼부터 보여주기

                <div>
                    {diagnosisResults.length > 0 ? (
                        diagnosisResults.map((result) => (
                            <div key={result.prediction}>
                                <p>{result.diagnosis_text}</p>
                                <p>{new Date(result.created_at).toLocaleString()}</p> {/* 생성 날짜 표시 */}
                            </div>
                        ))
                    ) : (
                        <p>진단 결과가 없습니다.</p>
                    )}
                </div>
            </ContentContainer>
        </MainContainer>
    );
}

export default CosmeticRecommend;