import { CgClose } from "react-icons/cg";

interface IProps {
  children?: React.ReactNode;
  title: string;
  describtion?: string;
  isOpen: boolean;
  closeModal: () => void;
}
const Modal = ({ children,title, describtion, isOpen, closeModal }: IProps) => {
  return (
    isOpen && (
      <>
        <section className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-[#00000080] backdrop-blur-sm">
          <div className="sm:w-96 w-80 rounded-md bg-[#1C1C1C] border border-zinc-700 flex flex-col items-start justify-between">
            {/* Modal Title */}

            <div className="py-3 px-4 flex items-center justify-between  w-full  font-medium border-b border-zinc-700 ">
              <h3 className="sm:text-lg text-sm text-gray-200 font-semibold text-gray-200">
                {" "}
                {title}
              </h3>
              <CgClose
                onClick={closeModal}
                className="text-zinc-600 hover:text-zinc-400 cursor-pointer"
              />
            </div>
            {/* Modal Body */}
            <div className="py-3 px-4 flex items-center justify-start w-full font-medium border-b border-zinc-700">
              <p className="text-sm text-[#b4b4b4]">{describtion}</p>
            </div>
            {/* Modal Footer */}
            {children}
            
          </div>
        </section>
      
      </>
    )
  );
};

export default Modal;
