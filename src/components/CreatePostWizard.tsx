import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  type ChangeEvent,
  type ForwardRefRenderFunction,
  useState,
} from "react";
import { XMarkIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

interface PostWizardProps {
  eventId: string;
}

export interface PostWizardRef {
  openModal: () => void;
  closeModal: () => void;
}

const CreatePostWizard: ForwardRefRenderFunction<
  PostWizardRef,
  PostWizardProps
> = ({ eventId }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [caption, setCaption] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [compressedImagesForUI, setCompressedImagesForUI] = useState<string[]>(
    []
  );
  const [imageFileMapping, setImageFileMapping] = useState<
    Record<string, File>
  >({});

  const openModal = () => {
    if (modalRef.current) modalRef.current.showModal();
  };

  const closeModal = () => {
    if (modalRef.current) modalRef.current.close();
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  const ctx = api.useContext();

  const {
    mutateAsync: createPost,
    isLoading: isPosting,
    isSuccess: isPosted,
  } = api.posts.create.useMutation({
    onError: () => {
      toast.error("Error creating post. Please try again later.");
    },
  });

  const { user } = useUser();

  const { mutateAsync: createPresignedUrl } =
    api.images.createPresignedUrlAndSaveImagesToDB.useMutation({});

  const MAX_IMAGE_COUNT = 6;

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
              setImageFiles((prevFiles) => [...prevFiles, compressedFile]);
              const compressedImageUrl = URL.createObjectURL(compressedFile);

              setImageFileMapping((prevMapping) => ({
                ...prevMapping,
                [compressedImageUrl]: file,
              }));

              return compressedImageUrl;
            } catch (error) {
              console.error("Image compression error:", error);
              throw error;
            }
          })
        );

        setCompressedImagesForUI((prevImages) =>
          prevImages.concat(compressedImagesArr)
        );
      } catch (error) {
        console.error(error);
      }
    };

    void compressAndSetImages(e.target.files);
  };

  const handleDelete = (compressedImageUrl: string) => {
    // Use the compressed image URL to identify the original file
    const originalFile = imageFileMapping[compressedImageUrl];

    // Remove the original file from the imageFiles state
    setImageFiles((prevFiles) =>
      prevFiles.filter((file) => file !== originalFile)
    );

    // Remove the compressed image URL from the UI state
    setCompressedImagesForUI((prevImages) =>
      prevImages.filter((imageUrl) => imageUrl !== compressedImageUrl)
    );
  };

  const handleSubmit = async () => {
    if (!user || !imageFiles) return;
    const fileNames = imageFiles.map((image) => image.name);

    try {
      const post = await createPost({
        eventId,
        caption: caption.trim().length > 0 ? caption : null,
        userId: user.id,
      });

      if (!post?.id) return;

      const presignedUrls = await createPresignedUrl({
        eventId,
        fileNames: fileNames,
        postId: post.id,
      });
      for (const [idx, imageFile] of imageFiles.entries()) {
        await fetch(`${presignedUrls[idx]}`, {
          method: "PUT",
          body: imageFile,
        });
      }

      if (modalRef.current) modalRef.current.close();
      await ctx.posts.getAllForEvent.invalidate();
      window.scrollTo({ top: 0, behavior: "smooth" });
      compressedImagesForUI.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      setCaption("");
      setImageFiles([]);
      setCompressedImagesForUI([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <dialog
      ref={modalRef}
      className="no-scrollbar mx-auto my-auto w-[95%] rounded-2xl bg-slate-100 ring-1 ring-black sm:w-[60%] md:w-1/2 xl:w-1/3"
    >
      <div className="flex flex-col pb-6">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-100 px-10 py-6 font-semibold">
          <p className="text-2xl">New post</p>
          <button
            className="flex items-center justify-center rounded-md duration-300 hover:scale-105 active:scale-95"
            onClick={() => modalRef.current?.close()}
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>
        <div className="px-10">
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
                disabled={isPosting}
              />
              <div
                className="mb-1 flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400"
                onClick={() => imageInputRef.current?.click()}
              >
                <PhotoIcon className="h-8 w-8 text-gray-500" />
                <span className="text-gray-500">
                  {`Choose up to ${MAX_IMAGE_COUNT} images to post`}
                </span>
              </div>
              <button
                className="mt-auto w-full rounded-lg bg-pink-400 px-6 py-2 font-semibold text-black ring-1 ring-black duration-300 hover:bg-pink-500 active:scale-95"
                disabled={isPosting}
                onClick={() => imageInputRef.current?.click()}
              >
                Browse
              </button>
            </div>
            <div className="my-4 space-y-4">
              {compressedImagesForUI.length
                ? compressedImagesForUI.map((image, idx) => (
                    <div key={image} className="relative">
                      <Image
                        alt={`image-${idx}`}
                        src={image}
                        width={90}
                        height={90}
                        loading="lazy"
                        className="h-auto w-auto rounded-md shadow-xl"
                      />
                      <button
                        className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 p-2 duration-300 hover:bg-red-600 sm:h-8 sm:w-8"
                        onClick={() => handleDelete(image)}
                      >
                        <TrashIcon className="h-full w-full" />
                      </button>
                    </div>
                  ))
                : null}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor="caption" className="invisible font-medium">
                Post caption:
              </label>
              <textarea
                id="caption"
                name="caption"
                rows={4}
                className="rounded-lg p-3 text-lg outline outline-gray-400 focus:outline-2 focus:outline-pink-400 focus:ring-0"
                placeholder="Caption your post here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <small className="text-red-600">
                {compressedImagesForUI.length > MAX_IMAGE_COUNT
                  ? `Please delete at least ${
                      compressedImagesForUI.length - MAX_IMAGE_COUNT
                    } photo${
                      compressedImagesForUI.length - MAX_IMAGE_COUNT > 1
                        ? "s"
                        : ""
                    } to be able to post.`
                  : null}
              </small>
            </div>
          </div>

          <div className="ml-auto mt-6 flex w-full flex-col items-center justify-center gap-4 font-semibold sm:flex-row sm:gap-6">
            <button
              className="w-full rounded-lg px-6 py-2 text-slate-600 ring-1 ring-gray-400 duration-300 hover:text-black hover:shadow-2xl hover:ring-gray-500 active:scale-95"
              onClick={() => modalRef.current?.close()}
            >
              Cancel
            </button>
            <button
              className="w-full rounded-lg bg-pink-400 px-6 py-2 text-black ring-1 ring-black duration-300 hover:scale-105 hover:bg-pink-600 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-gray-700 disabled:ring-0 disabled:hover:scale-100"
              disabled={
                !compressedImagesForUI.length ||
                compressedImagesForUI.length > MAX_IMAGE_COUNT ||
                isPosting ||
                isPosted
              }
              onClick={() => void handleSubmit()}
            >
              {isPosting ? "Posting..." : isPosted ? "Posted" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default forwardRef(CreatePostWizard);
