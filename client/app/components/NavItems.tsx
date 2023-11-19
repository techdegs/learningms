import React, { FC } from "react";
import Link from "next/link";

export const navItemData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Contact",
    url: "/contact",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemData &&
          navItemData.map((item, i) => (
            <Link
              href={item.url}
              key={i}
              className={`${
                activeItem === i
                  ? "dark:text-[#37a39a] text-[crimson]"
                  : "dark:text-white text-black"
              } text-[16px] p-6 font-Poppins font-[400]`}
            >
              {" "}
              {item.name}
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5 flex gap-6 flex-col">
          <div className="w-full text-center py-6">
            <Link href="/" passHref>
              <span className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}></span>
            </Link>
          </div>
          {navItemData &&
            navItemData.map((item, i) => (
              <Link passHref href={item.url} key={i}>
                <span
                  className={`${
                    activeItem === i
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black"
                  } block text-[16px] px-6 font-Poppins font-[400]`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
