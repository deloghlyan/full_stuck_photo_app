import React from "react";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { FcGoogle } from "react-icons/fc";

import { GoogleLogin } from "@react-oauth/google";

import jwt_decode from "jwt-decode";
import { client } from "../client";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    console.log(jwt_decode(response.credential));

    const profileObj = jwt_decode(response.credential);

    localStorage.setItem("user", JSON.stringify(profileObj));
 
    const { name, sub, picture } = profileObj;

    const doc = {
      _type: "user",
      _id: sub,
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          controlls="false"
          loop
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width={130} alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" />
                  Sign in with Google
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
