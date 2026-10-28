import React from "react";
import Hero from "./Hero";
import Filmstrip from "./Filmstrip";
import EditorialStory from "./EditorialStory";
import Categories from "./Categories";
import Featured from "./Featured";
import InFocus from "./InFocus";
import Testimonials from "./Testimonials";
import Journal from "./Journal";
import Newsletter from "./Newsletter";

function Home() {
  return (
    <>
      <Hero />
      <Filmstrip />
      <EditorialStory />
      <Categories />
      <Featured />
      <InFocus />
      <Testimonials />
      <Journal />
      <Newsletter />
    </>
  );
}

export default Home;
