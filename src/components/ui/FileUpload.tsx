/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";
import { LuUpload } from "react-icons/lu";
import { CgClose } from "react-icons/cg";
import { useFormContext } from "react-hook-form";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};
//TODO : add screenshot to grok FileUpload and AddProducts
export const FileUpload = ({
  defaultImage,
  imgName,
  multiple = false,
  name = "image", // اسم الحقل المستخدم في useForm
  onSelectMainImage,
  primaryImageIdx,
  listDefaultImage,
}: {
  defaultImage?: string;
  imgName?: string;
  multiple?: boolean;
  name?: string;
  onSelectMainImage?: (idx: number) => void;
  primaryImageIdx?: number;
  listDefaultImage?: {
    image_url: string;
    is_main: boolean | null;
  }[];
}) => {
  const { setValue, watch } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const image = watch(name);

  const handleFileChange = (newFiles: File[]) => {
    if (multiple) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      // دمج الصور الحالية (URLs أو ملفات) مع الملفات الجديدة
      const currentImages = Array.isArray(image)
        ? [...image]
        : image instanceof FileList
        ? Array.from(image)
        : [];
      const updatedImages = [...currentImages, ...newFiles];
      setValue(name, updatedImages, { shouldValidate: true });
    } else {
      const selectedFile = newFiles[0];
      setFiles([selectedFile]);
      setValue(name, selectedFile, { shouldValidate: true });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: multiple,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  const handleRemoveFile = (idx: number) => {
    if (multiple) {
      const currentImages = Array.isArray(image) ? [...image] : [];
      const updatedImages = currentImages.filter((_, index) => index !== idx);
      setFiles(updatedImages);
      setValue(name, updatedImages, { shouldValidate: true });
      if (primaryImageIdx === idx) {
        onSelectMainImage?.(0);
      } else if ((primaryImageIdx ?? -1) > idx) {
        onSelectMainImage?.(primaryImageIdx ?? -1);
      }
    } else {
      setFiles([]);
      setValue("image", defaultImage || null, { shouldValidate: true });
    }
  };

  //! دمج الصور القديمة مع الصور الجديدة
  const displayImages = useMemo(
    () =>
      Array.isArray(image)
        ? image.map((item) =>
            typeof item === "string"
              ? { type: "url" as const, value: item }
              : { type: "file" as const, value: item }
          )
        : listDefaultImage
        ? listDefaultImage.map((img) => ({
            type: "url" as const,
            value: img.image_url,
          }))
        : [],
    [image, listDefaultImage]
  );

  return (
    <>
      <div
        className="w-full bg-zinc-800 border border-dashed border-[#404040] hover:border-[#1DCD9F] rounded-lg"
        {...getRootProps()}
      >
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className="p-5 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            multiple={multiple}
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
          />
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="relative z-20 font-sans font-bold text-neutral-300 text-base">
              Upload file
            </p>
            <p className="relative z-20 text-center font-sans font-normal text-neutral-400 text-base mt-2">
              Drag or drop your files here or click to upload
            </p>
            <div className="relative w-full mt-4 max-w-xl mx-auto">
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={`relative group-hover/file:shadow-2xl z-30 bg-neutral-900 flex items-center justify-center sm:h-32 h-20 mt-4 w-full max-w-[8rem] mx-auto rounded-md shadow-[0px_10px_50px_rgba(0,0,0,0.1)]`}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center "
                  >
                    Drop it
                    <LuUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <LuUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>

              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-[#1DCD9F] inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* عرض الصور  */}
      <div className="relative w-full mb-4 max-w-xl mx-auto">
        {displayImages.length > 0 ? (
          displayImages.map((image, idx) => (
            <motion.div
              key={`file-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden z-30 bg-neutral-900 flex flex-col md:flex-row items-start justify-start md:h-30 p-4 mt-4 w-full mx-auto rounded-md shadow-sm gap-4"
            >
              <div className="mt-2 mx-auto">
                <img
                  src={
                    image.type === "url"
                      ? image.value
                      : URL.createObjectURL(image.value)
                  }
                  alt={
                    image.type === "url" ? "Product image" : image.value.name
                  }
                  className="sm:w-16 sm:h-16 w-full h-full object-cover rounded-md flex-shrink-0"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center gap-4">
                  <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                    {image.type === "url"
                      ? imgName || "Product image"
                      : image.value.name}
                    <br />
                    <span className="text-zinc-400">
                      {primaryImageIdx === idx
                        ? "Primary Image"
                        : "Secondary Image"}
                    </span>
                  </p>
                    {image.type === "file" && (
                    <>
                      <p className="rounded-lg px-2 py-1 w-fit text-sm dark:bg-neutral-800 dark:text-white shadow-input">
                        {(image.value.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-zinc-400 hover:text-zinc-200 text-sm cursor-pointer"
                  >
                    <CgClose />
                  </button>
                
                </div>
                {image.type === "file" && (
                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center justify-between text-neutral-400 mt-2">
                    <p className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800">
                      {image.value.type}
                    </p>
                    <p>
                      modified{" "}
                      {new Date(image.value.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {multiple && (
                  <button
                    type="button"
                    onClick={() => onSelectMainImage?.(idx)}
                    className={`mt-2 px-3 py-1 text-sm rounded-md ${
                      primaryImageIdx === idx
                        ? "bg-[#1DCD9F] text-white"
                        : "bg-gray-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {primaryImageIdx === idx
                      ? "Primary Image"
                      : "Set as Primary"}
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : defaultImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden z-30 bg-neutral-900 flex items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md shadow-sm gap-4"
          >
            <div className="mt-2 mx-auto">
              <img
                src={defaultImage}
                alt="default"
                className="sm:w-16 sm:h-16 w-full h-full object-cover rounded-md flex-shrink-0"
                loading="lazy"
              />
              </div>
              
              <div className="flex-1 w-full mt-2">
                <div className="flex justify-between items-center gap-4">
                  <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                    {imgName || "Default image"}
                    <br />
                    <span className="text-zinc-400">Current Image</span>
                  </p>
                </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </>
  );
};

export function GridPattern() {
  const columns = 30;
  const rows = 10;

  return (
    <div className="absolute inset-0 grid grid-cols-30 gap-3 opacity-10 pointer-events-none">
      {Array.from({ length: columns * rows }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 bg-white/40  rounded-full" />
      ))}
    </div>
  );
}
