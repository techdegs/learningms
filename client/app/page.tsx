"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";

interface Props {}
const Page: FC<Props> = (props) => {
  return (
    <div>
      <Heading
        title="E-Learning"
        description="E-Learning platform built with NextJS"
        keywords="E-Learning MERN"
      />
     <p className="text-gray-900">here we go again</p>
    </div>
  );
};
export default Page;
