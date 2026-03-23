"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const Twitter = ({ className, ...props }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <g>
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path>
    </g>
  </svg>
);

interface TweetCardProps {
  name: string;
  handle: string;
  avatar: string;
  text: string;
  image?: string;
  className?: string;
}

export function TweetCard({
  name,
  handle,
  avatar,
  text,
  image,
  className,
}: TweetCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-fit w-full max-w-sm flex-col gap-3 overflow-hidden rounded-xl border border-[#D2D2D2] bg-white p-4 shadow-sm",
        className
      )}
    >
      <div className="flex flex-row items-start justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src={avatar}
            alt={name}
            width={40}
            height={40}
            className="rounded-full border border-gray-200"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{name}</span>
            <span className="text-xs text-gray-500">@{handle}</span>
          </div>
        </div>
        <Twitter className="h-4 w-4 text-gray-400" />
      </div>
      
      <p className="text-sm leading-relaxed text-gray-800">{text}</p>
      
      {image && (
        <div className="relative mt-1 overflow-hidden rounded-lg">
          <Image
            src={image}
            alt="Tweet image"
            width={400}
            height={200}
            className="w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
