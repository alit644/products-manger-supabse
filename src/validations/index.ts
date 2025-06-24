import * as yup from "yup";

const registerSchema = yup
  .object({
    userName: yup
      .string()
      .required("User name is required")
      .min(3, "User name must be at least 3 characters"),
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();
export { registerSchema };

const loginSchema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();
export { loginSchema };

const addCategorySchema = yup
  .object({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    image: yup
      .mixed<File | string>()
      .test("fileType", "Invalid file type", (value) => {
        // السماح بالصورة القديمة كرابط
        if (typeof value === "string") return true;

        // السماح بأن لا تكون صورة (للتعامل مع required لاحقًا)
        if (!value) return false;

        // التحقق من نوع الملف إذا كان ملف
        const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
        return validImageTypes.includes(value.type);
      })
      .required("Image is required"),
    // .nullable(),
  })
  .required();
export { addCategorySchema };

const addProductSchema = yup
  .object({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    description: yup
      .string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    price: yup
      .number()
      .required("Price is required")
      .min(0, "Price must be greater than 0"),
    stock: yup
      .number()
      .required("Stock is required")
      .min(0, "Stock must be greater than 0"),
    discount: yup
      .number()
      .required("Discount is required")
      .max(100, "Discount must be less than 100")
      .min(0, "Discount must be greater than 0"),

    category: yup.string().required("Category is required"),
    image_url: yup
      .mixed<FileList | string | string[] | File[] | (string | File)[]>()
      .test("fileType", "Invalid file type", (value) => {
        if (typeof value === "string") return true;
        if (!value) return false;
        if (Array.isArray(value)) {
          return value.every((item) => {
            if (typeof item === "string") return true; // السماح بالـ URLs
            if (item instanceof File) {
              const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
              return validImageTypes.includes(item.type);
            }
            return false; // رفض أي نوع آخر
          });
        }
        // التعامل مع FileList
        const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
        return Array.from(value as FileList).every((file) =>
          validImageTypes.includes(file.type)
        );
      })
      .test("minImages", "You must upload at least 3 images", (value) => {
        if (!value) return false;
        if (Array.isArray(value)) return value.length >= 3;
        if (value instanceof FileList) return value.length >= 3;
        return false;
      })
      .test("maxImages", "You cannot upload more than 6 images", (value) => {
        if (!value) return false;
        if (Array.isArray(value)) return value.length <= 6;
        if (value instanceof FileList) return value.length <= 6;
        return false;
      })
      .required("Image is required"),
  })

  .required();

export { addProductSchema };
