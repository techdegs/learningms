"use client";
import React, { FC, useState } from "react";
import SidebarProfile from "./SidebarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

type Props = { user: any };

const ProfileComponent: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const[active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);

  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true: false
  })

  const logoutHandler = async () => {
    await signOut();
    setLogout(true)
    //redirect("/")
  }

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <div className="w-85% flex mx-auto px-16">
      <div
        className={`w-[60px] 800px:w-[310px] dark:bg-slate-900 bg-white h-[450px] bg-opacity-90 border dark:border-[#ffffff1d] border-[#fff] rounded-md shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SidebarProfile user={user} active={active} avatar={avatar} setActive={setActive} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default ProfileComponent;
