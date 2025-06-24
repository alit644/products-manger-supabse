export interface IRsginUpInput {
  type: string;
  label: string;
  placeholder: string;
  name: "userName" | "email" | "password";
  validatin: {
    required?: boolean;
    min?: number;
    pattern?: RegExp;
  };
}
export interface ILoginInput {
  type: string;
  label: string;
  placeholder: string;
  name: "email" | "password";
  validatin: {
    required?: boolean;
    min?: number;
    pattern?: RegExp;
  };
}

export interface SignUpData {
  userName: string;
  email: string;
  password: string;
}
export interface SignInData {
  email: string;
  password: string;
}

export interface IAddProduct {
  type: string;
  label: string;
  name: "price" | "stock" | "discount";
  placeholder: string;
  validatin: {
    required?: boolean;
    min?: number;
    pattern?: RegExp;
  };
}
export interface IProducts {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  mainImage: {
    image_url: string;
  };
}

export interface IProduct {
  category: string;
  created_at: string;
  description: string;
  discount: number;
  id: string;
  images: {
    id: string;
    image_url: string;
    is_main: boolean | null;
    product_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  user_id: string;
}
