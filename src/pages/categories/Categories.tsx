import { useCallback, useState } from "react";
import MainTitle from "../../components/MainTitle";
import CategoryCard from "../../components/cards/CategoryCard";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import { useFetch } from "../../hooks/useFetch";
import Button from "../../components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import supabase from "../../supabase";
interface ICategory {
  id: string;
  name: string;
  image: string;
}
const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdCategory, setSelectedIdCategory] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();
  const { isLoading, data, error } = useFetch({
    queryKey: ["categories"],
    fromPath: "categories",
  });

  //! Handlers
  const openModal = useCallback((id: string) => {
    setSelectedIdCategory(id);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handelDeleteCategory = async (id: string, imageUrl?: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);

    //! جلب رابد الصورة للحذف من تخزين
    if (imageUrl) {
      const pathEncoded = imageUrl.split(
        "/storage/v1/object/public/categories/"
      )[1];
      const path = decodeURIComponent(pathEncoded);
      if (path) {
        await supabase.storage.from("categories").remove([path]);
      }
    }
  };
  const deleteCategoryMutation = useMutation({
    mutationFn: () =>
      handelDeleteCategory(
        selectedIdCategory || "",
        data?.find((category: ICategory) => category.id === selectedIdCategory)
          ?.image
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsModalOpen(false);
      toast.success("Category deleted successfully", {
        duration: 2200,
        position: "top-left",
        style: {
          backgroundColor: "#27272a",
          color: "#fff",
          border: "1px dashed #27272a",
        },
      });
    },
    onError: (error) => {
      console.log("Error deleting category:", error);
      toast.error(`Error deleting category: ${error?.message}`, {
        duration: 2000,
        position: "top-left",
        style: {
          backgroundColor: "#27272a",
          color: "#fff",
          border: "1px dashed #27272a",
        },
      });
    },
  });

  // Render
  const renderCategories = data?.map((category: ICategory) => (
    <CategoryCard
      key={category.id}
      id={category.id}
      imgALT={category.name}
      imgSRC={category.image}
      title={category.name}
      openModal={openModal}
    />
  ));
  if (isLoading) return <Loader />;
  if (error) return <div>{error.message}</div>;
  return (
    <main>
      <MainTitle
        title="Categories"
        btnTitle="Add Category"
        btnPath="/add-categories"
      />
      <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.length === 0 ? (
          <div className="bg-zinc-800 p-4 rounded-md border border-dashed border-[var(--color-main)]">
            No categories found
          </div>
        ) : (
          renderCategories
        )}
      </section>
      <Modal
        title="Confirm to delete the selected row"
        describtion="  Are you sure you want to delete this row? This action cannot be
            undone."
        isOpen={isModalOpen}
        closeModal={closeModal}
      >
        <div className="py-3 px-4 flex items-center justify-end w-full space-x-2 ">
          <Button
            onClick={closeModal}
            width="w-full"
            title="Cancel"
            className="bg-[#242424] border border-zinc-700 hover:border-zinc-600"
          />
          <Button
            disabled={deleteCategoryMutation.isPending}
            onClick={() => deleteCategoryMutation.mutate()}
            width="w-full"
            title="Delete"
            className="bg-[#7F3021] border border-[#A63939] hover:border-[#7F3021] hover:bg-[#A63939]"
          />
        </div>
      </Modal>
    </main>
  );
};

export default Categories;
