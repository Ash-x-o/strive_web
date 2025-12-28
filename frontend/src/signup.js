import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import signupBg from "./images/signup_bg.jpg";

function Signup() {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate("/login");
    }
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [signupable, setSignupable] = useState(true);

    const validation = () => {
        if(userName === "" || email === "" || password === "" || confirmPassword === "") {
            setSignupable(false);
            return;
        }
        if(password.length < 6) {
            setSignupable(false);
            return;
        }
        if(password !== confirmPassword) {
            setSignupable(false);
            return;
        }if(!email.includes("@") || !email.includes(".")) {
            setSignupable(false);
            return;
        }
        setSignupable(true);        

    }
    const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const signup = async () => {
        validation();

        if(signupable) {
            try{
                const response = await fetch(`${BACKEND_URL}/api/users/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userName : userName,
                        email : email,
                        password : password
                    })
                });
                const data = await response.json();
                if(response.ok) {
                    console.log("User registered successfully");
                    navigate("/routine");
                } else {
                    console.log("Registration failed: ", data.message);
                }
            } catch(error) {
                console.log("An error occurred: ", error);

            }
        }
            
        
    }

    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    return (
      <div className="font-display h-screen w-screen ">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed z-10 top-0 left-0 w-screen h-screen flex justify-center items-center overflow-hidden">
            <img
              src={signupBg}
              alt="Signup Background"
              className="z-10 transform scale-[2] blur-[10px] rotate-90 object-cover brightness-50"
            />
            <div
              className="absolute top-0 left-0 w-screen h-screen z-20 opacity-50"
              style={{
                background:
                  "linear-gradient(130deg, rgba(255, 255, 255, 0.6) 1%,rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.1) 50%)",
              }}
            ></div>
          </div>
          {/* Top App Bar */}
          <div className="z-20 h-screen flex flex-col items-center justify-center">
            <div className="flex items-center justify-center p-4">
              <h1 className="text-white text-2xl leading-tight tracking-tight flex-1 text-center ">
                Create Your Account
              </h1>
            </div>
            <div className="flex  flex-col justify-center px-4">
              {/* Form Fields */}
              <div className="flex flex-col gap-4 pt-6">
                {/* Full Name */}
                <label className="flex rounded-full overflow-hidden gap-2 bg-gray-500/10 backdrop-blur-[10px] justify-start items-center px-4 py-1 border border-gray-200/20 ">
                  <i className="material-symbols-outlined text-white/70 font-thin ">
                    person
                  </i>
                  <input
                    className="form-input w-full flex min-w-0 flex-1 resize-none bg-transparent overflow-hidden text-white/70 focus:outline-none ring-0 focus:ring-0 border-none focus:border-none text-sm placeholder:text-zinc-500 placeholder:font-normal text-base leading-normal"
                    placeholder="e.g., Alex Doe"
                    defaultValue=""
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onFocus={() => setSignupable(true)}
                  />
                </label>
                {/* Email */}
                <label className="flex rounded-full overflow-hidden gap-2 bg-gray-500/10 backdrop-blur-[10px] justify-start items-center px-4 py-1 border border-gray-200/20 ">
                  <i className="material-symbols-outlined text-white/70 font-thin ">
                    email
                  </i>
                  <input
                    className="form-input w-full flex min-w-0 flex-1 resize-none bg-transparent overflow-hidden text-white/70 focus:outline-none ring-0 focus:ring-0 border-none focus:border-none text-sm placeholder:text-zinc-500 placeholder:font-normal text-base leading-normal"
                    placeholder="e.g., alex.doe@email.com"
                    type="email"
                    defaultValue=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setSignupable(true)}
                  />
                </label>
                {/* Password */}
                <label className="flex rounded-full overflow-hidden gap-2 bg-gray-500/10 backdrop-blur-[10px] justify-start items-center px-4 py-1 border border-gray-200/20 ">
                  <i className="material-symbols-outlined text-white/70 font-thin ">
                    lock
                  </i>
                  <div className="flex w-full flex-1 items-stretch rounded-lg">
                    <input
                      className="form-input w-full flex min-w-0 flex-1 resize-none bg-transparent overflow-hidden text-white/70 focus:outline-none ring-0 focus:ring-0 border-none focus:border-none text-sm placeholder:text-zinc-500 placeholder:font-normal text-base leading-normal"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      defaultValue=""
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setSignupable(true)}
                    />
                    <button
                      aria-label="Toggle password visibility"
                      className="text-zinc-500 flex items-center justify-center pr-4 rounded-r-lg"
                    >
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="material-symbols-outlined text-2xl"
                      >
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </label>
                {/* Confirm Password */}
                <label className="flex rounded-full overflow-hidden gap-2 bg-gray-500/10 backdrop-blur-[10px] justify-start items-center px-4 py-1 border border-gray-200/20 ">
                  <i className="material-symbols-outlined text-white/70 font-thin ">
                    lock
                  </i>
                  <div className="flex w-full flex-1 items-stretch rounded-lg">
                    <input
                      className="form-input w-full flex min-w-0 flex-1 resize-none bg-transparent overflow-hidden text-white/70 focus:outline-none ring-0 focus:ring-0 border-none focus:border-none text-sm placeholder:text-zinc-500 placeholder:font-normal text-base leading-normal"
                      placeholder="Re-enter your password"
                      type={showConfirmPassword ? "text" : "password"}
                      defaultValue=""
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setSignupable(true)}
                    />
                    <button
                      aria-label="Toggle password visibility"
                      className="text-zinc-500 flex items-center justify-center pr-4 rounded-r-lg"
                    >
                      <span
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="material-symbols-outlined text-2xl"
                      >
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </label>
              </div>
              {/* Footer Actions */}
              <div className="py-8">
                <button
                  onClick={() => signup()}
                  className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-2 text-sm text-white font-normal text-black shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark"
                >
                  Sign Up
                </button>
                {!signupable && (
                  <p className="mt-4 text-xs text-red-500 text-center italic">
                    Signup failed. Please check your inputs.
                  </p>
                )}
                <div className="mt-6 text-center">
                  <p className="text-sm text-[#baab9c] font-thin">
                    Already have an account?
                    <a
                      onClick={handleLoginClick}
                      className="font-normal underline text-primary hover:text-primary/90"
                    >
                      Log In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Signup;