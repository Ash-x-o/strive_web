import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./routine";
import RoutineCardImage from "./images/routine_card.jpg";
import PrgressCardImage from "./images/progress_card.jpg";
import BoxingCardImage from './images/boxing_card.jpg'
import MealCardImage from './images/meal_card.jpg'

function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/users/check-session`, {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
            console.log("Session check successful:", data.loggedIn);
          } else {
            navigate("/login");
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

    const getProfilePic = () => {
        if (user && user.profilePic) {
            return '/uploads/' + user.profilePic;
        }else{
            return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
        }
    };

    return (
      <div className="relative font-display p-5 bg-bg-dark text-white h-screen">
        <div className="flex flex-col justify-between w-full p-4 mt-4 items-center">
          <div className="w-full flex">
            <div className="flex items-center gap-4 w-full ">
                <img src={getProfilePic()} alt="Welcome" className="w-8 h-8 object-cover rounded-full" />
                <div className="flex flex-col">
                <span className="text-gray-500/50 text-xs">Let's Get Back</span>
                <span className="text-sm">{user?.userName}</span>
                </div>
            </div>
            <div>
                <i className="fa-jelly fa-regular fa-bell text-white "></i>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2">
                <div onClick={() => navigate('/routine')} className="relative bg-card-dark rounded-lg m-2 w-36 h-36 rounded text-center">
                    <h2 className="absolute  bottom-2 left-2 text-lg">Workout</h2>
                    <img src={RoutineCardImage} alt="Routine Icon" className="w-full h-full rounded object-cover mx-auto "/>
                </div>
                 <div onClick={() => navigate('/progress_stats')} className="relative bg-card-dark rounded-lg m-2 w-36 h-36 rounded text-center">
                    <h2 className="absolute  bottom-2 left-2 text-lg">Progress</h2>
                    <img src={PrgressCardImage} alt="Routine Icon" className="w-full h-full rounded object-cover mx-auto "/>
                </div>
                <div onClick={() => navigate('/boxing')} className="relative bg-card-dark rounded-lg m-2 w-36 h-36 rounded text-center">
                    <h2 className="absolute  bottom-2 left-2 text-lg">Sports</h2>
                    <img src={BoxingCardImage} alt="Routine Icon" className="w-full h-full rounded object-cover mx-auto "/>
                </div>
                <div onClick={() => navigate('/meal')} className="relative bg-card-dark rounded-lg m-2 w-36 h-36 rounded text-center">
                    <h2 className="absolute  bottom-2 left-2 text-lg">Meal Plan</h2>
                    <img src={MealCardImage} alt="Routine Icon" className="w-full h-full rounded object-cover mx-auto "/>
                </div>
                
            </div>

          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full flex justify-between items-center">
            <NavBar />
        </div>
      </div>
    );
}

export default Home;