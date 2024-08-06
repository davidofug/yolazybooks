import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import avatar from "@/assets/images/testimonial1.jpeg";
import { GrPrevious, GrNext } from "react-icons/gr";

interface transitionsObject {
  [key: string]: any;
}

export const transitions: transitionsObject = {
  slide_r: {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 0 },
  },
  slide_l: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 0 },
  },
};

export interface Data {
  name: string;
  role?: string;
  testimonial: string;
  image: string;
  header?: string;
}

export interface ITestimonialProps {
  data: Data;
  previous?: Function;
  next?: Function;
  isVisible?: Boolean;
  variants: string;
}

function Testimonial({
  data,
  previous = () => {},
  next = () => {},
  isVisible = true,
  variants,
}: ITestimonialProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={String(Math.random())}
          variants={transitions[variants]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center"
        >
          <button
            aria-label="Previous Slide"
            className="w-16 h-20 hidden"
            onClick={() => previous()}
          >
            <GrPrevious />
          </button>
          <section className="flex flex-col">
            <div className="w-full m-auto text-center md:w-3/5">
              <p className="text-base text-secondary-300 font-extralight flex justify-center z-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 144 144"
                  fill="none"
                  className="h-40 w-40 absolute z-10 "
                >
                  <path
                    d="M41.485 15C17.753 31.753 1 59.208 1 89.455C1 114.119 15.891 128.545 33.109 128.545C49.396 128.545 61.495 115.515 61.495 100.158C61.495 84.802 50.792 73.634 36.832 73.634C34.04 73.634 30.317 74.099 29.386 74.564C31.713 58.743 46.604 40.129 61.496 30.822L41.485 15ZM121.525 15C98.257 31.753 81.505 59.208 81.505 89.455C81.505 114.119 96.396 128.545 113.614 128.545C129.436 128.545 142 115.515 142 100.158C142 84.802 130.832 73.634 116.871 73.634C114.079 73.634 110.822 74.099 109.891 74.564C112.218 58.743 126.644 40.129 141.535 30.822L121.525 15Z"
                    stroke="#C7D2FE"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                  />
                </svg>
                {data.header ?? ""}
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
                  className="w-48 h-48 rounded-full object-cover z-10 border-[0.5px] border-secondary-50"
                />
              </div>
              <div className="flex flex-col w-full h-full gap-10 pt-2 pb-2 md:w-2/3 pl-7">
                <p className="text-lg font-light">{data.testimonial ?? ""}</p>
                <div className="flex flex-col gap-y-1">
                  <span className="font-light">{data.name ?? ""}</span>
                  <span className="text-primary-500 font-medium">
                    {data.role ?? ""}
                  </span>
                </div>
              </div>
            </div>
          </section>
          <button
            aria-label="Previous Slide"
            className="w-16 h-20 hidden"
            onClick={() => next()}
          >
            <GrNext />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Testimonial;
