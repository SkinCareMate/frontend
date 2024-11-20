import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from 'styled-components';

// 애니메이션 정의
const slideUp = keyframes`
    0% {
        transform: translateY(40px); /* 아래에서 시작 */
        opacity: 0; /* 처음에는 보이지 않음 */
    }
    100% {
        transform: translateY(0); /* 원래 위치로 이동 */
        opacity: 1; /* 완전히 보이도록 */
    }
`;

const Step = styled.div`
  background-color: ${props => props.bgColor};
  width: 100%;
  height: 800px;
  font-size: 3em;
  padding-top: 100px;

`;

const AnimatedContent = styled.div`
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.1s ease-out;
  animation: ${props => props.isVisible ? slideUp : 'none'} 5s ease-out;$1opacity: ${props => props.isVisible ? 1 : 0}; animation: ${props => props.isVisible ? slideUp : 'none'} 1s ease-out;
  opacity: ${props => props.isVisible ? 1 : 0};
  animation: ${props => props.isVisible ? slideUp : 'none'} 5s ease-out;$1opacity: 0;$2animation: ${props => props.isVisible ? slideUp : 'none'} 1s ease-out forwards;
  animation-delay: ${props => props.isVisible ? '0s' : '0s'};
  transition: opacity 1s ease-out;
`;

// 스캔 라인 애니메이션 정의
const scanLineAnimation = keyframes`
    0% {
        transform: translateY(0); /* 시작 위치: 이미지 위쪽 */
    }
    50% {
        transform: translateY(6000%); /* 끝 위치: 이미지 아래쪽 */
    }
`;

const ScanLine = styled.div`
    position: absolute;
    top: 0; /* 이미지의 위쪽에 위치 */
    left: 0;
    right: 0;
    height: 5px; /* 스캔 라인의 높이 */
    background-color: yellow; /* 스캔 라인의 색상 */
    animation: ${scanLineAnimation} 5s ease-in-out infinite; /* 애니메이션 설정: 이미지 아래까지 내려갔다가 다시 올라옴 */
`;

function ImageMotion() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isFixed, setIsFixed] = useState(false);
    const [step1Visible, setStep1Visible] = useState(false);
    const [step2Visible, setStep2Visible] = useState(false);
    const [step3Visible, setStep3Visible] = useState(false);
    const containerRef = useRef(null);
    const navRef = useRef(null);
    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollPosition(position);

            // 네비게이션 바가 화면 상단에 도달했는지 확인
            if (navRef.current) {
                const navTopPosition = navRef.current.getBoundingClientRect().top;
                if (navTopPosition <= 0) {
                    setIsFixed(true);
                } else {
                    setIsFixed(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === step1Ref.current) {
                        setStep1Visible(true);
                    } else if (entry.target === step2Ref.current) {
                        setStep2Visible(true);
                    } else if (entry.target === step3Ref.current) {
                        setStep3Visible(true);
                    }
                } else {
                    if (entry.target === step1Ref.current) {
                        setStep1Visible(false);
                    } else if (entry.target === step2Ref.current) {
                        setStep2Visible(false);
                    } else if (entry.target === step3Ref.current) {
                        setStep3Visible(false);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, options);

        if (step1Ref.current) observer.observe(step1Ref.current);
        if (step2Ref.current) observer.observe(step2Ref.current);
        if (step3Ref.current) observer.observe(step3Ref.current);

        return () => {
            if (step1Ref.current) observer.unobserve(step1Ref.current);
            if (step2Ref.current) observer.unobserve(step2Ref.current);
            if (step3Ref.current) observer.unobserve(step3Ref.current);
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
        width: '100%',
        transform: 'translateY(0)',
        transition: 'transform 0.5s ease-out',
        textAlign: 'center',
        color: 'black',
        marginTop: '250vh',
        zIndex: 2,
        position: 'relative',
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
                        STEP 1.<br/>피부 진단 준비하기
                    </p>
                    <p style={{ opacity: getOpacity(0.4, 0.6), fontSize: '2.5em' }}>
                        STEP 2.<br/>AI를 통한 맞춤형 피부 관리법 확인하기
                    </p>
                    <p style={{ opacity: getOpacity(0.6, 0.8), fontSize: '2.5em' }}>
                        STEP 3.<br/>나만을 위한 화장품 추천받기
                    </p>
                </div>
            </div>
            <div style={additionalContentStyle}>
                <Step ref={step1Ref} isVisible={step1Visible} bgColor="#FFFFFF">
                    <AnimatedContent isVisible={step1Visible}>
                        Step 1. 피부 진단 준비하기<br /><br />
                        <p style={{fontSize: '0.75em', marginTop: '-20px'}}>올바른 사진을 준비해주세요.</p>
                    </AnimatedContent>
                    <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '300px', fontSize: '0.5em', paddingTop: '150px' }}>
                        <AnimatedContent isVisible={step1Visible}>
                            <div style={{ textAlign: 'left', marginRight: '20px' }}>
                                정면을 바라보는 사진이 필요해요.<br/><br/>안경은 벗고, 이마가 드러나도록 해주세요.<br/><br/>메이크업 없이 촬영해 주세요.
                            </div>
                        </AnimatedContent>
                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '100px' }}>
                            <AnimatedContent isVisible={step1Visible}>
                                <img 
                                    src="step1-1.png" 
                                    alt="Image 1" 
                                    style={{ 
                                        width: '150px', 
                                        height: 'auto', 
                                        marginLeft: '70px', 
                                        borderRadius: '10px', // 모서리 둥글게
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // 그림자 추가
                                    }} 
                                />
                            </AnimatedContent>
                            <AnimatedContent isVisible={step1Visible}>
                                <img 
                                    src="step1-2.png" 
                                    alt="Image 2" 
                                    style={{ 
                                        width: '150px', 
                                        height: 'auto', 
                                        marginLeft: '30px', 
                                        borderRadius: '10px', // 모서리 둥글게
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // 그림자 추가
                                    }} 
                                />
                            </AnimatedContent>
                            <AnimatedContent isVisible={step1Visible}>
                                <img 
                                    src="step1-3.png" 
                                    alt="Image 3" 
                                    style={{ 
                                        width: '150px', 
                                        height: 'auto', 
                                        marginLeft: '30px', 
                                        borderRadius: '10px', // 모서리 둥글게
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // 그림자 추가
                                    }} 
                                />
                            </AnimatedContent>
                        </div>
                    </div>
                </Step>
                <Step ref={step2Ref} isVisible={step2Visible} bgColor="#D0FFF9" style={{width: '100%'}}>
                    <AnimatedContent isVisible={step2Visible}>
                        Step 2. AI를 통한 맞춤형 피부 관리법 확인하기<br /><br />
                        <p style={{fontSize: '0.75em', marginTop: '-20px'}}>내 피부에 맞는 관리법을 알아보세요!</p>
                    </AnimatedContent>
                    <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '100px' }}>
                        <AnimatedContent isVisible={step2Visible} style={{ display: 'flex', paddingRight: '200px', fontSize: '0.5em', textAlign: 'right', position: 'relative' }}>
                            <div style={{ position: 'relative', overflow: 'hidden', width: '300px', height: '300px', marginLeft: '300px', marginRight: '250px' }}>
                                <img 
                                    src="mainfaceimg.jpeg" 
                                    style={{ 
                                        width: '300px', 
                                        height: '300px', 
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                                        borderRadius: '10px', 
                                        filter: 'brightness(0.7)' // 이미지 어둡게 처리
                                    }} 
                                />
                                <ScanLine />
                            </div>
                            <br/><br/>피부 진단을 마치신 후,<br/><br/>아래 AI 피부 솔루션 보기 버튼을 클릭하면<br/><br/>결과를 확인할 수 있습니다.
                        </AnimatedContent>
                    </div>
                </Step>
                <Step ref={step3Ref} isVisible={step3Visible} bgColor="#FFE544" style={{width: '100%'}}>
                    <AnimatedContent isVisible={step3Visible}>
                        Step 3. 나만을 위한 화장품 추천받기<br /><br />
                        <p style={{fontSize: '0.75em', marginTop: '-20px'}}>피부에 꼭 맞는 기초 화장품을 추천해드립니다!</p>
                    </AnimatedContent>
                    <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '100px' }}>
                        <AnimatedContent isVisible={step3Visible} style={{  display: 'flex', paddingRight: '200px', fontSize: '0.5em', textAlign: 'right' }}>
                            <img src="https://i.pinimg.com/736x/71/51/d1/7151d131849e9cacb46faff661f5f351.jpg" style={{ width: '300px', height: '300px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px', marginLeft: '300px', marginRight: '250px' }}></img>
                            <br/><br/>먼저 마이페이지에서 설문에 참여해주세요.<br/><br/>진단 기록을 클릭하면, <br/><br/>해당 진단에 맞는 화장품을 추천받으실 수 있습니다.
                        </AnimatedContent>
                    </div>
                </Step>
            </div>
        </div>
    );
}

export default ImageMotion;
