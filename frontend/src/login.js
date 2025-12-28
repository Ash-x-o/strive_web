import React, {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import signupBg from "./images/signup_bg.jpg";

function Login() {
    const navigate = useNavigate();
    const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const handleSignUpClick = () => {
        navigate("/signup");
    }
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [loginable,setLoginable] = useState(true);

    const handleLoginClick = async () => {
        if(email === "" || password === "") {
            setLoginable(false);
            return;
        }
        try{
            const response = await fetch(`/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email : email,
                    password : password
                }),
                credentials: "include"
            });
            const data = await response.json();
            if(response.ok) {
                console.log("Login successful");
                navigate("/routine");
            } else {
                console.log("Login failed: ", data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    }

    const [showPassword,setShowPassword] = useState(false);

    return (
      <div>
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
          <div className="z-20 flex w-full max-w-md flex-col px-4 pt-16">
            {/* Headline */}
            <h1 className="text-white tracking-light text-[32px] text-center leading-tight px-4 text-left pb-6 pt-6">
              Welcome Back
            </h1>
            {/* Email Text Field */}
            <div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
              <label className="w-full flex rounded-full overflow-hidden gap-2 bg-gray-500/10 backdrop-blur-[10px] justify-start items-center px-4 py-1 border border-gray-200/20 ">
                <i className="material-symbols-outlined text-white/70 font-thin ">
                  email
                </i>
                <div className="flex w-full flex-1 items-stretch rounded-lg">
                  <input
                    className="form-input w-full flex min-w-0 flex-1 resize-none bg-transparent overflow-hidden text-white/70 focus:outline-none ring-0 focus:ring-0 border-none focus:border-none text-sm placeholder:text-zinc-500 placeholder:font-normal text-base leading-normal"
                    placeholder="Enter your email"
                    type="email"
                    defaultValue=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setLoginable(true)}
                  />
                </div>
              </label>
            </div>
            {/* Password Text Field */}
            <div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
              <label className="w-full flex rounded-full overflow-hidden gap-2 bg-gray-500/10 backdrop-blur-[10px] justify-start items-center px-4 py-1 border border-gray-200/20 ">
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
                    onFocus={() => setLoginable(true)}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#baab9c] flex items-center justify-center pr-4"
                  >
                    <span className="material-symbols-outlined cursor-pointer">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>
              </label>
            </div>
            {/* Forgot Password Link */}
            <div className="w-full text-right px-4">
              <p className="text-[#baab9c] text-sm font-normal leading-normal pb-3 pt-2 inline-block underline cursor-pointer">
                Forgot Password?
              </p>
            </div>
            {/* Login Button */}
            <div className="flex px-4 py-6 w-full">
              <button
                onClick={() => handleLoginClick()}
                className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-2 text-sm text-white font-normal text-black shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark"
              >
                <span className="truncate">Login</span>
              </button>
              {!loginable && (
                <p className="mt-4 text-xs text-red-500 text-center italic w-full">
                  Login failed. Please check your inputs.
                </p>
              )}
            </div>
            {/* Divider */}
            {/* <div className="flex items-center gap-4 px-4 py-4">
              <div className="h-px flex-1 bg-[#393028]" />
              <p className="text-[#baab9c] text-sm font-normal">
                or continue with
              </p>
              <div className="h-px flex-1 bg-[#393028]" />
            </div> */}
            {/* Social Login Buttons */}
            {/* <div className="flex flex-col gap-4 px-4 py-3 w-full">
              <button className="flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-12 px-5 bg-[#393028] text-white text-base font-medium leading-normal">
                <img
                  alt="Google logo"
                  className="h-6 w-6"
                  data-alt="Google's 'G' logo in four colors."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy8cUrRAX-OI6oPcJM0fYazQQlRlGiueFZmdX6bOAhx4Nzyfv3m_Xf8eOE1b6Mm-Y0YB2nAPGVAJBpYHZGe9RguBVGwHIsr-KPss1T3fTuBqhiAig-1jeCwfel2dcN9ot8vT3eR07D0JeNE-u3ZesKOejuYQdNhYkeNVN1mVMdOEnplx9PFLAK5JP7Z9FmN-gpGIGJjsFR7yZYjSeDIsVmgGRAthkpUpashUYWyNegYxwHkqYHUO1C9OFpiJ6NywEdeJ8fnhFSuWD_"
                />
                <span className="truncate">Continue with Google</span>
              </button>
              <button className="flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-12 px-5 bg-white text-black text-base font-medium leading-normal">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  data-alt="Apple's solid black logo icon."
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.39 10.28C19.45 9.77 19.41 9.27 19.26 8.78C19.11 8.28 18.86 7.84 18.52 7.45C18.17 7.06 17.75 6.76 17.26 6.55C16.78 6.34 16.27 6.24 15.75 6.24C15.22 6.24 14.63 6.4 14.01 6.72C13.38 7.04 12.83 7.48 12.36 8.05C12.16 7.76 11.92 7.5 11.64 7.27C11.36 7.04 11.05 6.86 10.71 6.74C10.23 6.53 9.71 6.42 9.17 6.42C8.54 6.42 7.97 6.57 7.45 6.88C6.93 7.19 6.51 7.63 6.18 8.19C5.85 8.75 5.64 9.38 5.56 10.08C5.56 10.15 5.56 10.23 5.56 10.3C5.56 10.37 5.56 10.45 5.57 10.52L5.58 10.61C5.6 11.23 5.76 11.83 6.07 12.42C6.38 13 6.79 13.51 7.3 13.93C7.81 14.35 8.36 14.67 8.96 14.89C9.56 15.11 10.17 15.22 10.8 15.22C11.12 15.22 11.45 15.18 11.78 15.09C12.11 15 12.44 14.86 12.77 14.68C13.1 14.5 13.41 14.28 13.72 14.04C13.99 14.29 14.23 14.51 14.45 14.72C14.67 14.93 14.89 15.11 15.11 15.28C15.59 15.65 16.15 15.89 16.78 15.99C16.88 16.01 16.99 16.02 17.1 16.02C17.75 16.02 18.34 15.86 18.88 15.54C19.41 15.22 19.83 14.78 20.14 14.22C20.45 13.66 20.61 13.04 20.62 12.36C20.62 11.96 20.57 11.57 20.46 11.17C20.35 10.77 20.17 10.42 19.93 10.12C19.81 10.2 19.69 10.26 19.56 10.3C19.49 10.32 19.44 10.3 19.39 10.28ZM15.16 5.2C15.08 4.71 14.89 4.28 14.58 3.91C14.28 3.54 13.88 3.28 13.39 3.14C13.26 3.32 13.11 3.53 12.94 3.77C12.77 4.01 12.59 4.28 12.4 4.58C12.55 4.6 12.7 4.62 12.85 4.65C13.33 4.72 13.78 4.88 14.2 5.12C14.63 5.36 14.96 5.68 15.19 6.07C15.19 5.78 15.18 5.49 15.16 5.2Z" />
                </svg>
                <span className="truncate">Continue with Apple</span>
              </button>
            </div> */}
            {/* Sign Up Link */}
            <div className="flex items-center justify-center pb-12">
              <p className="text-[#baab9c] text-sm font-thin">
                Don't have an account?{" "}
                <a
                  onClick={handleSignUpClick}
                  className="text-sm text-primary font-normal underline"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Login;