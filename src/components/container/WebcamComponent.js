import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import * as faceapi from 'face-api.js';

const WebcamContainer = styled.div`
  width: 500px;
  height: 600px;  // 전체 높이를 늘려 Instructions와 WebcamWrapper를 수용
  border: 2px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;  // 상단 정렬로 변경
  position: relative;
  padding: 20px;  // 내부 여백 추가
`;

const Instructions = styled.div`
  text-align: left;
  margin-bottom: 20px;
  width: 100%;  // 너비를 100%로 설정
`;

const StartButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;  // 버튼 아래 여백 추가
`;

const WebcamWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;  // WebcamContainer의 높이에 맞춤
`;

const CircleOverlay = styled.div`
  position: absolute;
  top: 55%;  // 원의 위치를 약간 아래로 조정
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border: 2px solid #fff;
  border-radius: 50%;
  pointer-events: none;
`;

const CaptureButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  background-color: ${props => props.disabled ? 'gray' : 'green'};
  color: white;
  border: none;
  border-radius: 5px;
`;

const WebcamComponent = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isLightingGood, setIsLightingGood] = useState(false);
  const [isFacingCamera, setIsFacingCamera] = useState(false);
  const [isFaceInCircle, setIsFaceInCircle] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const resetWebcam = useCallback(() => {
    setIsStarted(false);
    // 다른 상태들도 초기화
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        console.log('Models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };
    loadModels();
  }, []);

  const checkLighting = (imageData) => {
    const brightness = imageData.data.reduce((sum, value, index) => {
      return (index + 1) % 4 === 0 ? sum : sum + value;
    }, 0) / (imageData.width * imageData.height * 3);
    setIsLightingGood(brightness > 100); // 임계값 조정 가능
  };

  const checkFacingCamera = (landmarks) => {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const eyeSlope = Math.abs((leftEye[0].y - rightEye[3].y) / (leftEye[0].x - rightEye[3].x));
    setIsFacingCamera(eyeSlope < 0.1); // 임계값 조정 가능
  };

  const checkFaceInCircle = (detection, circleCenter, circleRadius) => {
    const faceCenter = {
      x: detection.box.x + detection.box.width / 2,
      y: detection.box.y + detection.box.height / 2,
    };
    const distance = Math.sqrt(
      Math.pow(faceCenter.x - circleCenter.x, 2) + Math.pow(faceCenter.y - circleCenter.y, 2)
    );
    setIsFaceInCircle(distance < circleRadius);
  };

  const analyzeFrame = useCallback(async () => {
    try {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

        if (detections) {
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          checkFacingCamera(resizedDetections.landmarks);
          checkFaceInCircle(resizedDetections, { x: canvas.width / 2, y: canvas.height / 2 }, 150);
        }

        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        checkLighting(imageData);
      }
    } catch (error) {
      console.error('Error analyzing frame:', error);
      // 필요하다면 상태를 리셋하거나 사용자에게 알림
    }
  }, [webcamRef, canvasRef]); // 의존성 추가

  useEffect(() => {
    if (isStarted) {
      const interval = setInterval(analyzeFrame, 100);
      return () => {
        clearInterval(interval);
        // 웹캠 스트림 정지
        if (webcamRef.current && webcamRef.current.video) {
          const stream = webcamRef.current.video.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [isStarted, analyzeFrame]);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    // 여기에서 캡처된 이미지를 서버로 전송하거나 다른 처리를 할 수 있습니다.
  }, [webcamRef]);

  const isReadyToCapture = isLightingGood && isFacingCamera && isFaceInCircle;

  const handleStart = useCallback(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setIsStarted(true);
          console.log('Camera access granted');
        })
        .catch((err) => {
          console.error("카메라 접근 권한이 거부되었습니다:", err);
          alert("카메라 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.");
        });
    } else {
      console.error("getUserMedia is not supported");
      alert("이 브라우저는 웹캠 기능을 지원하지 않습니다.");
    }
  }, []);

  const videoConstraints = {
    width: 500,
    height: 560,  // WebcamContainer의 높이에서 패딩을 뺀 값
    facingMode: "user"
  };

  return (
    <WebcamContainer>
      {!isStarted ? (
        <>
          <Instructions>
            <h3>피부 분석 시작 준비 사용 방법</h3>
            <ul>
              <li>안경을 벗고 앞머리가 이마를 덮지 않는지 확인해주세요.</li>
              <li>조명이 밝은 환경에 있는지 확인해주세요.</li>
              <li>보다 정확한 결과를 얻으려면 화장을 지워주세요.</li>
              <li>카메라를 정면으로 바라보고 얼굴을 원 안에 위치시키세요.</li>
            </ul>
          </Instructions>
          <StartButton onClick={handleStart}>시작하기</StartButton>
        </>
      ) : (
        <WebcamWrapper>
          <Webcam
            audio={false}
            height={560}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={460}
            videoConstraints={videoConstraints}
          />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
          <CircleOverlay />
          <div>
            <p>조명: {isLightingGood ? '충분' : '부족'}</p>
            <p>카메라 응시: {isFacingCamera ? '정면' : '비정면'}</p>
            <p>얼굴 위치: {isFaceInCircle ? '원 안' : '원 밖'}</p>
          </div>
          <CaptureButton onClick={handleCapture} disabled={!isReadyToCapture}>
            {isReadyToCapture ? '캡처하기' : '준비 중...'}
          </CaptureButton>
          {capturedImage && (
            <div>
              <h3>캡처된 이미지:</h3>
              <img src={capturedImage} alt="Captured" />
            </div>
          )}
        </WebcamWrapper>
      )}
    </WebcamContainer>
  );
};

export default WebcamComponent;