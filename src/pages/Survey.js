import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ContentContainer } from '../components/container/Container';
import { getCookie } from '../Cookie';

const questions = [
    {
        question: "아토피를 겪고 있나요?",
        options: ['전혀 그렇지 않다.', '거의 그렇지 않다.', '보통이다.', '다소 그렇다.', '매우 그렇다.'] // 5점 찬닱
    },
    {
        question: "여드름의 정도는 어떤가요?",
        options: ['전혀 없는 편이다.', '거의 없는 편이다.', '보통이다.', '조금 있는 편이다.', '많이 있는 편이다.'] // 5점 찬닱
    },
    {
        question: "피부가 민감한 편인가요?",
        options: ['전혀 그렇지 않다.', '거의 그렇지 않다.', '보통이다.', '다소 그렇다.', '매우 그렇다.'] // 5점 찬닱
    }
];

function Survey() {
    const [responses, setResponses] = useState(Array(questions.length).fill(0)); // 응답 상태
    const [hasResponse, setHasResponse] = useState(false); // 응답 유무 확인
    const userId = getCookie('userid'); // userId 가져오기
    const accessToken = getCookie('accessToken'); // 토큰 가져오기

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(`/api/surveys/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (response.data) {
                    setResponses([response.data.atopy_level * 5, response.data.acne_level * 5, response.data.sensitivity_level * 5]);
                    setHasResponse(true);
                }
            } catch (error) {
                console.error('설문 조회 실패:', error);
            }
        };

        fetchSurvey();
    }, [userId, accessToken]);

    const handleResponseChange = (index, value) => {
        const newResponses = [...responses];
        newResponses[index] = value; // 응답 업데이트
        setResponses(newResponses);
    };

    const handleSubmit = async () => {
        // 응답을 비율로 변환
        const requestBody = {
            atopy_level: responses[0],  // 첫 번째 질문 응답 비율
            acne_level: responses[1],    // 둘 번째 질문 응답 비율
            sensitivity_level: responses[2]  // 세 번째 질문 응답 비율
        };

        try {
            const response = await axios.post(`/api/surveys/`, requestBody, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('설문 제출 성공:', response.data);
            setHasResponse(true);
        } catch (error) {
            console.error('설문 제출 실패:', error);
        }
    };

    const handleUpdate = async () => {
        // 응답을 비율로 변환
        const requestBody = {
            atopy_level: responses[0],  // 첫 번째 질문 응답 비율
            acne_level: responses[1],    // 둘 번째 질문 응답 비율
            sensitivity_level: responses[2] // 세 번째 질문 응답 비율
        };

        try {
            const response = await axios.patch(`/api/surveys/${userId}/`, requestBody, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('설문 수정 성공:', response.data);
        } catch (error) {
            console.error('설문 수정 실패:', error);
        }
    };

    return (
        <ContentContainer>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}> {/* 설문 영역 가운데 정렬 및 너비 설정 */}
                <h2>설문에 참여해 주세요!</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* 질문과 보기 가운데 정렬 */}
                    {questions.map((item, index) => (
                        <div key={index} style={{ margin: '1rem', textAlign: 'center', fontSize: '1.5em' }}> {/* 질문 가운데 정렬 */}
                            <h3>{`Q${index + 1}: ${item.question}`}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* 보기를 가운데 정렬 */}
                                {item.options.map((value, optionIndex) => (
                                    <div 
                                        key={value} 
                                        onClick={() => handleResponseChange(index, optionIndex + 1)} // 클릭 시 응답 업데이트 (1부터 시작)
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '25px', // 테두리 둥글게 설정
                                            padding: '10px',
                                            margin: '5px 0',
                                            cursor: 'pointer',
                                            backgroundColor: responses[index] === (optionIndex + 1) ? '#e0f7fa' : 'transparent', // 선택된 응답 강조
                                            width: '100%',
                                            maxWidth: '400px'
                                        }}
                                    >
                                        {value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    {hasResponse ? (
                        <button 
                            onClick={handleUpdate} 
                            style={{
                                fontSize: '1.5em',
                                fontWeight: 'bold',
                                backgroundColor: '#00CEAF',
                                color: '#fff',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            수정하기
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit} 
                            style={{
                                fontSize: '1.5em',
                                fontWeight: 'bold',
                                backgroundColor: '#00CEAF',
                                color: '#fff',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            제출하기
                        </button>
                    )}
                </div>
            </div>
        </ContentContainer>
    );
}

export default Survey;
