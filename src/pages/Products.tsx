import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductCard from "../components/cards/ProductCard";
import MainTitle from "../components/MainTitle";
import { useProductStore } from "../store/useProductStore";
import { IProducts } from "../interfaces";
import Loader from "../components/ui/Loader";
import { useAuthStore } from "../store/useAuthStore";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

const Products = () => {
  const queryClient = useQueryClient()
  const { getProducts } = useProductStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdProduct, setSelectedIdProduct] = useState<string | null>(
    null
  );
  const { deleteProduct } = useProductStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["products"],
    queryFn: () => getProducts(user.id),
  });

  const openModal = useCallback((id: string) => {
    setSelectedIdProduct(id);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedIdProduct(null);
    setIsModalOpen(false);
  }, []);

  //! Delete Product Handler Mutation

  const deleteProductMutation = useMutation({
    mutationFn: () => Promise.resolve(deleteProduct(selectedIdProduct || "")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product deleted successfully", {
              duration: 2200,
              position: "top-left",
              style: {
                backgroundColor: "#27272a",
                color: "#fff",
                border: "1px dashed #27272a",
              },
            });
      closeModal();
    },
    onError: (error: Error) => {
      console.error("Error deleting product:", error.message);
      toast.error(`Error deleting product: ${error?.message}`, {
              duration: 2000,
              position: "top-left",
              style: {
                backgroundColor: "#27272a",
                color: "#fff",
                border: "1px dashed #27272a",
              },
            });
    },
  }) 

  // render the products
  const renderProducts = data?.map((product: IProducts) => (
    <ProductCard key={product.id} product={product} openModal={openModal} />
  ));

  if (isLoading) return <Loader />;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <div>
        <MainTitle
          title="Products"
          btnTitle="Add Product"
          btnPath="/add-products"
        />
        <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 md:gap-4 gap-2">
          {data?.length === 0 ? (
          <div className="bg-zinc-800 p-4 rounded-md border border-dashed border-[var(--color-main)]">
            No products found
          </div>
        ) : (
          renderProducts
        )}
        </section>
      </div>
      <Modal
        title="Confirm to delete the selected row"
        describtion="Are you sure you want to delete this row? This action cannot be 
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
            disabled={deleteProductMutation.isPending}
            onClick={() => {
              if (selectedIdProduct) {
                deleteProductMutation.mutate();
              }
            }}
            width="w-full"
            title="Delete"
            className="bg-[#7F3021] border border-[#A63939] hover:border-[#7F3021] hover:bg-[#A63939]"
          />
        </div>
      </Modal>
    </>
  );
};

export default Products;
