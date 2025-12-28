import React, { use, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddExercise() {
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
                    if(data.user.role === "admin"){
                        setUser(data.user);
                        console.log("Session check successful:", data.user.userName);
                    }else{
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
            const response = await fetch(`/api/exercises/add`, {
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
                const response = await fetch(`/api/exercises/get-all`, {
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
        
        const imageUrl = exImage.startsWith("http")
          ? exImage
          : `/uploads/${exImage}`;
        return imageUrl;
    };

    const [onEdit, setOnEdit] = useState(null);

    const [updatingExName, setUpdatingExName] = useState("");
    const [updatingEquipment, setUpdatingEquipment] = useState("");
    const [updatingExImage, setUpdatingExImage] = useState(null);

    useEffect(() => {
        if(onEdit){
            setUpdatingExName(onEdit.exName);
            setUpdatingEquipment(onEdit.equipment);
            setUpdatingExImage(null);
        }
    }, [onEdit]);

    const updateExercise = async () => {
        // Implementation for updating exercise details
        try{
            const formData = new FormData();
            formData.append("exName", updatingExName);
            formData.append("equipment", updatingEquipment);
            if(updatingExImage){
                formData.append("exImage", updatingExImage);
            }
            const response = await fetch(`/api/exercises/update/${onEdit._id}`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });
            const data = await response.json();
            if(response.ok){
                console.log("Exercise updated successfully");
                const updatedExercise = data.exercise;
                const updatedAllExercises = allExercises.map(exercise => 
                    exercise._id === updatedExercise._id ? updatedExercise : exercise
                );
                setAllExercises(updatedAllExercises);
                const updatedFilteredExercises = filteredExcercises.map(exercise => 
                    exercise._id === updatedExercise._id ? updatedExercise : exercise
                );
                setFilteredExercises(updatedFilteredExercises);
                setOnEdit(null);
            } else {
                console.log("Failed to update exercise: ", data.message);
            }
        }
        catch(error){
            console.error("Error updating exercise:", error);
        }
    }


    
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
                            <li key={index} onClick={() => setOnEdit(exercise)} className="p-2 border rounded-lg border-gray-600 cursor-pointer hover:bg-bg-dark mb-2">
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
            {onEdit &&
            <div onClick={() => setOnEdit(null)} className="fixed top-0 left-0 backdrop-blur-[5px] w-screen h-screen flex justify-center items-center">
                <div onClick={(e) => e.stopPropagation()} className="w-[80%] h-[50%] bg-card-dark rounded-lg shadow-lg p-4">
                    <div className="flex flex-col gap-4 h-full">
                        <div className="relative w-full h-full rounded-lg border border-dashed border-gray-500/20 flex justify-center items-center p-2 overflow-hidden">
                            <img src={
                                    updatingExImage ? URL.createObjectURL(updatingExImage) : getImageUrl(onEdit.exImage)
                                }
                                alt={onEdit.exName} className="w-full h-full object-cover rounded-lg opacity-50"/>
                            <label className="absolute w-full h-full flex justify-center items-center cursor-pointer">
                                <input type="file" onChange={(e) => setUpdatingExImage(e.target.files[0])} className="w-full h-full h-auto object-cover rounded-lg hidden"/>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-6xl text-white/70">
                                        cloud_upload
                                    </span>
                                    <span className="text-white/70">Click to upload or drag and drop</span>
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col gap-4">
                            <input value={updatingExName} onChange={(e) => setUpdatingExName(e.target.value)} type="text" placeholder="Exercise name" className="text-sm text-white bg-gray-500/10 border border-gray-500/20 focus:border-gray-500/20 outline-none focus:outline-none ring-0 focus:ring-0 rounded-full"/>
                            <input value={updatingEquipment} onChange={(e) => setUpdatingEquipment(e.target.value)} type="text" placeholder="Equipment" className="text-sm text-white bg-gray-500/10 border border-gray-500/20 focus:border-gray-500/20 outline-none focus:outline-none ring-0 focus:ring-0 rounded-full"/>
                        </div>
                        <button onClick={() => {setOnEdit(null); updateExercise();}} className="mt-auto bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 active:bg-primary/80">save</button>                        
                    </div>

                </div>
            </div>
        }
        </div>
    )
};

export default AddExercise;