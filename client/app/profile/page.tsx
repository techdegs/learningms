'use client'
import React, {FC, useState} from 'react'
import Protected from '../hooks/useProtected'
import Header from '../components/Header';
import {useSelector} from 'react-redux'
import Heading from '../utils/Heading';
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import ProfileComponent from '../components/ProfileComponent';

type Props = {}

const Profile:FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { isLoading } = useLoadUserQuery({});
  const {user} = useSelector((state:any) => state.auth)

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
      <Protected>
        <Heading
          title={`${user?.name}`}
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

        <>
          <ProfileComponent user={user} />
        </>
      </Protected>
    </>
  );
};

export default Profile