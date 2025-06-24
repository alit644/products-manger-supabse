import { NavLink } from "react-router";
import Button from "./ui/Button";

interface IProps {
  title: string;
  btnTitle?: string;
  btnPath?: string;
}
const MainTitle = ({ title, btnTitle, btnPath }: IProps) => {
  return (
    <main className="pb-6 flex justify-between items-center ">
      <h1 className="text-3xl">{title}</h1>
      {btnTitle && (
        <NavLink to={`${btnPath}`}>
          <Button width="w-fit" title={btnTitle} />
        </NavLink>
      )}
    </main>
  );
};

export default MainTitle;
