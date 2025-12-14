import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GetStarted() {
    const navigate = useNavigate();
    const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const [user, setUser] = useState(null);
    useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/users/check-session`, {
                        method: "GET",
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (response.ok) {
                        if(data.user){
                            navigate('/routine');
                            console.log("Session check successful:", data.user.userName);
                        }
                    } else {
                        navigate('/login');
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                    // navigate('/login');
                }
            };
    
            fetchUserData();
        }, []);

    const handleLoginClick = () => {
        navigate("/login");
    }

    const handleSignUpClick = () => {
        navigate("/signup");
    }
    

    return (
        <div className="bg-bg-light dark:bg-bg-dark font-display">
            <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden">
                {/* Background Image with Gradient Overlay */}
                <div
                    className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
                    data-alt="Athlete in a dark gym lifting weights"
                    style={{
                    backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4XFddion9rckoThjJOoA8ocdVDzOPzqu5Gp4uMdb3HYMYNhc6zMS4-StUS5uQRRZ_MBFii4_ZeEixqF-d-gs9kYFcR-2clEbYYFqwd4Hx2fLCgKud4wLUfNkUHwNZuwiYoK3Z86QtQiJbqgB6-CD3BDU8iVaE_dJEzjodTMiCG5JUSYvSfoRVkJ8XFOZ-BY7cF0mt0xhF0ktFc8tk8ezwPy9n6Sg5CxiS_bNVuuEm_p9viNTgufhSfbXpuVBd-17GLfg3R7OkHmU9")'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full p-6">
                    {/* App Logo/Title (Top) */}
                    <div className="flex-shrink-0 flex justify-center pt-8">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-white text-3xl">
                        fitness_center
                        </span>
                        <h1 className="text-2xl font-bold text-white tracking-wider">
                        FITFLOW
                        </h1>
                    </div>
                    </div>
                    {/* Spacer */}
                    <div className="flex-grow" />
                    {/* Button Group (Bottom) */}
                    <div className="flex-shrink-0 pb-8">
                    <div className="flex flex-col items-stretch gap-4 w-full max-w-md mx-auto">
                        <button onClick={handleSignUpClick} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-background-dark text-lg font-bold leading-normal tracking-[0.015em] w-full transition-opacity hover:opacity-90 active:opacity-80">
                        <span className="truncate">Sign Up</span>
                        </button>
                        <button onClick={handleLoginClick} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-transparent border-2 border-primary text-primary text-lg font-bold leading-normal tracking-[0.015em] w-full transition-colors hover:bg-primary/10 active:bg-primary/20">
                        <span className="truncate">Log In</span>
                        </button>
                    </div>
                    </div>
                </div>
                </div>

        </div>
    )
};

export default GetStarted;