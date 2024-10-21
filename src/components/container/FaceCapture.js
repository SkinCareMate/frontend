import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import styled from 'styled-components';

const CaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

const WebcamContainer = styled.div`
  position: relative;
  width: 640px;
  height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CircleOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border: 2px solid white;
  border-radius: 50%;
`;

const FaceCapture = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);

  const startCapture = () => {
    setIsStarted(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setIsCameraReady(true);
        })
        .catch((error) => {
          console.error("카메라 접근 오류:", error);
        });
    }
  };

  const checkFaceConditions = async () => {
    if (webcamRef.current && canvasRef.current) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detections.length > 0) {
        const face = detections[0];
        const isInCircle = checkFaceInCircle(face, canvas);
        const isFacingFront = checkFacingFront(face);
        const isLightingSufficient = checkLighting(video);

        if (isInCircle && isFacingFront && isLightingSufficient) {
          captureImage();
        }
      }

      requestAnimationFrame(checkFaceConditions);
    }
  };

  const checkFaceInCircle = (face, canvas) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    const faceX = face.detection.box.x + face.detection.box.width / 2;
    const faceY = face.detection.box.y + face.detection.box.height / 2;
    const distance = Math.sqrt((faceX - centerX) ** 2 + (faceY - centerY) ** 2);
    return distance < radius;
  };

  const checkFacingFront = (face) => {
    // 얼굴 랜드마크를 사용하여 정면 여부 확인
    // 간단한 구현을 위해 항상 true를 반환
    return true;
  };

  const checkLighting = (video) => {
    // 비디오 프레임의 밝기를 분석하여 조명 상태 확인
    // 간단한 구현을 위해 항상 true를 반환
    return true;
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      // 여기서 캡처된 이미지를 처리하거나 저장할 수 있습니다.
      console.log("이미지 캡처됨:", imageSrc);
    }
  };

  useEffect(() => {
    if (isCameraReady) {
      checkFaceConditions();
    }
  }, [isCameraReady]);

  return (
    <CaptureContainer>
      {!isStarted ? (
        <div>
          <h2>피부 분석 시작 준비 <br /> 사용 방법</h2>
          <ul>
            <li>안경을 벗고 앞머리가 이마를 <br /> 덮지 않는지 확인해주세요.</li>
            <li>조명이 밝은 환경에 있는지 확인해주세요.</li>
            <li>보다 정확한 결과를 얻으려면 화장을 <br /> 지워주세요.</li>
            <li>카메라를 정면으로 바라보고 얼굴을 <br /> 원 안에 위치시키세요.</li>
          </ul>
          <button onClick={startCapture}>시작하기</button>
        </div>
      ) : (
        <WebcamContainer>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          <CircleOverlay />
        </WebcamContainer>
      )}
    </CaptureContainer>
  );
};

export default FaceCapture;