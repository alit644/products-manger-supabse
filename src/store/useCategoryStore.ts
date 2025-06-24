import { create } from "zustand";
import supabase from "../supabase";
import toast from "react-hot-toast";
interface ICategoryStore {
  isLoading: boolean;

  createCategoryAndImage: (
    data: {
      name: string;
      image: File | string;
      userID: string;
    },
    onSuccess?: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void
  ) => Promise<void>;

  editCategory: (
    data: {
      name: string;
      image: File | string;
      id?: string;
      userID: string;
      oldImage?: string;
    },
    onSuccessEdit?: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onErrorEdit?: (error: any) => void
  ) => Promise<void>;
}
export const useCategoryStore = create<ICategoryStore>((set) => ({
  isLoading: false,

  createCategoryAndImage: async (
    data: { name: string; image: File | string; userID: string },
    onSuccess,
    onError
  ) => {
    set({ isLoading: true });
    try {
      //! 1- رفع الصورة
      const fileName = `${data.userID}/${data.name}-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("categories")
        .upload(fileName, data.image);
      if (error) {
        toast.error("Failed to upload image", {
          duration: 2000,
          position: "top-left",
          style: {
            backgroundColor: "#27272a",
            color: "#fff",
            border: "1px dashed #27272a",
          },
        });
        console.log("Error uploading image", error.message);
        throw new Error("Failed to upload image");
      }
      //! 2- جلب رابط الصورة العام
      const {
        data: { publicUrl },
      } = supabase.storage.from("categories").getPublicUrl(fileName);
      const imageURL = publicUrl;

      //! 3- حفظ المعلومات في قاعدة البيانات
      const { error: resError } = await supabase
        .from("categories")
        .insert({
          name: data.name,
          image: imageURL,
          user_id: data.userID,
        })
        .select("*")
        .single();
      if (resError) {
        console.error("Error adding category:", resError.message);
        // حذف الصورة المرفقة في حالة الفشل
        await supabase.storage.from("categories").remove([fileName]);
        toast.error("Failed to add category", {
          duration: 2000,
          position: "top-left",
          style: {
            backgroundColor: "#27272a",
            color: "#fff",
            border: "1px dashed #27272a",
          },
        });
        set({
          isLoading: false,
        });
        throw new Error("Failed to add category");
      }
      toast.success("Category added successfully", {
        duration: 2000,
        position: "top-left",
        style: {
          backgroundColor: "#27272a",
          color: "#fff",
          border: "1px dashed #27272a",
        },
      });
      set({
        isLoading: false,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      set({
        isLoading: false,
      });
      console.error("Error in onSubmit:", error);
      if (onError) onError(error);
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  editCategory: async (data, onSuccessEdit, onErrorEdit) => {
    set({ isLoading: true });
    try {
      let imageURL = data.image;

      //! معالجة حالة تحديث الصورة المرفقة
      if (imageURL instanceof File) {
        //! 1- رفع الصورة
        const fileName = `${data.userID}/${data.name}-${Date.now()}.jpg`;
        const { error } = await supabase.storage
          .from("categories")
          .upload(fileName, data.image);
        if (error) {
          toast.error("Failed to upload image", {
            duration: 2000,
            position: "top-left",
            style: {
              backgroundColor: "#27272a",
              color: "#fff",
              border: "1px dashed #27272a",
            },
          });
          console.log("Error uploading image", error.message);
          throw new Error("Failed to upload image");
        }
        //! 2- جلب رابط الصورة العام
        const {
          data: { publicUrl },
        } = supabase.storage.from("categories").getPublicUrl(fileName);
        imageURL = publicUrl;

        //! 3- حذف الصورة القديمة بعد رفع الجديدة

        if (data.oldImage && data.oldImage !== imageURL) {
          const oldPath = data.oldImage.split(
            "/storage/v1/object/public/categories/"
          )[1];
          const path = decodeURIComponent(oldPath);
          //** لو كان هناك صورة قديمة */
          if (path) {
            const { error: deleteError } = await supabase.storage
              .from("categories")
              .remove([path]);
            if (deleteError) {
              console.log("Failed to delete old image:", deleteError.message);
              throw new Error(deleteError.message);
            }
          }
        }
      }

      const { error: resError } = await supabase
        .from("categories")
        .update({
          name: data.name,
          image: imageURL,
        })
        .eq("id", data.id);
      if (resError) {
        console.log(resError.message);
        window.history.back();
        throw new Error(resError.message);
      }
      toast.success("Category updated successfully", {
        duration: 2000,
        position: "top-left",
        style: {
          backgroundColor: "#27272a",
          color: "#fff",
          border: "1px dashed #27272a",
        },
      });
      set({
        isLoading: false,
      });
      if (onSuccessEdit) onSuccessEdit();
    } catch (error) {
      set({
        isLoading: false,
      });
      console.log("Error in onSubmit:", error);
      if (onErrorEdit) onErrorEdit(error);
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
