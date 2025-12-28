import React,{useState, useEffect } from "react";
import { NavBar } from "./routine";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
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
                    
                    console.log("Session check successful:", data.loggedIn);
                    if(!data.loggedIn){
                        navigate('/login');
                        setUser(null);
                    }else{
                        setUser(data.user);
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

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [uploadedPic, setUploadedPic] = useState(null);

    useEffect(() => {
        if (user) {
            setUserName(user.userName || "");
            setEmail(user.email || "");
            setProfilePic(user.profilePic || "");
        }
    }, [user]);
    
     

    const [oldPassword, setOldPassword] = useState("");
    const  [newPassword, setNewPassword] = useState("");
    const  [confirmNewPassword, setConfirmNewPassword] = useState("");

    const savePasswordChanges = () => {
        if(newPassword !== confirmNewPassword){
            alert("New passwords do not match.");
            return;
        }

        try{
        const response = fetch(`/api/users/change-password/${user._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                oldPassword,
                newPassword,
            }),
        });
            if(response.ok){
                console.log("Password changed successfully");
                setShowEditPasswordDialog(false);
            }else{
                console.error("Error changing password");
                alert(response.message);
            }
        }catch(error){
            console.error("Error changing password:", error);
        }
    };


    const saveChanges = async () => {
      let profilePicString = profilePic;
        if(uploadedPic){
            try{
                const formData = new FormData();
                
                if (uploadedPic) {
                    formData.append('profilePic', uploadedPic);
                    console.log(uploadedPic);
                }
                const imgResponse = await fetch(`/api/users/update-profile-pic/${user._id}`, {
                    method: 'PUT',
                    body: formData,
                    credentials: 'include'
                });
                if(imgResponse.ok){
                    console.log("Profile picture updated successfully");
                    setProfilePic(imgResponse.profilePic);
                    profilePicString = imgResponse.profilePic;
                }else{
                    console.error("Error updating profile picture");
                }
            }catch(error){
                console.error("Error updating profile picture:", error);
            }
        }
        try{
            const response = await fetch(`/api/users/update-user-info/${user._id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                userName,
                email,
                profilePic : profilePicString,
              }),
            });
            if(response.ok){
                console.log("User info updated successfully");
            }else{
                console.error("Error updating user info");
            }
        }catch(error){
            console.error("Error updating user info:", error);

        }
        
    }
    const [showEditPasswordDialog, setShowEditPasswordDialog] = useState(false);

    const logout = async () => {
      try {
        const response = await fetch(`/api/users/logout`, {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          setUser(null);
          navigate("/login");
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };


    return (
      <div className="bg-bg-dark min-h-screen flex flex-col font-display text-white pb-24 overflow-x-hidden">
        {/* Top App Bar */}
        <header className="sticky top-0 z-50 bg-bg-dark backdrop-blur-sm px-4 pt-12 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
          <div className="w-10">
            {/* Empty left for balance or potentially a back button if needed */}
          </div>
          <h1 className="text-lg font-bold tracking-tight">Profile</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white dark:text-white">
              settings
            </span>
          </button>
        </header>
        {/* Profile Header Section */}
        <section className="flex flex-col items-center pt-6 pb-8 px-4">
          <div className="relative group cursor-pointer">
            <div
              className="w-28 h-28 rounded-full bg-cover bg-center border-4 border-white dark:border-[#393028] shadow-xl"
              data-alt="Portrait of a fit male athlete looking confident"
              style={{
                backgroundImage:
                  `url("${profilePic ? '/uploads/' + profilePic : uploadedPic ? URL.createObjectURL(uploadedPic) : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}")`,
              }}
            />
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 border-4 border-bg-light   flex items-center justify-center">
              <label htmlFor="profile-pic-input" className="cursor-pointerw-4 h-4 ">
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
                <input
                    type="file"
                    id="profile-pic-input"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setUploadedPic(file);
                        }
                    }}
                />
              </label>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {userName ? userName : "No Name Provided"}
            </h2>
            <p className="text-slate-500 dark:text-[#baab9c] text-sm font-medium mt-1">
              {email ? email : "No Email Provided"}
            </p>
          </div>
        </section>
        <section className="px-4 space-y-6">
          <div className="border border-gray-500/10 p-4 w-full rounded ">
            <h3 className="text-lg mb-2">Account Details</h3>
            <div className="flex flex-col gap-2">
            <div className="flex items-center">
                <i className="fa fa-user p-2 bg-card-dark rounded "></i><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="text-sm bg-transparent border-none focus:border-none outline-none focus:outline-none ring-0 focus:ring-0 w-full"/><i className="fa fa-edit"></i>
            </div>
            <hr className="border border-1 border-gray-500/10 w-full "></hr>
            <div className="flex items-center">
                <i className="fa fa-envelope p-2 bg-card-dark rounded"></i><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="text-sm bg-transparent border-none focus:border-none outline-none focus:outline-none ring-0 focus:ring-0 w-full"/><i className="fa fa-edit"></i>
            </div>
                <hr className="border border-1 border-gray-500/10 w-full"></hr>
            <div onClick={() => {setShowEditPasswordDialog(true)}} className="flex items-center">
                <i className="fa fa-lock p-2 bg-card-dark rounded mr-2"></i><span className="text-sm bg-transparent border-none focus:border-none outline-none focus:outline-none ring-0 focus:ring-0 w-full">Change Password</span><i className="fa fa-arrow-right"></i>
            </div>
            
            </div>
          </div>
          <div className="border border-gray-500/10 p-4 w-full rounded flex flex-col gap-3">
              <div onClick={logout} className="flex items-center">
                <i className="fa fa-arrow-right-from-bracket mr-2 p-2 bg-card-dark rounded "></i><span className="text-sm text-red-500 underline bg-transparent border-none focus:border-none outline-none focus:outline-none ring-0 focus:ring-0 w-full">Log Out</span><i className="fa fa-arrow-right"></i>
            </div>
            <hr className="border border-1 border-gray-500/10 w-full "></hr>
            <div onClick={saveChanges} className="flex items-center">
                <i className="fa fa-save mr-2 p-2 bg-card-dark rounded "></i><span className="text-sm text-primary underline bg-transparent border-none focus:border-none outline-none focus:outline-none ring-0 focus:ring-0 w-full">Save</span>
            </div>
          </div>
        </section>
        
        
        <div className="fixed bottom-0 left-0 w-full flex justify-between items-center">
          <NavBar />
        </div>
        {showEditPasswordDialog && (
          <div onClick={() => setShowEditPasswordDialog(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center backdrop-blur-[5px] justify-center z-50">
            <div onClick={(e)=> e.stopPropagation()} className="bg-bg-dark p-6 rounded-lg w-11/12 max-w-md">
                <h2 className="text-xl mb-4">Change Password</h2>
                <div>
                    <div className="mb-4">
                        <label className="block mb-1">Current Password</label>
                        <input onChange={(e) => setOldPassword(e.target.value)} type="password" className="w-full p-2 rounded bg-card-dark text-white outline-none border-gray-500/10 ring-0 focus:outline-none focus:ring-0 focus:border-gray-500/20" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">New Password</label>
                        <input onChange={(e) => setNewPassword(e.target.value)} type="password" className="w-full p-2 rounded bg-card-dark text-white outline-none border-gray-500/10 ring-0 focus:outline-none focus:ring-0 focus:border-gray-500/20" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Confirm New Password</label>
                        <input onChange={(e) => setConfirmNewPassword(e.target.value)} type="password" className="w-full p-2 rounded bg-card-dark text-white outline-none border-gray-500/10 ring-0 focus:outline-none focus:ring-0 focus:border-gray-500/20" />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setShowEditPasswordDialog(false)} className="px-4 py-2 rounded bg-gray-500 text-white">Cancel</button>
                        <button type="button" onClick={() => savePasswordChanges()} className="px-4 py-2 rounded bg-primary text-black">Save</button>
                    </div>
                </div>
            </div>
          </div>
        )}
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n        .filled {\n            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n    ",
          }}
        />
      </div>
    );
}

