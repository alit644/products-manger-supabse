import { forwardRef, InputHTMLAttributes, Ref } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement>{
  type: string
  height?: string
}

const Input = forwardRef(({ type , height = "h-10" ,...props }: IInputProps , ref: Ref<HTMLInputElement>) => {
  return (
    <input
      ref={ref}
      type={type}
      className={`placeholder-text-neutral-600 flex ${height} w-full rounded-md border-none  px-3 py-2 text-sm  transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-800 text-white shadow-[0px_0px_1px_1px_#404040] focus-visible:ring-neutral-600`}
      {...props}
    />
  );
})

export default Input;
