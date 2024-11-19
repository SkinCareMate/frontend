import React, { useState } from 'react';
import axios from 'axios';
import { ContentContainer, MainContainer } from '../components/container/Container';
import NavigationBar from '../components/navbar/NavigationBar';
import { getCookie } from '../Cookie';

const questions = [
    {
        question: "아토피를 겪고 있나요?",
        options: ['전혀 그렇지 않다.', '거의 그렇지 않다.', '보통이다.', '다소 그렇다.', '매우 그렇다.'] // 5점 척도
    },
    {
        question: "여드름의 정도는 어떤가요?",
        options: ['전혀 그렇지 않다.', '거의 그렇지 않다.', '보통이다.', '다소 그렇다.', '매우 그렇다.'] // 5점 척도
    },
    {
        question: "피부가 민감한 편인가요?",
        options: ['전혀 그렇지 않다.', '거의 그렇지 않다.', '보통이다.', '다소 그렇다.', '매우 그렇다.'] // 5점 척도
    }
];

function Survey() {
    const [responses, setResponses] = useState(Array(questions.length).fill(0)); // 응답 상태

    const handleResponseChange = (index, value) => {
        const newResponses = [...responses];
        newResponses[index] = value; // 응답 업데이트
        setResponses(newResponses);
    };

    const handleSubmit = async () => {
        // 응답을 비율로 변환
        const requestBody = {
            atopy_level: responses[0] / 5,  // 첫 번째 질문 응답 비율
            acne_level: responses[1] / 5,    // 두 번째 질문 응답 비율
            sensitivity_level: responses[2] / 5 // 세 번째 질문 응답 비율
        };

        try {
            const response = await axios.post(`/api/surveys/`, requestBody);
            console.log('설문 제출 성공:', response.data);
            // 추가적인 성공 처리 로직
        } catch (error) {
            console.error('설문 제출 실패:', error);
            // 에러 처리 로직
        }
    };

    return (
            <ContentContainer>
                <h2>설문에 참여해 주세요!</h2>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {questions.map((item, index) => (
                        <div key={index} style={{ margin: '1rem' }}>
                            <h3>{`Q${index + 1}: ${item.question}`}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {item.options.map((value, optionIndex) => (
                                    <div 
                                        key={value} 
                                        onClick={() => handleResponseChange(index, optionIndex + 1)} // 클릭 시 응답 업데이트 (1부터 시작)
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                            padding: '10px',
                                            margin: '5px 0',
                                            cursor: 'pointer',
                                            backgroundColor: responses[index] === (optionIndex + 1) ? '#e0f7fa' : 'transparent' // 선택된 응답 강조
                                        }}
                                    >
                                        {value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleSubmit}>제출하기</button>
            </ContentContainer>
    );
}

export default Survey;