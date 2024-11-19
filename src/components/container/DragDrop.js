import React, { useCallback, useRef, useState, useEffect } from "react";
import styled from "styled-components";

const Title = styled.h1`
  margin: 2rem 0;
  font-size: 3rem;
  font-weight: bold;
  color: white;
  position: absolute;
  left: 10%;
  top: 25%;
  text-align: center;
`;

const DragDropContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  padding: 2rem;
`;

const GuideText = styled.div`
  font-size: 1.5rem;
  line-height: 1.6;
  position: absolute;
  left: 10%;
  top: 60%;
  transform: translateY(-50%);
  color: white;
  text-align: center;
`;

const UploadSection = styled.div`
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10%;
`;

const FileLabel = styled.label`
  width: 300px;
  height: 400px;
  border: 1px solid #85EDDB;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.12s ease-in;
  background-color: #3DD7BD;
  color: ${({ isDragging }) => (isDragging ? 'white' : 'black')};
  background-image: ${({ previewImage }) => previewImage ? `url(${previewImage})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;

  &:hover {
    background-color: ${({ isDragging }) => (isDragging ? 'black' : '#85EDDB')};
  }
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
`;

const ScanLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    yellow 40%,
    yellow 60%,
    rgba(255, 255, 255, 0.2) 100%
  );
  box-shadow: 
    0 -4px 8px rgba(255, 255, 0, 0.3),
    0 4px 8px rgba(255, 255, 0, 0.3);
  animation: scan 2s linear infinite;

  @keyframes scan {
    0% {
      top: 0;
    }
    50% {
      top: 100%;
    }
    100% {
      top: 0;
    }
  }
`;

const AnalyzingText = styled.div`
  margin-top: 1rem;
  font-size: 1.2rem;
  text-align: center;
`;

const AnalysisButton = styled.button`
  margin-top: 1rem;
  padding: 1rem 2rem;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 10px;
  background-color: #f8f9fa;
  width: 100%;
  max-width: 300px;
`;

const ResultTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const ResultItem = styled.div`
  margin-bottom: 0.8rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const ResultLabel = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

const ResultValue = styled.span`
  color: #666;
`;

const DragDrop = ({ onFileChange, previewImage, isAnalyzing, onUpload, analysisResult, hideUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const dragRef = useRef(null);
  const fileId = useRef(0);

  const onChangeFiles = useCallback((e) => {
    let selectFiles = e.type === "drop" ? e.dataTransfer.files : e.target.files;
    const tempFiles = [];

    for (const file of selectFiles) {
      tempFiles.push({
        id: fileId.current++,
        object: file,
      });
    }

    setFiles(tempFiles);
    onFileChange(tempFiles);
  }, [onFileChange]);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onChangeFiles(e);
    setIsDragging(false);
  }, [onChangeFiles]);

  useEffect(() => {
    const currentDragRef = dragRef.current;
    if (currentDragRef) {
      currentDragRef.addEventListener("dragenter", handleDragIn);
      currentDragRef.addEventListener("dragleave", handleDragOut);
      currentDragRef.addEventListener("dragover", handleDragOver);
      currentDragRef.addEventListener("drop", handleDrop);
    }

    return () => {
      if (currentDragRef) {
        currentDragRef.removeEventListener("dragenter", handleDragIn);
        currentDragRef.removeEventListener("dragleave", handleDragOut);
        currentDragRef.removeEventListener("dragover", handleDragOver);
        currentDragRef.removeEventListener("drop", handleDrop);
      }
    };
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const renderAnalysisResult = (result) => {
    if (!result) return null;

    const resultItems = [];
    const labels = {
        'forehead_pigmentation': '이마 색소침착',
        'left_cheek_pore': '왼쪽 볼 모공',
        'right_cheek_pore': '오른쪽 볼 모공',
        'left_cheek_moisture': '왼쪽 볼 수분',
        'right_cheek_moisture': '오른쪽 볼 수분'
    };

    for (const key in result) {
        if (key.endsWith('_prediction')) {
            const baseName = key.replace('_prediction', '');
            const predictionValue = result[key];
            const probabilities = result[`${baseName}_probabilities`];
            
            if (probabilities && probabilities.length > predictionValue) {
                resultItems.push({
                    label: labels[baseName] || baseName,
                    value: (probabilities[predictionValue] * 100).toFixed(1)
                });
            }
        }
    }

    return (
        <ResultContainer>
            <ResultTitle>분석 결과</ResultTitle>
            {resultItems.map((item, index) => (
                <ResultItem key={index}>
                    <ResultLabel>{item.label}:</ResultLabel>
                    <ResultValue>{item.value}%</ResultValue>
                </ResultItem>
            ))}
        </ResultContainer>
    );
  };

  if (hideUpload) {
    return renderAnalysisResult(analysisResult);
  }

  return (
    <DragDropContainer>
      <div>
        <Title>AI 피부 진단</Title>
        <GuideText>
          피부 진단을 위해<br/>
          <span style={{ color: 'yellow' }}>얼굴 사진</span>을 업로드해주세요.<br/>
        </GuideText>
      </div>
      
      
      <UploadSection>
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
          accept="image/*"
          onChange={onChangeFiles}
        />

        <FileLabel
          htmlFor="fileUpload"
          ref={dragRef}
          isDragging={isDragging}
          previewImage={previewImage}
        >
          {!previewImage && (
            <div style={{color: 'white'}}>여기에 사진을 드래그하거나<br />클릭하여 업로드하세요.</div>
          )}
          {previewImage && isAnalyzing && (
            <PreviewOverlay show={true}>
              <ScanLine />
              <AnalyzingText>피부 분석 중입니다...</AnalyzingText>
            </PreviewOverlay>
          )}
        </FileLabel>

        <AnalysisButton 
          onClick={onUpload}
          disabled={!previewImage || isAnalyzing}
        >
          {isAnalyzing ? '분석 중...' : '진단 시작'}
        </AnalysisButton>

        {analysisResult && renderAnalysisResult(analysisResult)}
      </UploadSection>
    </DragDropContainer>
  );
};

export default DragDrop;