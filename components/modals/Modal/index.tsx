import { useRef } from "react";

interface ModalProps {
  setModalOpen: (show: boolean) => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, setModalOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="h-screen w-screen bg-black/20 bg-opacity-40 fixed top-0 left-0 bottom-0 right-0 z-20 flex justify-center items-center overflow-hidden">
      <div
        className="bg-white rounded-md w-fit h-fit relative px-10 py-5"
        onClick={(event) => event.stopPropagation()}
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
