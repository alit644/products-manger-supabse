import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import MainTitle from "../../components/MainTitle";
import Button from "../../components/ui/Button";
import { FileUpload } from "../../components/ui/FileUpload";
import Input from "../../components/ui/Input";
import ErrorMsg from "../../components/error/ErrorMsg";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCategorySchema } from "../../validations";
import { useNavigate, useParams } from "react-router";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../../supabase";
import { useEffect } from "react";
import Loader from "../../components/ui/Loader";
interface IFormInput {
  name: string;
  image: File | string;
}
const AddCategory = () => {
  const { editId } = useParams();
  const isEdit = !!editId;
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { isLoading, createCategoryAndImage, editCategory } =
    useCategoryStore();
  const methods = useForm<IFormInput>({
    resolver: yupResolver(addCategorySchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  // const image = watch("image");
  const { data: categoryData, isLoading: isLoadingData } = useQuery({
    queryKey: ["categories", editId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, image")
        .eq("id", editId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: isEdit,
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (isEdit) {
      editCategory(
        {
          name: data.name,
          image: data.image,
          id: editId || "",
          userID: user.id,
          oldImage: categoryData?.image,
        },
        () => {
          methods.reset();
          navigate("/categories");
          queryClient.invalidateQueries({queryKey: ["categories"]});
        },
        (error) => console.log("Error in onSubmit:", error)
      );
    } else {
      createCategoryAndImage(
        {
          name: data.name,
          image: data.image,
          userID: user.id,
        },
        () => {
          methods.reset();
          navigate("/categories");
          queryClient.invalidateQueries({queryKey: ["categories"]});
        },
        (error) => console.log("Error in onSubmit:", error)
      );
    }
  };

  


  useEffect(() => {
    if (categoryData && isEdit) {
      setValue("name", categoryData?.name);
      setValue("image", categoryData?.image || null);
    }
  }, [categoryData, setValue, isEdit]);

  if (isLoadingData) return <Loader />;

  return (
    <section className="">
      <MainTitle title={isEdit ? "Edit Category" : "Add Category"} />

      <FormProvider {...methods}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Input
              type="text"
              placeholder="Category Name"
              {...register("name")}
            />
            {errors.name && <ErrorMsg msg={errors.name?.message} />}
          </div>
          <div>
            <FileUpload
              defaultImage={categoryData?.image || undefined}
              imgName={isEdit && categoryData?.name}
              name="image"
            />
            {errors.image && <ErrorMsg msg={errors.image?.message} />}
          </div>
          <Button
            disabled={isLoading}
            width="w-full"
            title={
              isLoading
                ? "Sending..."
                : isEdit
                ? "Edit Category"
                : "Add Category"
            }
          />
        </form>
      </FormProvider>
    </section>
  );
};

export default AddCategory;
