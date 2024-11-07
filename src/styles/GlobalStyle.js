import { createGlobalStyle } from "styled-components";
import "./fonts/font.css";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Pretendard";
    font-display: fallback;
    src:
      url("./fonts/Pretendard-Regular.otf") format("opentype"),
      url("./fonts/Pretendard-Bold.otf") format("opentype"),
      url("./fonts/Pretendard-ExtraBold.otf") format("opentype"),
      url("./fonts/Pretendard-Light.otf") format("opentype"),
      url("./fonts/Pretendard-ExtraLight.otf") format("opentype"),
      url("./fonts/Pretendard-SemiBold.otf") format("opentype");
    font-weight: 700;
    font-style: normal;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;
