import { forwardRef, Ref, SelectHTMLAttributes } from "react";

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }> | undefined;
}
const Select = forwardRef(
  ({ options, ...rest }: ISelectProps, ref: Ref<HTMLSelectElement>) => {
    return (
      <select
        ref={ref}
        {...rest}
        className="placeholder-text-neutral-600 flex h-13 w-full rounded-md border-none  px-3 py-2 text-sm  transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-800 text-white shadow-[0px_0px_1px_1px_#404040] focus-visible:ring-neutral-600"
      >
        <option className="text-subHeding bg-second" value="" disabled selected>
          Choose here
        </option>
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-subHeding bg-second"
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

export default Select;
