import { use, useEffect, useState, useRef } from "react";
import flatBenchPress from './images/flat_bench_press.png'
import { useNavigate } from "react-router-dom";
import AddExercise from "./add_exercise";



function Routine() {
    const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const workoutStructure = {
                day: "",
                type: "",
                status: "",
                exercises: []
        }
    
    

    const navigate = useNavigate();

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
                    setUser(data.user);
                    console.log("Session check successful:", data.loggedIn);

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


    const [routine, setRoutine] = useState(null);

    const [orderedWeek, setOrderedWeek] = useState([]);
    const [days, setDays] = useState([{day: "Sun", date: 6}, {day:"Mon", date: 0}, {day: "Tue", date: 1}, {day: "Wed", date: 2}, {day: "Thu", date: 3}, {day: "Fri", date: 4}, {day: "Sat", date: 5}]);
    useEffect(() => {
        
        const today = new Date();
        const todayIndex = today.getDay(); 
        const date = today.getDate();
        // JS getDay() → Sun=0, Mon=1, ... Sat=6
        const orderedWeek = []

        const weekday = new Date();
        for (let i = 0; i < days.length; i++) {
            if(i === todayIndex){
                orderedWeek.push({day: days[i].day , date: date});
            } else if(i < todayIndex){
                weekday.setDate(date - (todayIndex - i));
                orderedWeek.push({day: days[i].day, date: weekday.getDate()});
            } else {
                orderedWeek.push({day: days[i].day, date: date + ((i - todayIndex + 7) % 7)});
            }
        }
        setOrderedWeek(orderedWeek);

    }, []);

    const today = new Date();
    const todayIndex = today.getDay();
    

    const [currentWorkout, setCurrentWorkout] = useState(todayIndex || 0);
    const [currentExercise, setCurrentExercise] = useState(-1);

    const toggleCurrExercise = (index) => {
        if(currentExercise === index){
            setCurrentExercise(-1);
        } else {
            setCurrentExercise(index);
        }
    }

    const addSet = (exerciseIndex, workoutIndex) => {
        setRoutine(prev => {
            const updated = structuredClone(prev);

            updated.workouts[workoutIndex]
                .exercises[exerciseIndex]
                .sets.push({ weight: 0, reps: 0, status: "pending" });

            return updated;
        });
    };
    const exCheckChange = (exerciseIndex, workoutIndex) => {
        setRoutine(prev => {
            const updated = structuredClone(prev);
            const ex = updated.workouts[workoutIndex].exercises[exerciseIndex];

            const newStatus = ex.status === "pending" ? "completed" : "pending";
            ex.status = newStatus;
            ex.sets.forEach(s => s.status = newStatus);

            return updated;
        });
    };
    const setCheckChange = (setIndex, exerciseIndex, workoutIndex) => {
        setRoutine(prev => {
            const updated = structuredClone(prev);

            const ex = updated.workouts[workoutIndex].exercises[exerciseIndex];
            const set = ex.sets[setIndex];

            set.status = set.status === "pending" ? "completed" : "pending";
            ex.status = ex.sets.every(s => s.status === "completed")
                ? "completed"
                : "pending";

            return updated;
        });
    };

    const changeRoutineName = (name) => {
        setRoutine(prevRoutine => ({
        ...prevRoutine,
        routineName: name // `name` is the new routine name
        }));
    }

    const updateWorkoutName = (name) => {
    setRoutine(prev => {
        // Safety checks
        if (!prev.workouts || currentWorkout == null || currentWorkout < 0 || currentWorkout >= prev.workouts.length) {
            console.error("Invalid currentWorkout index:", currentWorkout);
            return prev; // don't update
        }

        const updatedWorkouts = [...prev.workouts];
        updatedWorkouts[currentWorkout] = {
            ...updatedWorkouts[currentWorkout],
            type: name
        };

        return {
            ...prev,
            workouts: updatedWorkouts
        };
    });
};

    const [editingCell, setEditingCell] = useState(null); 

    const updateSetField = (workoutIndex, exerciseIndex, setIndex, field, value) => {
        setRoutine(prev => {
            const updated = structuredClone(prev); // CHANGED
            updated.workouts[workoutIndex]       // CHANGED
                .exercises[exerciseIndex]           // CHANGED
                .sets[setIndex][field] = value;
            return updated;                          // CHANGED
        });
    };


    const [showOverlay, setShowOverlay] = useState(false);
    const [showAddExerciseDialog, setAddExerciseDialog] = useState(false);
    

    const handleAddWorkout = () => {
        setAddExerciseDialog(true);
        setShowOverlay(true);
    }
    
    const addExercise = (exercise) => {
        setRoutine(prev => {
            const updated = structuredClone(prev);
            updated.workouts[currentWorkout]
                .exercises.push({
                    exId: exercise._id,                    
                    weightUnit: "kg",
                    status: "pending",
                    sets: [{ weight: 0, reps: 0, status: "pending" }]
                });
            return updated;
        });

    };

   

    const getExcerciseImg = (exId) => {
        const exercise = allExercises.find(ex => ex._id === exId);
        return exercise ? `${BACKEND_URL}/uploads/${exercise.exImage}` : flatBenchPress;
    };

    const getExerciseName = (exId) => {
        const exercise = allExercises.find(ex => ex._id === exId);
        return exercise ? exercise.exName : "Exercise Name";
    };



    const logout = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/users/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                setUser(null);
                navigate('/login');
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    
    const [allExercises, setAllExercises] = useState([]);
    const [searchReq, setSearchReq] = useState("");
    const [filteredExercises, setFilteredExercises] = useState([]);

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
    }, [searchReq, user, allExercises]);

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

    useEffect(() => {
        if(!user) return;
        const fetchUserRoutine = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/routines/get-all-by-user/${user._id}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Routine fetched successfully, ");
                    const routineData = data.routines;
                    if(routineData && routineData.length > 0) {
                        const routine = routineData.find(r => r.isDefault === true);
                        setRoutine(routine);
                    }else{
                        const emptyRoutine = {
                            _id: "",
                            routineName: "",
                            isDefault: false,
                            workouts: Array.from({ length: 7 }, () => ({ 
                                day: "",
                                type: "",
                                minRep: 0,
                                maxRep: 0,
                                status: "",
                                exercises: []
                            }))
                        };
                        setRoutine(emptyRoutine);

                    }
                }
                
            } catch (error) {
                console.error("Error fetching routine:", error);
            }
        };
        fetchUserRoutine();
    }, [user]);

    const saveWorkout = async () => {
        if(!routine) return;
        const confirmed = window.confirm("Are you sure you want to save this workout?");
        if (!confirmed) return;
        try{
            const response = await fetch(`${BACKEND_URL}/api/workoutTracks/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user._id,
                    routineId : routine._id,
                    workout : routine.workouts[currentWorkout],
                    date: new Date(),
                    status:routine.workouts[currentWorkout].exercises.length - 3 < routine.workouts[currentWorkout].exercises.filter(ex => ex.status === "completed").length ? "completed" : "incomplete"
                }),
                credentials: "include",
            });
            const data = await response.json();
            if(response.ok) {
                console.log("Workout saved successfully");
            } else {
                console.log("Failed to save workout");
            }
        } catch (error) {
            console.error("Error saving workout:", error);

        }
    };


    const handleSave = async () => {
        if(!routine) return;
        if(routine._id === ""){
            try{
                const response = await fetch(`${BACKEND_URL}/api/routines/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user._id,
                        routineName : routine.routineName,
                        workouts : routine.workouts,
                        isDefault: true
                    }),
                    credentials: "include",
                });
                const data = await response.json();
                if(response.ok) {
                    setRoutine(data.routine)
                    console.log("Routine added successfully");
                } else {
                    console.log("Failed to add routine");
                }
            } catch (error) {
                console.error("Error adding routine:", error);
            }
        }else{
            try {
                const response = await fetch(`${BACKEND_URL}/api/routines/update/${routine._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        routineName : routine.routineName,
                        workouts : routine.workouts,
                        isDefault: true
                    }),
                    credentials: "include",
                    

                });
                const data = await response.json();
                if(response.ok) {
                    setRoutine(data.routine)
                    console.log("Routine updated successfully");
                } else {
                    console.log("Failed to update routine");
                }
            } catch (error) {
                console.error("Error updating routine:", error);
            }
        }
    };

    const [showMore, setShowMore] = useState(null);
        const [showMoreOverlay, setShowMoreOverlay] = useState(false);
    const [isSetRepRange, setIsSetRepRange] = useState(false);

    const moreRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreRef.current && !moreRef.current.contains(event.target)) {
                setShowMoreOverlay(false);
                setShowMore(null);
                isSetRepRange && setIsSetRepRange(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [moreRef]);


    const setMinRep = (workout, exercise, minRep) => {
        setRoutine(prev => {
            const updated = structuredClone(prev);
            updated.workouts[workout].exercises[exercise].minRep = minRep;
            return updated;
        });
    };

    const setMaxRep = (workout, exercise, maxRep) => {
        setRoutine(prev => {
            const updated = structuredClone(prev);
            updated.workouts[workout].exercises[exercise].maxRep = maxRep;
            return updated;
        });
    };

    const deleteExercise = (workoutIndex, exerciseIndex) => {
        setRoutine(prev => {
            const updated = structuredClone(prev);
            updated.workouts[workoutIndex].exercises.splice(exerciseIndex, 1);
            return updated;
        });
    };

    const removeSet = (workoutIndex, exerciseIndex, setIndex) => {
        setRoutine(prev => {
            const updated = structuredClone(prev);
            updated.workouts[workoutIndex].exercises[exerciseIndex].sets.splice(setIndex, 1);
            return updated;
        });
    };

    return (
        <div className="relative bg-bg-dark font-display text-white h-screen p-4 flex flex-col">
            <h1 className="text-center mb-5 text-xl">Daily Workout</h1>
            <div className="h-full overflow-y-auto">
                <ul className="flex justify-between p-2">
                    {orderedWeek.map((d, i) => (
                        <li
                           
                            className="text-xs flex flex-col justify-center items-center "
                            key={i}>
                                <span  onClick={() => {setCurrentWorkout(i)}} className={`border border-primary flex justify-center items-center ${currentWorkout === i ? "bg-primary text-black" : "bg-card-dark text-white"} rounded-full w-8 h-8 mb-1`}>{d.date}</span>
                                <span className={`${d.date === new Date().getDate() ? "underline underline-offset-4 underline-primary text-primary" : ""}`}>{d.day}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col">
                    <input
                            type="text"
                            value={routine?.routineName}
                            onChange={(e) => changeRoutineName(e.target.value)}                        
                            placeholder="Set Routine Name"
                            className="text-lg mb-3 bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-0 focus:p-0"
                        />
                    <div className="flex justify-between">
                    {routine && routine.workouts && currentWorkout !== null && 
                    
                        <input
                            type="text"
                            value={routine.workouts.length > currentWorkout ? routine?.workouts[currentWorkout]?.type : ""}
                            placeholder="Set Workout Name"
                            onChange={(e) => updateWorkoutName(e.target.value)}                        
                            className="text mb-3 bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-0 focus:p-0"
                        />
                    }
                        <button onClick={handleSave} className="mb-3 w-1/3 bg-primary text-sm text-black rounded-md px-3 py-1">Save Workout</button>
                    
                    </div>

                </div>
                <div className="">
                {routine && routine?.workouts?.map((workout, index) => (
                    index === currentWorkout &&
                    <ul     
                        key={index}
                        className="list-none" >
                        {workout.exercises && workout.exercises.map((exercise, exIndex) => (
                            
                        <li 
                            key={exIndex}
                            className=" flex flex-col items-center mb-2 rounded-lg">
                            <div className="flex flex-col z-0 top-0 left-0 w-full bg-gray-700 rounded-lg">
                                <div
                                    onClick={() => toggleCurrExercise(exIndex)}
                                    className="relative shadow-lg bg-card-dark rounded-lg p-3 z-30 flex items-center w-full cursor-pointer">
                                    <span onClick={(e) => {setShowMoreOverlay(true); setShowMore(exIndex); e.stopPropagation(e);}} className="absolute top-0 right-0 text-md material-symbols-outlined px-2 py-1">more_horiz</span>
                                    {/* {showMoreOverlay &&
                                        <div onClick={() => {setShowMoreOverlay(false); setShowMore(null)}} className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.1)] z-20 backdrop-blur-[5px]"/>
                                    } */}
                                    {showMore === exIndex && showMoreOverlay &&
                                    <div ref={moreRef} className="absolute top-8 right-0 p-2 z-32 bg-card-dark rounded shadow-lg">
                                        {!isSetRepRange &&
                                        <ul className="text-xs">
                                            <li onClick={(e) =>{setIsSetRepRange(true); e.stopPropagation(e)}} className="flex justify-start gap-2 items-center p-2 hover:bg-bg-dark rounded cursor-pointer"><span className="material-symbols-outlined text-xs">edit</span>Set Rep Range</li>
                                            <li onClick={() => deleteExercise(index, exIndex)} className="flex justify-start gap-2 items-center p-2 hover:bg-bg-dark rounded cursor-pointer"><span className="material-symbols-outlined text-xs">delete</span>Delete Exercise</li>
                                        </ul>
                                        }
                                        {isSetRepRange &&
                                        <div onClick={(e) =>{e.stopPropagation(e)}} className="z-50 flex flex-col text-xs">
                                            <span>Set Rep Range</span>
                                            <div className="flex justify-center gap-8">
                                                <div className="flex flex-col justify-center items-center">
                                                    <label>Min</label>
                                                    <input value={exercise.minRep} onChange={(e) => setMinRep(index,exIndex,  e.target.value)} type="number" className="text-xs w-8 bg-gray-500/10 border border-gray-500/10 outline-none focus:outline-none focus:ring-0 focus:border-gray-500/30 rounded-md mt-2 mb-2 p-1 text-sm" />
                                                </div>
                                            
                                                <div className="flex flex-col justify-center items-center">
                                                    <label>Max</label>
                                                    <input value={exercise.maxRep} onChange={(e) => setMaxRep(index,exIndex,  e.target.value)} type="number" className="text-xs w-8 bg-gray-500/10 border border-gray-500/10 outline-none focus:outline-none focus:ring-0 focus:border-gray-500/30 rounded-md mt-2 mb-2 p-1 text-sm" />
                                                </div>  
                                            </div>
                                        </div>
                                        }
                                    </div>
                                    }
                                    <img src={getExcerciseImg(exercise.exId)} alt="Barbell Bench Press" className="w-16 h-16 rounded-lg mr-2 object-cover"/>
                                    <div className="h-full flex flex-col justify-center ">   
                                        <h3 className="text-sm">{getExerciseName(exercise.exId)}</h3>
                                        <p className="text-xs text-gray-400">{exercise.sets.length} sets x {exercise.minRep}-{exercise.maxRep}  reps</p>
                                    </div>
                                    <input
                                        onChange={() => exCheckChange(exIndex, index)}
                                        onClick={(e) => e.stopPropagation()}
                                        checked={exercise.sets.every(set => set.status === "completed")}
                                        type="checkbox" className="ml-auto mr-4 rounded-full bg-card-dark text-primary ring-0 outline-none focus:outline-0 focus:border-0 focus:ring-0 self-center w-5 h-5 accent-primary"/>
                                </div>
                                {currentExercise === exIndex && 
                                <div 
                                    
                                    className={`bg-card-dark ${currentExercise === exIndex? "p-2 h-auto m-4" : "p-0 h-0 m-0"} rounded overflow-hidden shadow-inner shadow-black/30`}>
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-600">
                                            <th className="text-left text-sm py-2 px-2">Set</th>
                                            <th className="text-left text-sm py-2 px-2">Weight</th>
                                            <th className="text-left text-sm py-2 px-2">Reps</th>
                                            <th className="text-left text-sm py-2 px-2"></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {exercise.sets.map((set, setIndex) => (
                                            <tr key={setIndex} className="border-b border-gray-700">
                                            <td className="text-sm py-3 px-2">{setIndex}</td>
                                            {/* Weight */}
                                            <td
                                                className="text-sm py-3 px-2 cursor-pointer"
                                                onClick={(e) =>{
                                                    setEditingCell({ workoutIndex: index, exIndex, setIndex, field: "weight" });
                                                    const value = parseInt(e.target.value, 10); // CHANGED
                                                    if(value >= 0) return;
                                                    updateSetField(index, exIndex, setIndex, "weight", null)
                                                    
                                                }} // CHANGED
                                            >
                                                {editingCell?.workoutIndex === index &&        // CHANGED
                                                editingCell?.exIndex === exIndex &&
                                                editingCell?.setIndex === setIndex &&
                                                editingCell?.field === "weight" ? (

                                                    <input
                                                        type="number"
                                                        autoFocus
                                                        value={set.weight}
                                                        onChange={(e) =>
                                                            updateSetField(index, exIndex, setIndex, "weight", e.target.value)
                                                        } // CHANGED
                                                        onBlur={() => setEditingCell(null)} // CHANGED
                                                        className="w-16 bg-transparent outline-none border-none p-0 m-0 focus:ring-0 focus:outline-0 focus:p-0 focus:m-0 text-sm"
                                                    />

                                                ) : (
                                                    `${set.weight === null ? "0" : set.weight} kg`
                                                )}
                                            </td>

                                            {/* Reps */}
                                            <td
                                                className="text-sm py-3 px-2 cursor-pointer"
                                                onClick={(e) =>{
                                                    setEditingCell({ workoutIndex: index, exIndex, setIndex, field: "reps" })
                                                    const value = parseInt(e.target.value, 10); // CHANGED
                                                    if(value >= 0) return;
                                                    updateSetField(index, exIndex, setIndex, "reps", null)
                                                }} // CHANGED
                                            >
                                                {editingCell?.workoutIndex === index &&        // CHANGED
                                                editingCell?.exIndex === exIndex &&
                                                editingCell?.setIndex === setIndex &&
                                                editingCell?.field === "reps" ? (

                                                    <input
                                                        type="number"
                                                        autoFocus
                                                        value={set.reps}
                                                        onChange={(e) =>
                                                            updateSetField(index, exIndex, setIndex, "reps", e.target.value)
                                                        } // CHANGED
                                                        onBlur={() => setEditingCell(null)} // CHANGED
                                                        className="w-16 bg-transparent outline-none border-none p-0 m-0 focus:ring-0 focus:outline-0 focus:p-0 focus:m-0 text-sm"
                                                    />

                                                ) : (
                                                    `${set.reps === null ? "0" : set.reps} reps`
                                                )}
                                            </td>
                                            <td className="text-sm py-3 px-2 flex justify-between items-center">
                                                <input type="checkbox" checked={set.status === "completed"} onChange={() => setCheckChange(setIndex, exIndex, index)} className="rounded-full bg-card-dark text-primary ring-0 outline-none focus:outline-0 focus:border-0 focus:ring-0 self-center w-3 h-3 accent-primary"/>
                                                <span onClick={() => removeSet(index, exIndex, setIndex)} className="material-symbols-outlined text-xs cursor-pointer">close</span>
                                            </td>
                                            </tr>
                                            ))}
                                            
                                        </tbody>
                                        </table>
                                        <button 
                                            onClick={() => addSet(exIndex, index)}
                                            className="mt-3 w-full text-xs border border-dashed py-1 rounded-full">Add Set</button>

                                </div>
                                }
                            </div>
                            </li>
                        ))}
                                                
                    </ul>
                    ))}
                    <button
                        onClick={() => handleAddWorkout()}
                        className="mt-3 w-full text-sm border border-dashed py-2 rounded-full">Add Exercise</button>
                    <button
                    onClick={saveWorkout}
                        className="mt-3 w-full text-sm py-2 rounded-full bg-primary text-black"
                        >Finish Workout</button>
                                        
                </div>
            </div>
            {showOverlay && (
            <div  onClick={() =>{setShowOverlay(false); setAddExerciseDialog(false);} }   className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.1)] z-20 backdrop-blur-[5px]"/>
            )}
            {showAddExerciseDialog && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4/5 w-4/5  z-30 p-4 bg-card-dark rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-lg shadow-black/50">
                    <div className="h-full ">
                        <div className="h-max">
                            <h1 className="mb-4 text-center">Select Exercise</h1>
                            <input onChange={(e) => setSearchReq(e.target.value)} type="text" placeholder="Search exercise..." className="w-full p-2 rounded outline-none ring-0 focus:outline-none focus:ring-0 bg-bg-dark outline-none border-none mb-4 text-xs"/>
                        </div>
                        
                        {filteredExercises.length !== 0 ? (
                        <div className="h-4/5 overflow-y-auto mt-4">
                            <ul className="">
                            
                                {filteredExercises.map((exercise, index) => (
                                    <li onClick={() => addExercise(exercise)} key={index} className="p-2 border rounded-lg border-gray-600 cursor-pointer hover:bg-bg-dark mb-2">
                                        <div className="flex items-center">
                                            <img src={`${BACKEND_URL}/uploads/${exercise.exImage}`} alt={exercise.exName} className="w-16 h-16 rounded-lg mr-2 object-cover inline-block align-middle"/>
                                            <div>
                                                <span className="align-middle text-sm ml-2">{exercise.exName}</span>
                                                <div className="text-xs text-gray-400 ml-2 flex items-center gap-2">{exercise.equipment}<span className="material-symbols-outlined text-xs">{getIcon(exercise.equipment)}</span></div>
                                                
                                            </div>
                                        </div>
                                    </li>
                                ))}                  
                            </ul>
                        </div>
                        ) : (
                            <p className="text-white">No exercises found.</p>
                        )}   
                    </div>
                    
            </div>
            )}
        </div>
    );
    
}

export default Routine;