"use client";

import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { FaSquareTwitter, FaLinkedin } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";

import avatar from "@/assets/images/avatar.jpeg";

import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Services from "@/components/Services";
import JoinNetworkForm from "@/components/JoinNetworkForm";

import AuthenticationService from "@/lib/services/authentication.service";
import AuthorizationService from "@/lib/services/authorization.service";
import { Data as TestimonialData } from "@/components/Testimonial";
import Carousel from "@/components/Corousel";
import Testimonial from "@/components/Testimonial";

// User Onboarding
// import { Steps } from "intro.js-react";
// import "intro.js/introjs.css";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [stepsEnabled, setStepsEnabled] = useState<boolean>(true);
  const [takeTour, setTakeTour] = useState<boolean>(false);
  const router = useRouter();

  const serviceSectionRef = useRef<HTMLElement | null>(null);
  const contactSectionRef = useRef<HTMLElement | null>(null);
  const aboutSectionRef = useRef<HTMLElement | null>(null);

  const [transition, setTransition] = useState("slide_r");
  function changeTransition(transition: string) {
    setTransition(transition);
  }

  const testimonials: TestimonialData[] = [
    {
      name: "Milly Khainza",
      role: "ED, Send A Girl!",
      testimonial:
        "AUTOFORE has truly transformed my car ownership experience. It's convenient, cost-effective, and provides top-notch service. I highly recommend it to all car owners!",
      image: "avatar",
    },
  ];

  const scrollToSection = (ref: any) => {
    if (ref.current) {
      (ref.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const checkUser = async () => {
    try {
      const session = await AuthenticationService.getSession();
      if (session) {
        const isUserAdmin: boolean = await AuthorizationService.checkIsAdmin();
        const isUserCustomer: boolean =
          await AuthorizationService.checkIsCustomer();

        if (isUserAdmin) {
          router.push("/admin/dashboard");
        } else if (isUserCustomer) {
          router.push("/customer/dashboard");
        }
      }
    } catch (error: any) {
      console.log("Error Message: ", error.message);
    }
  };

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      className={`${
        isOpen ? "overflow-y-hidden h-screen" : "min-h-screen"
      } bg-secondary-50/20 w-full overflow-x-hidden relative pb-1`}
    >
      {/* <Steps
        enabled={stepsEnabled}
        steps={[
          {
            title: `
            <h3 class="font-body text-base font-light py-1.5 h-full">
              Hello 👋, Welcome to <span class="ml-1 font-medium text-normal text-primary-500">Autofore</span>
            </h3>`,
            element: "#navbar",
            intro: `
            <p class="font-body text-base font-light my-1 h-full text-normal">
              Let's show you around.
            </p>`,
          },
          {
            element: "#services-section",
            intro: `
            <p class="font-body text-base font-light my-1 h-full text-normal">
              Explore our services. 
            </p>`,
            position: "right",
          },
          {
            element: "#how-it-works",
            intro: `
            <p class="font-body text-base font-light my-1 h-full text-normal">
              This is how it works 
            </p>`,
            position: "right",
          },
          {
            element: "#book-now-cta",
            intro: `
            <p class="font-body text-base my-1 h-full font-light">
              Ready to get Started?. 
            </p>`,
            position: "bottom",
          },
          {
            element: "#join-network-form",
            intro: `
            <p class="font-body text-base font-light my-1 h-full">
              Are you a garage owner willing to join the garage network? Look no further.
            </p>`,
            position: "bottom",
          },
          {
            element: "#testimonials",
            intro: `
            <p class="font-body text-base font-light my-1 h-full">
              Here's what the clients say.
            </p>`,
            position: "bottom",
          },
          {
            element: "#footer",
            intro: `
            <p class="font-body text-base font-light my-1 h-full">
              Compelled to reachout? Contact us
            </p>`,
            position: "bottom",
          },
        ]}
        initialStep={0}
        onExit={() => setStepsEnabled(false)}
        options={{
          showProgress: true,
          overlayOpacity: 0.01,
          dontShowAgain: true,
        }}
      /> */}

      <Navigation
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleServiceScoll={() => scrollToSection(serviceSectionRef)}
        handleContactScroll={() => scrollToSection(contactSectionRef)}
        handleAboutScroll={() => scrollToSection(aboutSectionRef)}
      />
      <Hero
        handleRef={serviceSectionRef}
        className="w-full pt-4 mx-auto md:w-3/4 lg:w-1/2 md:pt-16 hero"
      />
      <Services className="w-full pt-4 mx-auto md:w-3/4 lg:w-1/2 md:pt-16" />

      {/* How it works section  */}
      <section
        className="px-2 pb-20 text-sm bg-white font-body md:text-base"
        ref={aboutSectionRef}
        id="how-it-works"
      >
        <div className="w-3/4 m-auto">
          <h2 className="py-8 text-2xl font-bold text-center md:py-16 lg:py-20 text-secondary-700">
            How it Works
          </h2>
          <div className="container grid grid-cols-1 gap-10 mx-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {/* step One */}
            <div className="relative p-5 text-center rounded-md bg-secondary-50/30 flex flex-col items-center">
              <div className="absolute p-1 rounded-md -top-3 bg-primary-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7 16C4.79086 16 3 14.2091 3 12C3 10.0929 4.33457 8.4976 6.12071 8.09695C6.04169 7.74395 6 7.37684 6 7C6 4.23858 8.23858 2 11 2C13.4193 2 15.4373 3.71825 15.9002 6.00098C15.9334 6.00033 15.9666 6 16 6C18.7614 6 21 8.23858 21 11C21 13.419 19.2822 15.4367 17 15.9M15 13L12 10M12 10L9 13M12 10L12 22"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="pb-2 mt-4 font-medium">
                Step 1 <br />
              </h3>
              <h5>
                Select service on our website. Fill in all the required details
                and choose a collection time slot.
              </h5>
            </div>
            {/* Step two  */}
            <div className="relative p-5 text-center rounded-md bg-secondary-50/30 flex flex-col items-center">
              <div className="absolute p-1 rounded-md -top-3 bg-primary-500 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="pb-2 mt-4 font-medium">
                Step 2<br />
              </h3>
              <h5>Get a pin to auto service provider nearest to you.</h5>
            </div>
            {/* Step three  */}
            <div className="relative p-5 text-center rounded-md bg-secondary-50/30 flex flex-col items-center">
              <div className="absolute p-1 rounded-md -top-3 bg-primary-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    color="white"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
              <h3 className="pb-2 mt-4 font-medium">
                Step 3 <br />
              </h3>
              <h5>
                A comprehensive health report will be carried out on your
                vehicle. This will be sent to you shortly, informing you of any
                issues found. Along with the report, a quotation for the service
                parts, and any additional repairs, will also be sent to you.
              </h5>
            </div>
          </div>
        </div>
      </section>

      <section
        className="px-2 pb-20 text-sm  font-body md:text-base"
        id="join-network-form"
      >
        <div className="flex flex-col items-center w-full m-auto text-center md:w-3/5 ">
          <div className="">
            <h2 className="text-2xl font-bold text-center md:pt-16 lg:pt-20 text-secondary-700">
              Join Our Network of Garages
            </h2>
            <p className="py-4">
              Connect with us and unlock exciting opportunities for your garage.
            </p>
          </div>
          {/* Form for collecting garage information  */}
          <JoinNetworkForm />
        </div>
      </section>
      {/* Testimonal section  */}
      <section
        className="w-full flex justify-center bg-white pt-10 py-20 h-fit"
        id="testimonials"
      >
        <div className="w-3/4 px-2 m-auto text-sm rounded-md font-body md:text-base relative">
          <div className="w-full m-auto text-center md:w-3/5">
            <h1 className="py-8 text-2xl font-bold text-center text-secondary-700">
              Testimonals
            </h1>
          </div>
          <Carousel changeTransition={changeTransition} transition={transition}>
            {testimonials.map((testimonial: TestimonialData, index) => {
              return (
                <Testimonial
                  data={testimonial}
                  key={index}
                  variants={transition}
                  
                />
              );
            })}
          </Carousel>

          {/* <div className="w-full m-auto text-center md:w-3/5">
            <p className="text-base text-secondary-300 font-extralight flex justify-center z-20 border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 144 144"
                fill="none"
                className="h-40 w-40 absolute z-10"
              >
                <path
                  d="M41.485 15C17.753 31.753 1 59.208 1 89.455C1 114.119 15.891 128.545 33.109 128.545C49.396 128.545 61.495 115.515 61.495 100.158C61.495 84.802 50.792 73.634 36.832 73.634C34.04 73.634 30.317 74.099 29.386 74.564C31.713 58.743 46.604 40.129 61.496 30.822L41.485 15ZM121.525 15C98.257 31.753 81.505 59.208 81.505 89.455C81.505 114.119 96.396 128.545 113.614 128.545C129.436 128.545 142 115.515 142 100.158C142 84.802 130.832 73.634 116.871 73.634C114.079 73.634 110.822 74.099 109.891 74.564C112.218 58.743 126.644 40.129 141.535 30.822L121.525 15Z"
                  stroke="#C7D2FE"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                />
              </svg>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
              ducimus officiis accusantium, rem vitae optio distinctio
              reiciendis earum eos illo quisquam veritatis assumenda, sapiente
              facilis nam quaerat dolores, quos magni.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mt-5 md:mt-0 md:flex-row z-30">
            <div className="flex justify-center">
              <Image
                src={avatar}
                width={100}
                height={100}
                quality={80}
                alt=""
                className="w-48 h-48 rounded-full object-cover z-10 "
              />
            </div>
            <div className="flex flex-col w-full h-full gap-10 pt-2 pb-2 md:w-2/3 pl-7">
              <p className="text-lg font-light">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eo
                minima ipsum sequi deserunt earum laudantium placeat porro qu
                iusto ratione iste corporis maiores, est, numquam voluptate quae
                cum blanditiis nulla?
              </p>
              <div className="flex flex-col gap-y-1">
                <span className="font-light">Judith Black</span>
                <span className="text-primary-500 font-medium">CEO Tuple</span>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* footer  */}
      <section
        ref={contactSectionRef}
        className="w-full pl-5 m-auto  text-white bg-primary-500"
        id="footer"
      >
        <footer className="py-10 font-body">
          <div className="container mx-auto">
            <div className="flex flex-col justify-between md:flex-row">
              <div className="p-1 mb-4 md:w-1/3 md:mb-0">
                <h3 className="mb-2 text-lg font-medium">Contact Us</h3>
                <p className="text-base font-light flex flex-col gap-y-2">
                  <span>Address: Kampala Inside UICT Nakawa Campus</span>
                  <span>Plot 19-21 Port Bell Road, Uganda</span>
                  <span>Email: info@autofore.co.ug</span>
                  <span>Phone: +256 774572316</span>
                </p>
              </div>
              <div className="p-1 mb-4 md:w-1/4 md:mb-0">
                <h3 className="mb-2 text-lg font-medium">Quick links</h3>
                <ul className="font-light text-base flex flex-col gap-y-2">
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection(serviceSectionRef)}>
                      Our Services
                    </button>
                  </li>
                  <li>
                    <a href="#about">About Us</a>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection(contactSectionRef)}>
                      Contact
                    </button>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/4">
                <h3 className="mb-2 text-lg font-medium">Follow Us</h3>
                <div className="flex items-center space-x-4">
                  <a href="https://twitter.com/AutoforeUg">
                    <FaSquareTwitter size={25} />
                  </a>
                  <a href="#">
                    <FaFacebookSquare size={25} />
                  </a>
                  <a href="https://www.linkedin.com/company/autofore/">
                    <FaLinkedin size={25} />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm">
              &copy; {new Date().getFullYear()} autofore.co . All Rights
              Reserved.
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
