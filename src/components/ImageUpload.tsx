import { useRef, useEffect, type ChangeEvent, useState } from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

const ImageUpload = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles: FileList = e.target.files;
    const imagesArr: string[] = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages(imagesArr);
    console.log(selectedImages);
  };

  useEffect(() => {
    if (modalRef.current) modalRef.current.showModal();
  }, []);

  return (
    <dialog
      ref={modalRef}
      className="mx-auto my-auto w-[95%] rounded-2xl bg-slate-200 ring-1 ring-black sm:w-1/2 "
    >
      <div className="flex flex-col p-8">
        <div className="flex items-center justify-between font-semibold">
          <p className="text-2xl">New post</p>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-gray-300 duration-300 hover:scale-105 active:scale-95"
            onClick={() => modalRef.current?.close()}
          >
            <XMarkIcon className="h-3/4 w-3/4 stroke-2" />
          </button>
        </div>

        <div className="flex flex-col gap-10 sm:flex-row">
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
              className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg ring-2 ring-black"
              onClick={() => imageInputRef.current?.click()}
            >
              <PhotoIcon className="h-8 w-8" />
              <span className="text-slate-500">Upload up to 10 images</span>
            </div>
            <button
              className="mt-auto w-full rounded-lg bg-pink-600 px-6 py-2 font-semibold text-slate-200 duration-300 hover:bg-pink-700 active:scale-95"
              onClick={() => imageInputRef.current?.click()}
            >
              Browse
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="caption" className="invisible font-medium">
              Write your post caption:
            </label>
            <textarea
              id="caption"
              name="caption"
              rows={8}
              className="rounded-lg p-3 text-lg outline-none ring-1 ring-black focus:outline-2 focus:outline-pink-600 focus:ring-0"
              placeholder="Caption your post here..."
            />
          </div>
        </div>

        <div className="ml-auto mt-6 w-max space-x-3 font-semibold">
          <button
            className="rounded-lg px-6 py-2 ring-1 ring-gray-300 duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            onClick={() => modalRef.current?.close()}
          >
            Cancel
          </button>
          <button className="rounded-lg bg-pink-600 px-6 py-2 text-slate-200 duration-300 hover:scale-105 hover:shadow-2xl active:scale-95">
            Post
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ImageUpload;
