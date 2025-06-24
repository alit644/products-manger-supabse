import { memo } from "react";

const Avatar = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full text-white bg-[#3ecf8e]   cursor-pointer">
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

export default memo(Avatar);
