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

type PostsData = RouterOutputs["posts"]["getAllForEvent"];
type PostData = RouterOutputs["posts"]["getAllForEvent"][number];

const Post: React.FC<{ post: PostData }> = ({ post }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  if (post) {
    const prevSlide = () => {
      setCurrentSlide((prev) => {
        return prev === 0 ? 0 : prev - 1;
      });
    };
    const nextSlide = () => {
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
            <button className="ml-auto text-slate-700">
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="relative mt-4 min-h-min overflow-hidden ring-1 ring-black">
            <div className="relative flex h-full w-full items-center bg-black">
              {post?.images.map((image) => (
                <div
                  key={image.id}
                  className="relative flex h-full w-full flex-shrink-0 duration-300 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <Image
                    src={image.signedUrl}
                    height={500}
                    width={500}
                    alt="images"
                    loading="lazy"
                    className="mx-auto my-auto h-full w-full object-cover"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
              <div className="absolute bottom-4 flex w-full items-center justify-center gap-2">
                {post.images.map((_, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`${
                        currentSlide === idx ? "h-3 w-3" : "h-2 w-2"
                      } rounded-full bg-white transition-all`}
                    ></div>
                  );
                })}
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                className="h-7 w-7 rounded-full bg-slate-100 p-1 duration-300 hover:scale-105 disabled:opacity-0"
                disabled={currentSlide === 0}
                onClick={prevSlide}
              >
                <ChevronLeftIcon className="h-full w-full stroke-2" />
              </button>
              <button
                className="h-7 w-7 rounded-full bg-slate-100 p-1 duration-300 hover:scale-105 disabled:opacity-0"
                disabled={currentSlide === post.images.length - 1}
                onClick={nextSlide}
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
    <div className="mx-auto mt-10 flex w-[95%] flex-col gap-6 rounded-2xl sm:w-1/2 xl:w-1/3">
      {posts.map((post) => {
        if (post) return <Post key={post.id} post={post} />;
      })}
    </div>
  );
};

export default EventFeed;
