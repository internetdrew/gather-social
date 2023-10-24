import Image from "next/image";
import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { type RouterOutputs } from "~/utils/api";
import { PostOptions } from "./";
import { useUser } from "@clerk/nextjs";

type PostsData = RouterOutputs["posts"]["getAllForEvent"];
type PostData = RouterOutputs["posts"]["getAllForEvent"][number];

interface PostProps {
  post: PostData;
  postIndex: number;
}

const Post: React.FC<PostProps> = ({ post, postIndex }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { user } = useUser();
  const userIsPostAuthor = user?.id === post?.author.id;

  if (post) {
    const goToPrevSlide = () => {
      setCurrentSlide((prev) => {
        return prev === 0 ? 0 : prev - 1;
      });
    };
    const goToNextSlide = () => {
      setCurrentSlide((prevValue) => {
        return prevValue === post.images.length - 1 ? prevValue : prevValue + 1;
      });
    };

    return (
      <div className="w-full rounded-2xl bg-slate-100 px-6 py-3 ring-1 ring-black">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar}
              alt="post author"
              className="h-9 w-9 rounded-full"
              width={200}
              height={200}
            />
            <div>
              <p className="-mb-1 font-semibold">
                {post?.author.firstName} {post?.author.lastName}
              </p>
              <p className="text-sm font-light text-slate-700">
                {dayjs().to(dayjs(post?.createdAt))}
              </p>
            </div>
            {userIsPostAuthor && (
              <PostOptions postId={post.id} authorId={post.author.id} />
            )}
          </div>
          <div className="relative mt-4 flex h-96 overflow-hidden ring-1 ring-black">
            {post?.images.map((image, imageIdx) => {
              if (image) {
                return (
                  <div
                    key={image.id}
                    className="relative flex h-full w-full flex-shrink-0 bg-slate-950 duration-300 ease-out"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    {postIndex === 0 && imageIdx === 0 ? (
                      <Image
                        src={image.url}
                        alt="images"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                      />
                    ) : (
                      <Image
                        src={image.url}
                        alt="images"
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                      />
                    )}
                  </div>
                );
              }
            })}
            <div className="absolute bottom-4 flex w-full items-center justify-center gap-2 opacity-75">
              {post.images.map((_, idx) => {
                if (post.images.length > 1)
                  return (
                    <span
                      key={idx}
                      className={`${
                        currentSlide === idx ? "h-3 w-3" : "h-2 w-2"
                      } rounded-full bg-white transition-all`}
                    ></span>
                  );
              })}
            </div>

            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-75">
              <button
                className="h-7 w-7 rounded-full bg-slate-100 p-1 duration-300 hover:scale-105 disabled:opacity-0"
                disabled={currentSlide === 0}
                aria-label="previous-slide"
                onClick={goToPrevSlide}
              >
                <ChevronLeftIcon className="h-full w-full stroke-2" />
              </button>
              <button
                className="h-7 w-7 rounded-full bg-slate-100 p-1 duration-300 hover:scale-105 disabled:opacity-0"
                disabled={currentSlide === post.images.length - 1}
                aria-label="next-slide"
                onClick={goToNextSlide}
              >
                <ChevronRightIcon className="h-full w-full stroke-2" />
              </button>
            </div>
          </div>
          <div className="mt-2">
            <p>{post?.caption}</p>
          </div>
        </div>
      </div>
    );
  }
};

const EventFeed: React.FC<{ posts: PostsData }> = ({ posts }) => {
  return (
    <div className="mx-auto mt-10 flex w-[95%] flex-col gap-6 rounded-2xl sm:w-3/4 xl:w-1/3 2xl:w-1/4">
      {posts.map((post, idx) => {
        if (post) return <Post key={post.id} post={post} postIndex={idx} />;
      })}
    </div>
  );
};

export default EventFeed;
