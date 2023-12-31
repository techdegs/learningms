"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

interface Props {}
const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  const { isLoading } = useLoadUserQuery({});

  return (
    <>
      {
        isLoading && (
          <>
            <div className="flex justify-center items-center flex-col h-screen">
              <div className="loader"></div> 
            </div>
          </>
        )
      }
      <div>
        <Heading
          title="E-Learning"
          description="E-Learning platform built with NextJS"
          keywords="E-Learning MERN"
        />
        <Header
          open={open}
          activeItem={activeItem}
          setOpen={setOpen}
          setRoute={setRoute}
          route={route}
        />
        <Hero />
      </div>
    </>
  );
};
export default Page;
