import React from "react";
import NavigationBar from "../../components/navbar/NavigationBar";
import { ContentContainer, MainContainer } from "../../components/container/Container";
import ImageMotion from "../imageMotion/ImageMotion";

function Home() {

  return (
    <MainContainer>
      <NavigationBar />
      <ContentContainer>
        <ImageMotion />
        <h1>dd</h1>
      </ContentContainer>
    </MainContainer>
  );
}

export default Home;
