import { NavLink } from "react-router";
import { IProducts } from "../../interfaces";
import Button from "../ui/Button";

const ProductCard = ({ product, openModal }: { product: IProducts , openModal: (id: string) => void }) => {
  const { id, name, description, price, stock, discount, mainImage } = product;
  //TODO : تشابك منتجات المستخدمين مع بعضها 
  return (
    <>
    <div
      id={id}
      className="card relative bg-zinc-800 md:p-4 p-2 rounded-md flex flex-col justify-between items-center space-y-2"
    >
      {/* image */}
      <div className="w-full">
        <img
          src={mainImage.image_url}
          alt={name}
          className="w-[100%] md:h-[200px] h-[150px]  object-cover rounded-md object-center bg-center"
          loading="lazy"
        />
      </div>
      {/* content */}
      <div className="w-full">
        <h3 className="sm:text-lg text-md font-semibold text-white  w-full line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-[#b4b4b4] line-clamp-2 h-10">
          {description}
        </p>
        {/* price and stock */}
        <div className="flex justify-between flex-wrap mt-2">
          <h4 className="sm:text-lg text-md font-semibold  text-[var(--color-main)]">
            ${price}
          </h4>
          <h4 className="text-sm text-white ">In Stock : {stock}</h4>
        </div>
      </div>
      {/* discount */}
      {discount > 0 && (
        <div className="bg-[#7F3021] p-2 rounded-md absolute top-2 left-2">
          <h4 className="text-sm text-white  ">discount: {discount}%</h4>
        </div>
      )}
      {/* divider */}
      <div className="w-full h-[1px] bg-zinc-700"></div>

      {/* buttons */}
      <div className="flex mt-2 gap-2 w-full">
        <NavLink to={`/add-products/${id}`} className={'w-full'}>
          <Button
            width="w-full"
            title="Edit"
            className="bg-[#006239] border border-[#3ecf8e] hover:bg-[#3ecf8e80] hover:border-[#3ecf8e]"
          />
        </NavLink>
        <Button
          onClick={() => openModal(id)}
          width="w-full"
          title="Delete"
          className="bg-[#7F3021] border border-[#A63939] hover:border-[#7F3021] hover:bg-[#A63939]"
        />
      </div>
    </div>
    
    </>

  );
};

export default ProductCard;
