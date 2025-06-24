import { NavLink } from "react-router";
import Button from "../ui/Button";
interface IProps {
  id: string;
  imgSRC: string;
  imgALT: string;
  title: string;
  openModal: (id: string) => void;
}
const CategoryCard = ({id ,imgSRC, title, imgALT, openModal }: IProps) => {
  return (
    <div id={id} className="bg-zinc-800 p-4 rounded-md flex flex-col items-center gap-2">
      {/* image */}
      <img
        src={imgSRC}
        alt={imgALT}
        className="w-32 h-32 object-cover rounded-md "
      />
      {/* content */}
      <div>
        <h3 className="sm:text-lg text-md font-semibold text-white">{title}</h3>
      </div>
      {/* buttons */}
      <div className="flex mt-2 gap-2">
        <NavLink to={`/add-categories/${id}`}>
          <Button width="w-fit" title="Edit" className="bg-[var(--color-main)] border border-[var(--color-mainHover)] hover:bg-[var(--color-mainHover)]"/>
        </NavLink>
      
          <Button
            onClick={() => openModal(id)}
            width="w-full"
            title="Delete"
            className="bg-[#7F3021] border border-[#A63939] hover:border-[#7F3021] hover:bg-[#A63939]"
          />
      </div>
    </div>
  );
};

export default CategoryCard;
