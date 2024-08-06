import React from "react";
import { useState, useEffect } from "react";
// types
import { ITestimonialProps as TestimonialPropsType } from "../Testimonial";
// swipe hook
import { useSwipeable } from "react-swipeable";

export interface ICarouselProps {
  children: Array<React.ReactNode>;
  changeTransition: Function;
  transition: String;
}

function Carousel({ children, changeTransition, transition }: ICarouselProps) {
  const [index, setIndex] = useState(0);
  // swipe handlers
  const handlers = useSwipeable({
    onSwipedRight: () => next(),
    onSwipedLeft: () => previous(),
  });
  // hanfler for left/right key
  function handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
        next();
        break;
      case "ArrowLeft":
        previous();
        break;
    }
  }
  // event listener for left/right keys
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, transition]);
  // shows next element
  function next() {
    // switch direction for slide
    if (children?.length > 0) {
      if (transition === "slide_l") changeTransition("slide_r");
      let newIndex;
      if (index === children.length - 1) newIndex = 0;
      else newIndex = index + 1;
      setIndex(newIndex);
    }
  }
  // shows previous element
  function previous() {
    // switch direction for slide
    if (children?.length > 1) {
      if (transition === "slide_r") changeTransition("slide_l");
      let newIndex;
      if (index === 0) newIndex = children.length - 1;
      else newIndex = index - 1;
      setIndex(newIndex);
    }
  }
  return (
    <div
      id="carousel"
      className="relative h-96 md:h-64 md:w-full flex"
      {...handlers}
    >
      {children.map((child, i) => {
        if (React.isValidElement<TestimonialPropsType>(child)) {
          return React.cloneElement(child, {
            next: next,
            previous: previous,
            isVisible: i === index ? true : false,
          });
        }
      })}
    </div>
  );
}

export default Carousel;
