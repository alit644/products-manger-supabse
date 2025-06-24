import { IAddProduct, ILoginInput, IRsginUpInput } from "../interfaces";
import { AiOutlineProduct } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsBagCheck } from "react-icons/bs";

const REGISTER_DATA: IRsginUpInput[] = [
  {
    type: "text",
    label: "User Name",
    placeholder: "@username98",
    name: "userName",
    validatin: {
      required: true,
      min: 3,
    },
  },
  {
    type: "email",
    label: "Email",
    placeholder: "Email",
    name: "email",
    validatin: {
      required: true,
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    },
  },
  {
    type: "password",
    label: "Password",
    placeholder: "Password",
    name: "password",
    validatin: {
      required: true,
      min: 6,
    },
  },
];

export default REGISTER_DATA;

const LOGIN_DATA: ILoginInput[] = [
  {
    type: "email",
    label: "Email",
    placeholder: "Email",
    name: "email",
    validatin: {
      required: true,
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    },
  },
  {
    type: "password",
    label: "Password",
    placeholder: "Password",
    name: "password",
    validatin: {
      required: true,
      min: 6,
    },
  },
];
export { LOGIN_DATA };

const SIDEBAR_DATA = [
  {
    title: "Products",
    path: "/",
    icon: BsBagCheck,
  },
  {
    title: "Add Products",
    path: "/add-products",
    icon: IoAddCircleOutline,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: AiOutlineProduct,
  },
  {
    title: "Add Categories",
    path: "/add-categories",
    icon: IoAddCircleOutline,
  },
  
];

export { SIDEBAR_DATA };

const INPUT_DATA: IAddProduct[] = [

  {
    type: "number",
    label: "Base Pricing",
    placeholder: "Enter Base Pricing",
    name: "price",
    validatin: {
      required: true,
      min: 0,
    },
  },
  {
    type: "number",
    label: "Stock",
    placeholder: "Enter Stock",
    name: "stock",
    validatin: {
      required: true,
      min: 0,
    },
  },
  {
    type: "number",
    label: "Discount",
    placeholder: "Enter Discount",
    name: "discount",
    validatin: {
      required: true,
      min: 0,
    },
  },
];
export { INPUT_DATA };
