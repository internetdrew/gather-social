import React, { useState } from "react";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useDetectClickOutside } from "react-detect-click-outside";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

interface PostOptionProps {
  postId: string;
  authorId: string;
}

const ERR_MSG =
  "Oops! I/'m having trouble deleting this post. Please try again!";

const PostOptions: React.FC<PostOptionProps> = ({ postId }) => {
  const [showPostOptions, setShowPostOptions] = useState(false);
  const ctx = api.useContext();

  const ref = useDetectClickOutside({
    onTriggered: () => setShowPostOptions(false),
  });

  const { mutate: editPost } = api.posts.edit.useMutation({});
  const { mutate: deletePostImagesFromS3 } =
    api.images.deleteFromPost.useMutation({});
  const { mutate: deletePostDataFromDB } = api.posts.delete.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAllForEvent.invalidate();
    },
    onError: () => {
      toast.error(ERR_MSG);
    },
  });

  const deletePost = (postId: string) => {
    deletePostImagesFromS3({ postId });
    deletePostDataFromDB({ postId });
  };

  return (
    <div ref={ref} className="relative z-10 ml-auto flex-shrink-0">
      <button
        className="h-6 w-6"
        onClick={() => setShowPostOptions(!showPostOptions)}
      >
        <EllipsisHorizontalIcon className="h-full w-full" />
      </button>
      <div
        className={`${
          showPostOptions ? "block" : "hidden"
        } absolute right-0 top-8 w-44 overflow-hidden rounded-md bg-famous-white font-medium ring-1 ring-black transition-all ease-in-out`}
      >
        <ul>
          <li>
            <button
              className={`flex h-full w-full items-center border-b border-famous-black p-2 duration-300 hover:bg-pink-400`}
              onClick={() => editPost({ postId })}
            >
              <PencilSquareIcon className="mr-2 h-5 w-5" />
              Edit post
            </button>
          </li>
          <li>
            <button
              className={`flex h-full w-full items-center p-2 duration-300 hover:bg-pink-400`}
              onClick={() => deletePost(postId)}
            >
              <TrashIcon className="mr-2 h-5 w-5" />
              Delete post
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PostOptions;
