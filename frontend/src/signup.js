import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

        

    return (
        <div className="font-display">
            <div className="relative flex h-auto min-h-screen w-full flex-col bg-bg-dark group/design-root overflow-x-hidden">
                {/* Top App Bar */}
                <div className="flex items-center p-4">
                    <div className="text-white flex size-12 shrink-0 items-center justify-start">
                    <span className="material-symbols-outlined text-2xl">
                        arrow_back_ios_new
                    </span>
                    </div>
                    <h1 className="text-white text-xl font-bold leading-tight tracking-tight flex-1 text-center -ml-12">
                    Create Your Account
                    </h1>
                </div>
                <div className="flex flex-1 flex-col justify-between px-4">
                    {/* Form Fields */}
                    <div className="flex flex-col gap-4 pt-6">
                    {/* Full Name */}
                    <label className="flex flex-col">
                        <p className="text-white/80 text-base font-medium leading-normal pb-2">
                        Full Name
                        </p>
                        <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 border-none bg-zinc-800/60 focus:ring-2 focus:ring-primary h-14 placeholder:text-zinc-500 p-4 text-base font-normal leading-normal"
                        placeholder="e.g., Alex Doe"
                        defaultValue=""
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onFocus={() => setSignupable(true)}
                        />
                    </label>
                    {/* Email */}
                    <label className="flex flex-col">
                        <p className="text-white/80 text-base font-medium leading-normal pb-2">
                        Email
                        </p>
                        <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 border-none bg-zinc-800/60 focus:ring-2 focus:ring-primary h-14 placeholder:text-zinc-500 p-4 text-base font-normal leading-normal"
                        placeholder="e.g., alex.doe@email.com"
                        type="email"
                        defaultValue=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setSignupable(true)}
                        />
                    </label>
                    {/* Password */}
                    <label className="flex flex-col">
                        <p className="text-white/80 text-base font-medium leading-normal pb-2">
                        Password
                        </p>
                        <div className="flex w-full flex-1 items-stretch rounded-lg bg-zinc-800/60 focus-within:ring-2 focus-within:ring-primary">
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-14 placeholder:text-zinc-500 p-4 pr-2 text-base font-normal leading-normal"
                            placeholder="Enter your password"
                            type="password"
                            defaultValue=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setSignupable(true)}
                        />
                        <button
                            aria-label="Toggle password visibility"
                            className="text-zinc-500 flex items-center justify-center pr-4 rounded-r-lg"
                        >
                            <span className="material-symbols-outlined text-2xl">
                            visibility_off
                            </span>
                        </button>
                        </div>
                    </label>
                    {/* Confirm Password */}
                    <label className="flex flex-col">
                        <p className="text-white/80 text-base font-medium leading-normal pb-2">
                        Confirm Password
                        </p>
                        <div className="flex w-full flex-1 items-stretch rounded-lg bg-zinc-800/60 focus-within:ring-2 focus-within:ring-primary">
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-14 placeholder:text-zinc-500 p-4 pr-2 text-base font-normal leading-normal"
                            placeholder="Re-enter your password"
                            type="password"
                            defaultValue=""
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setSignupable(true)}
                        />
                        <button
                            aria-label="Toggle password visibility"
                            className="text-zinc-500 flex items-center justify-center pr-4 rounded-r-lg"
                        >
                            <span className="material-symbols-outlined text-2xl">
                            visibility_off
                            </span>
                        </button>
                        </div>
                    </label>
                    </div>
                    {/* Footer Actions */}
                    <div className="py-8">
                    <button onClick={() => signup()} className="flex w-full items-center justify-center rounded-lg bg-primary h-14 px-6 text-base font-bold text-black shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark">
                        Sign Up
                    </button>
                    {!signupable && (
                        <p className="mt-4 text-xs text-red-500 text-center italic">
                        Signup failed. Please check your inputs.
                        </p>
                    )}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-400">
                        Already have an account?
                        <a  
                            onClick={handleLoginClick}
                            className="font-semibold text-primary hover:text-primary/90"
                        >
                            Log In
                        </a>
                        </p>
                    </div>
                    </div>
                </div>
                </div>

        </div>
    )
};

export default Signup;