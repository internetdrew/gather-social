import { useRef, useEffect, type ChangeEvent, useState } from "react";
import { XMarkIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { api } from "~/utils/api";

const ImageUpload = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [caption, setCaption] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const compressAndSetImages = async (files: FileList) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
      };

      try {
        const compressedImagesArr = await Promise.all(
          Array.from(files).map(async (file) => {
            try {
              const compressedFile = await imageCompression(file, options);
              return URL.createObjectURL(compressedFile);
            } catch (error) {
              console.error("Image compression error:", error);
              throw error;
            }
          })
        );

        setSelectedImages((prevImages) =>
          prevImages.concat(compressedImagesArr)
        );
      } catch (error) {
        console.error(error);
      }
    };

    void compressAndSetImages(e.target.files);
  };

  const handleDelete = (indexToRemove: number) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, idx) => idx !== indexToRemove)
    );
  };

  useEffect(() => {
    if (modalRef.current) modalRef.current.showModal();
  }, []);

  return (
    <dialog
      ref={modalRef}
      className="mx-auto my-auto w-[95%] rounded-2xl bg-slate-100 ring-1 ring-black sm:w-[60%] md:w-1/2 xl:w-1/3"
    >
      <div className="flex flex-col px-10 py-6">
        <div className="flex items-center justify-between font-semibold">
          <p className="text-2xl">New post</p>
          <button
            className="flex items-center justify-center rounded-md duration-300 hover:scale-105 active:scale-95"
            onClick={() => modalRef.current?.close()}
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="image-input" className="invisible">
              Choose your photos
            </label>
            <input
              ref={imageInputRef}
              type="file"
              id="image-input"
              name="image-input"
              onChange={onFileSelect}
              multiple
              accept="image/jpeg, image/png"
              className="hidden"
            />
            <div
              className="mb-1 flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400"
              onClick={() => imageInputRef.current?.click()}
            >
              <PhotoIcon className="h-8 w-8 text-gray-500" />
              <span className="text-gray-500">
                Choose up to 10 images to post
              </span>
            </div>
            <button
              className="mt-auto w-full rounded-lg bg-pink-600 px-6 py-2 font-semibold text-slate-200 duration-300 hover:bg-pink-700 active:scale-95"
              onClick={() => imageInputRef.current?.click()}
            >
              Browse
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {selectedImages.length
              ? selectedImages.map((image, idx) => (
                  <div key={image} className="relative">
                    <Image
                      alt={`image-${idx}`}
                      src={image}
                      width={90}
                      height={90}
                      loading="lazy"
                      className="h-auto w-auto"
                    />
                    <button
                      className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 p-2"
                      onClick={() => handleDelete(idx)}
                    >
                      <TrashIcon className="h-full w-full" />
                    </button>
                  </div>
                ))
              : null}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="caption" className="invisible font-medium">
              Write your post caption:
            </label>
            <textarea
              id="caption"
              name="caption"
              rows={4}
              className="rounded-lg p-3 text-lg outline-none ring-1 ring-black focus:outline-2 focus:outline-pink-600 focus:ring-0"
              placeholder="Caption your post here..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <small className="text-red-600">
              {selectedImages.length > 10
                ? `Please delete at least ${selectedImages.length - 10} photo${
                    selectedImages.length - 10 > 1 ? "s" : ""
                  } to be able to post.`
                : null}
            </small>
          </div>
        </div>

        <div className="ml-auto mt-6 w-max space-x-3 font-semibold">
          <button
            className="rounded-lg px-6 py-2 text-slate-600 ring-1 ring-gray-300 duration-300 hover:text-slate-800 hover:shadow-2xl active:scale-95"
            onClick={() => modalRef.current?.close()}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-pink-600 px-6 py-2 text-slate-200 duration-300 hover:bg-pink-700 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={selectedImages.length > 10}
          >
            Post
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ImageUpload;
