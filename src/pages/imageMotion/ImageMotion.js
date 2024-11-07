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
        marginTop: '750vh'
    };

    const pTagsOpacity = getFadeOutOpacity(0.8, 1);

    return (
        <div ref={containerRef} style={{ height: '700vh' }}>
            <div style={whiteBackgroundStyle}></div>
            <div style={backgroundImageStyle}></div>
            <div style={centerStyle}>
                <div style={{ opacity: getFadeOutOpacity(0, 0.2) }}>
                    <h1 style={{ fontSize: '5em' }}>새로운 뷰티의<br/>발견</h1>
                    <p style={{ fontSize: '2em' }}>대한민국 1등 뷰티 앱 화해</p>
                </div>
            </div>
            <div style={centerStyle}>
                <div style={{ opacity: pTagsOpacity }}>
                    <p style={{ opacity: getOpacity(0.2, 0.4), fontSize: '2.5em' }}>
                        STEP 1.<br/>AI 피부진단을 위한 준비
                    </p>
                    <p style={{ opacity: getOpacity(0.4, 0.6), fontSize: '2.5em' }}>
                        STEP 2.<br/>사진을 업로드하거나 웹캠을 통한 사진 찍기
                    </p>
                    <p style={{ opacity: getOpacity(0.6, 0.8), fontSize: '2.5em' }}>
                        STEP 3.<br/>분석 결과를 통한 기초화장품 추천 받기
                    </p>
                </div>
            </div>
            <div style={additionalContentStyle}>
                <h2>STEP 0.<br />설문을 해주시면 더욱 자세한 진단결과와<br />기초화장품 추천을 받으실수 있어요!</h2>
            </div>
        </div>
    );
}

export default ImageMotion;