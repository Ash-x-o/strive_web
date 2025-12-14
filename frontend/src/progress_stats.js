import { useState, useEffect, use } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import { FaDumbbell } from "react-icons/fa"; // Dumbbell icon
import { NavBar } from "./routine";
import dumbbellSrc  from "./images/fitness_center_24dp_E3E3E3_FILL0_wght700_GRAD0_opsz24.svg";
import { useNavigate, useLocation } from "react-router-dom";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

function ProgressStats(){
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


    return (
        <div className="relative h-screen bg-bg-dark text-white p-4 overflow-y-auto">
            <h1 className="text-3xl mb-6 text-center">Progress Stats</h1>
            <WeightProgress user={user} />
            <div className="fixed bottom-0 left-0 w-full flex justify-between items-center">
                <NavBar />
            </div>
        </div>
    );
}
export default ProgressStats;


function WeightProgress({ user }) {
        
    const dumbbellImg = new Image();
    dumbbellImg.src = dumbbellSrc;

    const [iconReady, setIconReady] = useState(false);

    // Apply color filter when drawing on canvas
    const color = "#f48c25"; // desired color
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d');

    dumbbellImg.onload = () => {
    ctx.drawImage(dumbbellImg, 0, 0, 24, 24);

    // apply color overlay
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 24, 24);
    };

    useEffect(() => {
        dumbbellImg.onload = () => setIconReady(true);
    }, []);

    const [dailyWeights, setDailyWeights] = useState([])
    const [weightInput, setWeightInput] = useState(0);

    
    // Example milestones (can be dynamic)

    useEffect(() => {
        localStorage.setItem("dailyWeights", JSON.stringify(dailyWeights));
    }, [dailyWeights]);

    const addWeight = async () => {
        if (!weightInput) return;
        const today = new Date()
        try{
            const response = await fetch(`/api/weight_tracks/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    date: today,
                    weight: weightInput
                }),
                credentials: 'include'
            });
            if(response.ok){
                const data = await response.json();
                setDailyWeights([...dailyWeights, data.savedEntry]);
                setWeightInput(0);
                console.log("Weight added:");
            }
        } catch (error) {
            console.error("Error adding weight:", error);
        }
    };
    
    

    useEffect(() => {
        if (user) {
            const fetchWeights = async () => {
                try {
                    const response = await fetch(`/api/weight_tracks/get-by-user/${user._id}`, {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setDailyWeights(data.weightEntries);
                    }
                } catch (error) {
                    console.error("Error fetching weights:", error);
                }
            };

            fetchWeights();
        }
    }, [user, weightInput]);
    // Prepare chart data
    const data = {
        labels: dailyWeights.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [
            {
                label: "Weight Progress",
                data: dailyWeights.map(d => d.weight),
                borderColor: "#f48c25", // primary color yellow-like
                backgroundColor: "#f48c25",
                tension: 0.3,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointStyle: canvas
            }
        ]
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const weight = context.raw;                        
                        return `${weight}kg`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.1)" }
            },
            x: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.1)" }
            }
        }
    };

    const [showWeightHistory, setShowWeightHistory] = useState(true);


    return (
        <div className="p-4 bg-bg-dark text-white rounded-lg shadow-lg w-full w-full mx-auto">
            <h2 className="text-xl mb-4">Weight Progress</h2>
            <div className="flex gap-2 mb-4 justify-center">
                <input
                    type="number"
                    value={weightInput !== 0 ? weightInput : ''}
                    onChange={e => setWeightInput(e.target.value)}
                    placeholder="Enter weight (kg)"
                    className="p-2 w-full rounded bg-card-dark text-white outline-none border-none w-32"
                />
                <button
                    onClick={addWeight}
                    className="bg-primary text-black px-4 rounded"
                >
                    Add
                </button>
            </div>

            {iconReady && <Line data={data} options={options} />}

            <div className="border border-gray-500/20 px-4 py-2 mt-4 ">
            <h1 onClick={() => setShowWeightHistory(!showWeightHistory)}
                className="cursor-pointer text-sm flex justify-between items-center"
                >Weight History<span className="material-symbols-outlined">arrow_drop_down</span></h1>
            {showWeightHistory &&
            dailyWeights.length > 0 && (
                <ul className="mt-4 max-h-48 overflow-y-auto">
                    {dailyWeights.map((d, i) => (
                        <li key={i} className="flex justify-between items-center p-2 bg-card-dark rounded mb-1">
                            <span>{new Date(d.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                                {d.weight} kg
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
}

