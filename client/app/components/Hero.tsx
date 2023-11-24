import React from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="w-full 1000px:flex items-center p-[3rem]">
      <div className="hero_animation mb-6">
        <Image
          alt="hero"
          src="/images/banner-img-1.png"
          width={1200}
          height={1000}
        />
      </div>
      <div className="">
        <div className="">
          <h2 className="text-[30px] font-bold dark:text-white text-black">
            Improve Your Online Learning Experience better Instantly
          </h2>
          <p className="dark:text-white text-black">
            We have 40k+ oline courses and 500k+ online registered students.
            Find your desired courses from here.
          </p>
          <Link href="/courses" passHref>
            View Course{" "}
          </Link>
        </div>
        <div className="flex items-center bg-slate-200 mt-5 rounded-md">
          <input
            className="flex flex-1 p-2 rounded-md dark:text-white text-black border border-gray-300"
            type="search"
            placeholder="Search Courses"
          />
          <button className="p-2 dark:bg-white text-black">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
