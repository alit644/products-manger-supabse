import { create } from "zustand";
import supabase from "../supabase";
import { IProduct } from "../interfaces";
import toast from "react-hot-toast";

interface IProductStore {
  isLoading: boolean;
  addProduct: (
    data: {
      name: string;
      description: string;
      price: number;
      stock: number;
      discount: number;
      category: string;
      user_id: string;
      image_url: File[];
      is_main: number | null;
    },
    onSuccess?: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void
  ) => void;

  getProducts: (id : string) => void;
  getProductById: (id: string) => Promise<IProduct | null>;
  editProduct: (
    data: {
      id?: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      discount: number;
      category: string;
      user_id: string;
      image_url: File[];
      is_main: number | null;
    },
    onSuccessEdit?: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onErrorEdit?: (error: any) => void
  ) => void;
  deleteProduct: (
    id: string,
    onSuccessDelete?: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onErrorDelete?: (error: any) => void
  ) => void;
}

export const useProductStore = create<IProductStore>((set) => ({
  isLoading: false,
  addProduct: async (data, onSuccess, onError) => {
    set({ isLoading: true });
    try {
      //! 1- رقع المنتج وجلب المعرف الخاص به
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .insert({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          discount: data.discount,
          category: data.category,
          user_id: data.user_id,
        })
        .select("id")
        .single();

      if (fetchError) {
        set({ isLoading: false });
        throw new Error(fetchError.message);
      }
      const productId = product.id;

      //! 2- رفع الصورة للمنتج
      const imageUploads = data.image_url.map(async (image, idx) => {
        const fileName = `${
          data.user_id
        }/products/${productId}-${Date.now()}-${idx}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, image);
        if (uploadError) {
          set({ isLoading: false });
          throw new Error(uploadError.message);
        }
        //! get Public Url
        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(fileName);

        //!
        return supabase.from("product_images").insert({
          product_id: productId,
          image_url: publicUrl,
          is_main: idx === data.is_main,
        });
      });
      await Promise.all(imageUploads);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      onError?.(error);
      console.log(error);
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  getProducts: async (id: string) => {
    try {
      const { data: products, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", id)
      if (fetchError) throw new Error(fetchError.message);
      if (!products || products.length === 0) return [];

      //! get product images
      const productIds = products.map((product) => product.id);
      const { data: productImages, error: productImagesError } = await supabase
        .from("product_images")
        .select("id, product_id, image_url, is_main")
        .in("product_id", productIds);
      if (productImagesError) throw new Error(productImagesError.message);
      //! ربط المنتج مع صور
      return products.map((product) => {
        const imagesForProduct = productImages.filter(
          (image) => image.product_id === product.id
        );
        const mainImage = imagesForProduct.find(
          (image) => image.is_main === true
        );
        return { ...product, images: imagesForProduct, mainImage };
      });
    } catch (error) {
      console.log("Error getting products", error);
    }
  },
  getProductById: async (id: string): Promise<IProduct | null> => {
    try {
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (fetchError) throw new Error(fetchError.message);
      if (!product) return null;
      //! get product images
      const { data: productImages, error: productImagesError } = await supabase
        .from("product_images")
        .select("id, product_id, image_url, is_main")
        .eq("product_id", id);
      if (productImagesError) throw new Error(productImagesError.message);
      return { ...product, images: productImages };
    } catch (error) {
      console.log("Error getting product by id", error);
      window.history.back();
      return null;
    }
  },
  //TODO : Edit Product : delete old images and add new images 
  editProduct: async (data, onSuccessEdit, onErrorEdit) => {
    set({ isLoading: true });
    try {

    
      //! 1- رفع الصورة وتعامل مع الصور القديمة  
      const imagesUrl = data.image_url.map(async (image) => {
        if (typeof image === "string") {
          return image;
        }
        //* رفع الصورة الجديدة في حالة كان ملف 
        const fileName = `${data.user_id}/products/${
          data.id
        }-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, image);
        if (uploadError) {
          set({ isLoading: false });
          throw new Error(uploadError.message);
        }
        //* جلب رابط الصورة العامة
        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(fileName);
        return publicUrl;
      });

      //! 2- تحديث معلومات المنتج
      const imageUrls = await Promise.all(imagesUrl);
      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          discount: data.discount,
          category: data.category,
        })
        .eq("id", data.id);
      if (updateError) {
        set({ isLoading: false });
        throw new Error(updateError.message);
      }
      //! 3- حذف الصور القديمة
      const { error: deleteError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", data.id);
      if (deleteError) {
        set({ isLoading: false });
        throw new Error(deleteError.message);
      }
      //! 4- إضافة الصور الجديدة 
      const { error: insertError } = await supabase
        .from("product_images")
        .insert(
          imageUrls.map((url, idx) => ({
            product_id: data.id,
            image_url: url,
            is_main: idx === data.is_main,
          }))
        );
      if (insertError) {
        set({ isLoading: false });
        throw new Error(insertError.message);
      }
      set({ isLoading: false });

      //! 5 حذف الصورة القديمة من التخزين
  
      
      if (onSuccessEdit) {
        onSuccessEdit();
      }
    } catch (error) {
      console.log("Error editing product", error);
      onErrorEdit?.(error);
      if (error instanceof Error) {
        toast.error(`Error editing product: ${error.message}`, {
          duration: 2000,
          position: "top-left",
          style: {
            backgroundColor: "#27272a",
            color: "#fff",
            border: "1px dashed #27272a",
          },
        });
      }
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteProduct: async (id, onSuccessDelete, onErrorDelete) => {
    set({ isLoading: true });
    try {
      //! 1- حذف المنتج من قاعدة البيانات
      const { error: deleteProductError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (deleteProductError) {
        set({ isLoading: false });
        throw new Error(deleteProductError.message);
      }
      //! 2- حذف الصور المرتبطة بالمنتج
      const { error: deleteImagesError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", id);
      if (deleteImagesError) {
        set({ isLoading: false });
        throw new Error(deleteImagesError.message);
      }

      //! 3- حذف الصور من التخزين
      const { data: images, error: fetchImagesError } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", id);
      if (fetchImagesError) {
        set({ isLoading: false });
        throw new Error(fetchImagesError.message);
      }
      const deleteImagePromises = images.map(async (image) => {
        const fileName = image.image_url.split("/").pop();
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove([fileName]);
        if (storageError) {
          set({ isLoading: false });
          throw new Error(storageError.message);
        }
      });
      await Promise.all(deleteImagePromises);
      
      set({ isLoading: false });
      if (onSuccessDelete) {
        onSuccessDelete();
      }
    } catch (error) {
      console.log("Error deleting product", error);
      onErrorDelete?.(error);
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
