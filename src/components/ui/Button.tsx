import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string | undefined;
  className?: string;
  width: "w-full" | "w-fit";
}
const Button = ({ title, className = "bg-[var(--color-main)] hover:bg-[var(--color-mainHover)]", width = "w-full", ...props }: IProps) => {
  return (
    <button
      className={`${className} ${width} md:px-4 md:py-2 px-2 py-1 text-white border border-[#3ecf8e]  hover:border-[#3ecf8e]  transition-all duration-200 cursor-pointer rounded-md disabled:bg-[#7fcfbada] disabled:cursor-no-drop`}
      {...props}
    >
      {title}
    </button>
  );
};

export default Button;
