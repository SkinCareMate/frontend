import React, { useState, useEffect, useRef } from "react";

const surveyQuestions = [
    {
        question: "클렌징 후에 아무것도 바르지 않은 상태에서 2~3시간 후에 얼굴이 어떠세요?",
        answers: [
            "버석버석하고 각질이 들뜨며 매우 거칠어요.",
            "피부가 당겨요.",
            "피부가 당기지도 않고 건조하거나 번들거리지도 않아요.",
            "피부가 번들거려요."
        ]
    },
    {
        question: "사진 속 당신의 피부는 번들거리나요?",
        answers: [
            "그렇지 않아요.",
            "때때로 그래요.",
            "자주 그래요.",
            "항상 그래요."
        ]
    },
    // 추가 질문을 여기에 추가할 수 있습니다.
];

const SurveySection = () => {
    const [selectedAnswers, setSelectedAnswers] = useState(Array(surveyQuestions.length).fill(null));

    const handleAnswerClick = (questionIndex, answerIndex) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[questionIndex] = answerIndex;
        setSelectedAnswers(newSelectedAnswers);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <h2 style={{ fontSize: '2em', margin: '1rem 0' }}>설문에 참여해 주세요!</h2>
            {surveyQuestions.map((item, index) => (
                <div key={index} style={{ margin: '2rem 0' }}>
                    <h3 style={{ fontSize: '1.5em', margin: '1rem 0' }}>{`Q${index + 1}. ${item.question}`}</h3>
                    {item.answers.map((answer, answerIndex) => (
                        <div key={answerIndex} 
                             onClick={() => handleAnswerClick(index, answerIndex)}
                             style={{
                                 width: '700px',
                                 border: '2px solid #333',
                                 borderRadius: '20px',
                                 padding: '10px',
                                 margin: '5px auto',
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 backgroundColor: selectedAnswers[index] === answerIndex ? '#e0f7fa' : 'transparent',
                                 cursor: 'pointer',
                                 fontSize: '1.3em'
                             }}>
                            <label style={{ cursor: 'pointer' }}>{answer}</label>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

function ImageMotion() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollPosition(position);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const getOpacity = (start, end) => {
        const containerHeight = containerRef.current?.clientHeight || 1;
        const scrollPercentage = scrollPosition / containerHeight;
        if (scrollPercentage < start) return 0;
        if (scrollPercentage > end) return 1;
        return (scrollPercentage - start) / (end - start);
    };

    const getFadeOutOpacity = (start, end) => {
        const containerHeight = containerRef.current?.clientHeight || 1;
        const scrollPercentage = scrollPosition / containerHeight;
        if (scrollPercentage < start) return 1;
        if (scrollPercentage > end) return 0;
        return 1 - (scrollPercentage - start) / (end - start);
    };

    const getScale = () => {
        const containerHeight = containerRef.current?.clientHeight || 1;
        const scrollPercentage = scrollPosition / containerHeight;
        return 1 + (0.5 * Math.min(scrollPercentage, 1));
    };

    const backgroundImageStyle = {
        background: `url(/mainimg.jpg) center center / cover no-repeat`,
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100vh',
        zIndex: -1,
        transform: `scale3d(${getScale()}, ${getScale()}, 1)`,
        opacity: getFadeOutOpacity(0.8, 1),
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out'
    };

    const whiteBackgroundStyle = {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100vh',
        zIndex: -2,
        backgroundColor: 'white'
    };

    const centerStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        color: 'white',
        textAlign: 'center',
        width: '100%'
    };

    const additionalContentStyle = {
        transform: 'translateY(0)',
        transition: 'transform 0.5s ease-out',
        textAlign: 'center',
        color: 'black',
        marginTop: '300vh',
        zIndex: 2,
        position: 'relative'
    };

    const pTagsOpacity = getFadeOutOpacity(0.8, 1);

    return (
        <div ref={containerRef} style={{ height: '175vh' }}>
            <div style={whiteBackgroundStyle}></div>
            <div style={backgroundImageStyle}></div>
            <div style={centerStyle}>
                <div style={{ opacity: getFadeOutOpacity(0, 0.2) }}>
                    <h1 style={{ fontSize: '5em' }}>피부 이야기, <br />나만의 뷰티여정</h1>
                    <p style={{ fontSize: '2em' }}>아름다움의 기록, 피부에서 시작됩니다.</p>
                </div>
            </div>
            <div style={centerStyle}>
                <div style={{ opacity: pTagsOpacity }}>
                    <p style={{ opacity: getOpacity(0.2, 0.4), fontSize: '2.5em' }}>
                        STEP 1.<br/>AI 피부진단을 위한 준비
                    </p>
                    <p style={{ opacity: getOpacity(0.4, 0.6), fontSize: '2.5em' }}>
                        STEP 2.<br/>ㅇㅇ
                    </p>
                    <p style={{ opacity: getOpacity(0.6, 0.8), fontSize: '2.5em' }}>
                        STEP 3.<br/>분석 결과를 통한 화장품 추천 받기
                    </p>
                </div>
            </div>
            <div style={additionalContentStyle}>
                <h2>STEP 0.<br />설문을 해주시면 더욱 자세한 진단결과와<br />기초화장품 추천을 받으실수 있어요!</h2>
                <SurveySection />
            </div>
        </div>
    );
}

export default ImageMotion;