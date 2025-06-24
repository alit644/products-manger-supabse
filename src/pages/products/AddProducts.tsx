import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import MainTitle from "../../components/MainTitle";
import { FileUpload } from "../../components/ui/FileUpload";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { addProductSchema } from "../../validations";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMsg from "../../components/error/ErrorMsg";
import { INPUT_DATA } from "../../data";
import FormSection from "../../components/ui/form/FormSection";
import FormGroup from "../../components/ui/form/FormGroup";
import { useFetch } from "../../hooks/useFetch";
import Loader from "../../components/ui/Loader";
import { useProductStore } from "../../store/useProductStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../../interfaces";
import toast from "react-hot-toast";
interface IFormInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  category: string;
  image_url: FileList | string | string[] | File[] | (string | File)[];
  is_main?: number | null | File;
}
const AddProducts = () => {
  const { editProductId } = useParams();
  const isEdit = !!editProductId;
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [primaryImageIdx, setPrimaryImageIdx] = useState<number>(0);
  const {
    isLoading: productLoading,
    addProduct,
    getProductById,
    editProduct,
  } = useProductStore();
  const methods = useForm({
    resolver: yupResolver(addProductSchema),
    context: {
      isEdit,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (isEdit) {
      editProduct({
        id: editProductId,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        discount: data.discount,
        category: data.category,
        user_id: user.id,
        image_url:
          typeof data.image_url === "string"
            ? []
            : Array.isArray(data.image_url) &&
              data.image_url.every((item) => typeof item !== "string")
            ? (data.image_url as File[])
            : Array.from(data.image_url as FileList),
        is_main: primaryImageIdx || 0,
      },
        () => {
          toast.success(`Product edited successfully`, {
          duration: 2400,
          position: "top-left",
          style: {
            backgroundColor: "#27272a",
            color: "#fff",
            border: "1px dashed #27272a",
          },
        });
          methods.reset();
          navigate("/");
        }
        , (error) => console.log("Error in onSubmit:", error)
    );
    } else {
      addProduct(
        {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          discount: data.discount,
          category: data.category,
          user_id: user.id,
          image_url:
            typeof data.image_url === "string"
              ? []
              : Array.isArray(data.image_url) &&
                data.image_url.every((item) => typeof item !== "string")
              ? (data.image_url as File[])
              : Array.from(data.image_url as FileList),
          is_main: primaryImageIdx,
        },
        () => {
          toast.success(`Product added successfully`, {
          duration: 2400,
          position: "top-left",
          style: {
            backgroundColor: "#27272a",
            color: "#fff",
            border: "1px dashed #27272a",
          },
        });
          methods.reset();
          navigate("/");
        },
        (error) => console.log("Error in onSubmit:", error)
      );
    }
  };

  //! Handlers
  const handleSelectMainImage = (idx: number) => {
    setPrimaryImageIdx(idx);
  };

  const { isLoading, data, error } = useFetch({
    queryKey: ["categories"],
    fromPath: "categories",
  });

  //! Fetching product data for edit
  const {
    data: productData,
    isLoading: proLoading,
    error: productError,
  } = useQuery<IProduct | null>({
    queryKey: ["product", editProductId],
    queryFn: () => getProductById(editProductId || ""),
    enabled: isEdit,
  });

  //! Set default values for edit
  useEffect(() => {
    if (isEdit && productData) {
      const pd = productData as unknown as IProduct;
      setValue("name", pd.name);
      setValue("description", pd.description);
      setValue("price", pd.price);
      setValue("stock", pd.stock);
      setValue("discount", pd.discount);
      setValue("category", pd.category);
      const imageUrls = pd.images.map((img) => img.image_url);
      setValue("image_url", imageUrls, { shouldValidate: true });
    }
  }, [productData, setValue, isEdit]);

  //* Renders
  const renderCategories = data?.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const renderInputs = INPUT_DATA.map((input) => (
    <FormGroup
      key={input.name}
      label={input.label}
      error={errors[input.name]?.message}
    >
      <Input
        type={input.type}
        placeholder={input.placeholder}
        {...register(input.name, input.validatin)}
      />
    </FormGroup>
  ));

  if (isEdit && proLoading) return <Loader />;
  if (isEdit && productError) return <h1>{productError.message}</h1>;

  if (isLoading) return <Loader />;
  if (error) return <h1>{error.message}</h1>;

  return (
    <div>
      <MainTitle title="Add New Products" />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-zinc-700 p-4 rounded-md flex flex-col space-y-4"
        >
          <section className="grid lg:grid-cols-2   gap-4">
            {/* General Information */}
            <FormSection title="General Information">
              <FormGroup label="Name Product" error={errors.name?.message}>
                <Input
                  type="text"
                  placeholder="Enter Name Product"
                  {...register("name", { required: true, min: 3 })}
                />
              </FormGroup>
              <FormGroup
                label="Description"
                error={errors.description?.message}
              >
                <Textarea
                  placeholder="Enter Description"
                  {...register("description", { required: true, min: 10 })}
                />
              </FormGroup>
            </FormSection>
            {/* Pricing and Stock */}
            <FormSection title="Pricing and Stock">{renderInputs}</FormSection>
            {/* Edit Product Data */}
          </section>
          {/* Upload Image */}
          <div className="border border-zinc-700 p-4 rounded-md">
            <h3 className="sm:text-lg text-md font-semibold text-white mb-3">
              Upload Image
            </h3>
            <FileUpload
              name="image_url"
              multiple={true}
              onSelectMainImage={handleSelectMainImage}
              primaryImageIdx={primaryImageIdx}
              listDefaultImage={
                isEdit && productData
                  ? productData.images.map((img) => ({
                      image_url: img.image_url,
                      is_main: img.is_main,
                    }))
                  : undefined
              }
              imgName={isEdit ? (productData as IProduct)?.name : ""}
            />
            {errors.image_url && <ErrorMsg msg={errors?.image_url.message} />}
          </div>
          {/* Categories  */}
          <div className="border border-zinc-700 p-4 rounded-md">
            <h3 className="sm:text-lg text-md font-semibold text-white mb-3">
              Categories
            </h3>
            <Select
              options={renderCategories}
              {...register("category", { required: true })}
            />
            {errors.category && <ErrorMsg msg={errors?.category.message} />}
          </div>
          <div className="flex space-x-2">
            {isEdit && (
              <NavLink to="/" className={"w-full"}>
                <Button
                  disabled={productLoading}
                  className="bg-[#242424] border border-[#363636] hover:bg-[#313131] hover:border-[#4a4a4a]"
                  width="w-full"
                  title="Cancel"
                  type="button"
                  onClick={() => navigate("/")}
                />
              </NavLink>
            )}
            <Button
              disabled={productLoading}
              width="w-full"
              title={
                isLoading
                  ? "Sending..."
                  : isEdit
                  ? "Edit Product"
                  : "Add Product"
              }
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddProducts;
