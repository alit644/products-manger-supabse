import { useState } from "react";

const Checkbox = () => {
  const [checked, setChecked] = useState(true);

  return (
    <label className="relative cursor-pointer text-xl select-none w-fit">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="absolute opacity-0 w-0 h-0"
      />
      <div
        className={`w-5 h-5 transition-all duration-300 
          ${checked ? "bg-[var(--color-main)] rounded-md animate-pulseCheck" : "bg-gray-300 rounded-full"}
        `}
      >
      
      </div>
    </label>
  );
};

export default Checkbox;
