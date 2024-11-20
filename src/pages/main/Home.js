import React from "react";
import NavigationBar from "../../components/navbar/NavigationBar";
import { ContentContainer, MainContainer } from "../../components/container/Container";
import ImageMotion from "../imageMotion/ImageMotion";
import Footer from "../../components/container/Footer";

function Home() {
  return (
    <MainContainer>
      <NavigationBar />
      <ImageMotion />
      <div style={{width: '100%', height: '800px', backgroundColor: '#FFFFFF', marginTop: '75vh'}}></div>
      <div style={{width: '100%', height: '800px', backgroundColor: '#D0FFF9'}}></div>
      <div style={{width: '100%', height: '800px', backgroundColor: '#FFE544'}}></div>
      <Footer />
    </MainContainer>
  );
}

export default Home;
