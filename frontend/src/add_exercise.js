import React, { use, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddExercise() {
    const navigate = useNavigate();
    const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/users/check-session`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    if(data.user.role === "admin"){
                        setUser(data.user);
                        console.log("Session check successful:", data.user.userName);
                    }else{
                        alert("Access denied. Admins only.");
                        navigate('/routine');
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

    const [exerciseName, setExerciseName] = useState("");
    const [equipment, setEquipment] = useState("");
    const [exerciseImage, setExerciseImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!exerciseName || !exerciseImage) {
            alert("Please fill in all fields and select an image.");
            return;
        }
        const formData = new FormData();
        formData.append("exName", exerciseName);
        formData.append("exImage", exerciseImage);
        formData.append("equipment", equipment);
        try {
            const response = await fetch(`${BACKEND_URL}/api/exercises/add`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Exercise added successfully");
                setAllExercises([...allExercises, data.exercise]);
                setFilteredExercises([...filteredExcercises, data.exercise]);
                setExerciseName("");
                setEquipment("");
                setExerciseImage(null);
            } else {
                console.log("Failed to add exercise: ", data.message);
            }
        } catch (error) {
            console.error("Error adding exercise:", error);
        }
    };

    const [allExercises, setAllExercises] = useState([]);

    

    const [searchReq, setSearchReq] = useState("");
    const [filteredExcercises, setFilteredExercises] = useState([]);

    const exInitRef = useRef(true);

    

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/exercises/get-all`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Exercises fetched successfully");                    
                    setAllExercises(data.exercises);
                }
            } catch (error) {
                console.error("Error fetching exercises:", error);
            }
        };

        fetchExercises();
    }, []);
    
    useEffect (() => {
        if(exInitRef.current && allExercises && allExercises.length > 0) {
            setFilteredExercises(allExercises);
            exInitRef.current = false;
            return;
        }
    }, [allExercises]);

    useEffect(() => {
        if(!allExercises || searchReq === "") return;
        const results = allExercises.filter(exercise =>
            exercise.exName.toLowerCase().includes(searchReq.toLowerCase())
        );
        setFilteredExercises(results);
    }, [searchReq, user, exerciseName, equipment, exerciseImage]);

    const getIcon = (equipment) => {
        if(!equipment) return "help_outline";
        switch(equipment.toLowerCase()) {
            case "dumbbell":
                return "fitness_center";
            case "barbell":
                return "exercise";
            default:
                return "help_outline";
        }
    };

    const getImageUrl = (exImage) => {
        if(typeof exImage === 'string'){
            return `${BACKEND_URL}/uploads/${exImage}`
        }else{
            return URL.createObjectURL(exImage);
        }
    };
    return (
        <div className="bg-bg-dark w-screen h-screen overflow-y-auto flex flex-col items-center p-4">
            
            <form onSubmit={handleSubmit} className="p-4 flex flex-col text-white border border-gray-100 rounded-lg shadow-lg">
                <h1 >Add Exercise</h1>
                <label>Exercise Name</label>
                <input value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} type="text" className="text-sm bg-gray-500/10 border border-gray-500/10 outline-none focus:outline-none focus:ring-0 focus:border-gray-500/30 rounded-md" />
                <label>Equipment</label>
                <input value={equipment} onChange={(e) => setEquipment(e.target.value)} type="text" className="text-sm bg-gray-500/10 border border-gray-500/10 outline-none focus:outline-none focus:ring-0 focus:border-gray-500/30 rounded-md" />
                <label>Exercise Image</label>
                <input onChange={(e) => setExerciseImage(e.target.files[0])} type="file" className="" />
                <img src={exerciseImage ? URL.createObjectURL(exerciseImage) : ""} alt="" className="w-32 h-32 rounded object-cover mt-2 mb-4"/>
                <button type="submit" className="mt-4 bg-primary text-background-dark px-4 py-2 rounded-md hover:bg-primary/90 active:bg-primary/80">Add Exercise</button>
            </form>
            <div className="text-white w-full">
                <h2 >Search Exercises</h2>
                <div className="mt-2">
                    <input type="text" onChange={(e) => setSearchReq(e.target.value)} className="text-sm bg-gray-500/10 border border-gray-500/10 outline-none focus:outline-none focus:ring-0 focus:border-gray-500/30 rounded-xl w-full" />
                    {filteredExcercises.length !== 0 ? (
                    <ul className="h-4/5 overflow-y-auto mt-4">
                    
                        {filteredExcercises.map((exercise, index) => (
                            <li key={index} className="p-2 border rounded-lg border-gray-600 cursor-pointer hover:bg-bg-dark mb-2">
                                <div className="flex items-center">
                                    <img src={getImageUrl(exercise.exImage)} alt={exercise.exName} className="w-16 h-16 rounded-lg mr-2 object-cover inline-block align-middle"/>
                                    <div>
                                        <span className="align-middle text-sm ml-2">{exercise.exName}</span>
                                        <div className="text-xs text-gray-400 ml-2 flex items-center gap-2">{exercise.equipment}<span className="material-symbols-outlined text-xs">{getIcon(exercise.equipment)}</span></div>
                                        
                                    </div>
                                </div>
                            </li>
                        ))}                  
                    </ul>
                    ) : (
                        <p className="text-white">No exercises found.</p>
                    )}       
                </div>
            </div>
        </div>
    )
};

export default AddExercise;