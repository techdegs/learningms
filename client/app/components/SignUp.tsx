import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
  AiFillGoogleCircle,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  route: string
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your full name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
});

const SignUp: FC<Props> = ({ setRoute, route }) => {
  const [show, setShow] = useState(false);
  const [register, {isSuccess, data, error}] = useRegisterMutation()

  useEffect(() => {
    if(isSuccess){
      const message = data?.message || "Registration successful";
      toast.success(message)
      setRoute("Verification")
    }
    if(error){
      if("data" in error){
        const errorData = error as any;
        toast.error(errorData.data.message)
      }
    }
  },[isSuccess, error])

  const formik = useFormik({
    initialValues: {name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({name, email, password }) => {
      const data = {
        name, email, password
      }
      await register(data)
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full ">
      <h1 className={`${styles.title}`}>Sign Up with E-Learning</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className={`${styles.label}`}>
          Enter your full name
        </label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          id="name"
          placeholder="Enter your full name"
          className={`${errors.name && touched.name && "border-red-500"} ${
            styles.input
          } `}
        />
        {errors.name && touched.name && (
          <span className="text-red-500 pt-2 block">{errors.name}</span>
        )}
        <div className="w-full mt-5 mb-1">
          <div className="mb-5 relative">
            <label htmlFor="email" className={`${styles.label}`}>
              Enter your Email
            </label>
            <input
              type={"text"}
              name="email"
              id="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              className={`${
                errors.email && touched.email && "border-red-500"
              } ${styles.input} `}
            />
            {errors.email && touched.email && (
              <span className="text-red-500 pt-2 block">{errors.email}</span>
            )}
          </div>
          <div className="relative">
            <label htmlFor="password" className={`${styles.label}`}>
              Enter your password
            </label>
            <input
              type={!show ? "password" : "text"}
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              className={`${
                errors.password && touched.password && "border-red-500"
              } ${styles.input} `}
            />

            <div className="absolute bottom-3 right-2 z-1 cursor-pointer">
              {!show ? (
                <>
                  <AiOutlineEyeInvisible
                    
                    size={20}
                    onClick={() => setShow(true)}
                  />
                </>
              ) : (
                <>
                  <AiOutlineEye
                    
                    size={20}
                    onClick={() => setShow(false)}
                  />
                </>
              )}
            </div>
            
          </div>
          {errors.password && touched.password && (
              <span className="text-red-500 pt-2 block">{errors.password}</span>
            )}
        </div>
        <br />
        <div className="w-full mt-5">
          <input type="submit" value="Sign Up" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white ">
          Or Join With
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Already have any account?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default SignUp;
