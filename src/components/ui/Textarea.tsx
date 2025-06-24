/* eslint-disable @typescript-eslint/no-empty-object-type */
interface IInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = ({ ...props }: IInputProps) => {
  return (
    <textarea
      className=" placeholder-text-neutral-600 flex lg:h-30  w-full rounded-md border-none px-3 py-2 text-sm transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-800 text-white shadow-[0px_0px_1px_1px_#404040] focus-visible:ring-neutral-600 resize-none"
      {...props}
    />
  );
};

export default Textarea;
