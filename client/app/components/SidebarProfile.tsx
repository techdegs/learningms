import Image from "next/image";
import React, { FC } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { GiBookshelf } from "react-icons/gi";
import { LiaCertificateSolid } from "react-icons/lia";
import { AiOutlineLogout } from "react-icons/ai";
import { useTheme} from "next-themes";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SidebarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
    const { setTheme, theme } = useTheme()
  return (
    <div className="w-full">
      <div
        className={`w-full flex font-semibold items-center px-3 py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          className="w-[20px] h-[20px] 800px:h-[30px] 800px:w-[30px] cursor-pointer rounded-full "
          src={
            user?.avatar || avatar
              ? user?.avatar || avatar
              : "/images/avatar.png"
          }
          alt=""
          width={100}
          height={100}
        />
        <h5 className="pl-2 800px:block hidden font-Poppins text-black dark:text-white">
          My Account
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 2 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} color={theme === "light" ? "black" : "white"} />
        <h5 className="pl-2 800px:block hidden text-black dark:text-white font-Poppins ">
          Change Password
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <GiBookshelf size={20} color={theme === "light" ? "black" : "white"}  />
        <h5 className="pl-2 800px:block hidden text-black dark:text-white font-Poppins ">
          Enrolled Courses
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 4 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => setActive(4)}
      >
        <LiaCertificateSolid size={20} color={theme === "light" ? "black" : "white"}  />
        <h5 className="pl-2 800px:block hidden text-black dark:text-white font-Poppins ">
          Course Certificates
        </h5>
      </div>

      <div className="flex flex-col justify-center mx-auto">
        <div
          className={`w-full mt-5 flex items-center px-3 py-4 cursor-pointer ${
            active === 5 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
          }`}
          onClick={() => logoutHandler()}
        >
          <AiOutlineLogout size={20} color="red" />
          <h5 className="pl-2 800px:block hidden text-black dark:text-white font-Poppins ">
            Logout
          </h5>
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;
