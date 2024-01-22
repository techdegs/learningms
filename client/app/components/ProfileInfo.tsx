import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "../styles/style";
import {
  useUpdateAvatarMutation,
  useUpdateUserInfoMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = { avatar: string | null; user: any };

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user?.email);
  const [userId, setUserId] = useState(user && user._id)
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  const [updateUserInfo, {isSuccess: infoSuccess, error: infoError }] =
    useUpdateUserInfoMutation();

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };

    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if(user){
      const id = user._id 
      setUserId(id)
    }
    if (isSuccess || infoSuccess) {
      setLoadUser(true);
    }
    if (error || infoError) {
      console.log(error);
    }
  }, [isSuccess, error, infoSuccess, infoError, user]);

  let newEmail;
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (userId === "" || userId === undefined)
      return toast.error("Something went wrong. Try again Later ");
    if (user?.email === "" || user?.email === undefined) {
      newEmail = email;
    } else {
      newEmail = user?.email;
    }

    await updateUserInfo({ name: name, email: user?.email});

  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={
              user?.avatar || avatar
                ? user?.avatar.url || avatar
                : "/images/avatar.png"
            }
            width={100}
            height={100}
            alt="avatar"
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full bg-contain "
          />
          <input
            type="file"
            name="avatar"
            id="avatar"
            required
            onChange={imageHandler}
            className="hidden"
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer ">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>

      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2" htmlFor="fullname">
                Full Name
              </label>
              <input
                type="text"
                className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="w-[100%] mt-4">
              <label className="block pb-2" htmlFor="fullname">
                Email Address
              </label>
              {user?.email === undefined || user?.email === "" ? (
                <input
                  type="email"
                  className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  readOnly={true}
                  className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
                  required
                  value={user?.email}
                />
              )}
            </div>

            <input
              className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
              value="Update"
              type="Submit"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;
