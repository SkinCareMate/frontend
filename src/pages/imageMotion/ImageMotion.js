import React, { useState, useEffect, useRef } from "react";

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
        background: `url(https://hwahae-homepage.s3.ap-northeast-2.amazonaws.com/images/main_2023-09-11-09-34.jpg) center center / cover no-repeat`,
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
        marginTop: '750vh'
    };

    const pTagsOpacity = getFadeOutOpacity(0.8, 1);

    return (
        <div ref={containerRef} style={{ height: '700vh' }}>
            <div style={whiteBackgroundStyle}></div>
            <div style={backgroundImageStyle}></div>
            <div style={centerStyle}>
                <div style={{ opacity: getFadeOutOpacity(0, 0.2) }}>
                    <h1>새로운 뷰티의<br/>발견</h1>
                    <p>대한민국 1등 뷰티 앱 화해</p>
                </div>
            </div>
            <div style={centerStyle}>
                <div style={{ opacity: pTagsOpacity }}>
                    <p style={{ opacity: getOpacity(0.2, 0.4) }}>
                        스킨케어부터 메이크업<br/>그리고 이너뷰티까지
                    </p>
                    <p style={{ opacity: getOpacity(0.4, 0.6) }}>
                        나만의 뷰티를 찾을 수 있도록<br/>화해가 길잡이가 되어 줄게요.
                    </p>
                    <p style={{ opacity: getOpacity(0.6, 0.8) }}>
                        언제, 어디서나 쉽고 즐겁게<br/>탐색하고 발견해 보세요!
                    </p>
                </div>
            </div>
            <div style={additionalContentStyle}>
                <h2>step 넣어서 단계별 구현하고<br />마지막에는 진단 페이지로 넘어갈 수 있는 버튼 넣어주기</h2>
            </div>
        </div>
    );
}

export default ImageMotion;