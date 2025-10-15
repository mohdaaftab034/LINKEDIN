import React, { useContext, useEffect, useState } from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
function Nav() {
  let [activeSearch, setActiveSearch] = useState(false)
  let { userData, setUserData, handleGetProfile } = useContext(userDataContext)
  let [showPopup, setShowPopup] = useState(false)
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let [searchInput, setSearchInput] = useState("")
  let [searchData, setSearchData] = useState([])
  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      setUserData(null)
      navigate("/login")
      console.log(result);

    } catch (error) {
      console.log(error);
    }
  }
  const handleSearch = async () => {
    const trimmedQuery = searchInput.trim();

    // Prevent request if input is empty
    if (!trimmedQuery) {
      setSearchData([]); // clear previous results
      return;
    }

    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${encodeURIComponent(trimmedQuery)}`,
        { withCredentials: true }
      );
      setSearchData(result.data);
    } catch (error) {
      setSearchData([]);
      console.log("Search error:", error);
    }
  };


  useEffect(() => {

    handleSearch()

  }, [searchInput])


  return (
    <div className='w-[100%] h-[55px] bg-[white] fixed top-0 border-b-[1px] border-gray-300 flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]' >
      <div className='flex justify-center items-center gap-[10px] '>
        <div onClick={() => {
          setActiveSearch(false)
          navigate("/")
        }}>
          <img src={logo2} alt="" className='h-[40px] cursor-pointer' />
        </div>
        {!activeSearch && <div><IoSearchSharp className='w-[23px] h-[23px] text-gray-600 lg:hidden' onClick={() => setActiveSearch(true)} /></div>}
        {searchData.length > 0 && <div className='absolute top-[80px] h-[500px] left-[0px]  lg:left-[20px] border-[1px] rounded-lg border-gray-300 w-[100%] lg:w-[700px] bg-white flex flex-col gap-[20px] p-[20px] overflow-auto'>
          {searchData.map((sea) => (
            <div className='flex gap-[20px] items-center border-b-2 border-b-gray-300 p-[10px] hover:bg-gray-200 cursor-pointer rounded-lg ' onClick={() => {handleGetProfile(sea.userName); setActiveSearch(false)}}>
              <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
                <img src={sea.profileImage || dp} alt="" className='w-full h-full' />
              </div>
              <div>
                <div className='text-[19px] font-semibold text-gray-700'>{`${sea.firstName} ${sea.lastName}`}</div>
                <div className='text-[15px] font-normal text-gray-700'>{sea.headline}</div>
              </div>
            </div>
          ))}

        </div>}


        <form className={`w-[190px] lg:w-[350px] h-[40px] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-full border-[1px] border-gray-500 ${!activeSearch ? "hidden" : "flex"} `}>
          <div><IoSearchSharp className='w-[23px] h-[23px] text-gray-600' /></div>
          <input type="text" className='w-[80%] h-full bg-transparent outline-none  border-0' placeholder='search users...' onChange={(e) => setSearchInput(e.target.value)} value={searchInput} />
        </form>
      </div>

      <div className='flex justify-center items-center gap-[20px] '>

        {showPopup && <div className='w-[300px] min-h-[300px] bg-white border-[1px] border-gray-300 absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] gap-[20px] right-[20px] lg:right-[100px]'>
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
            <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
          </div>
          <div className='text-[19px] font-semibold text-gray-700'>{`${userData.firstName} ${userData.lastName}`}</div>
          <button className='w-[100%] h-[40px] rounded-full border-2 border-[#004182] text-[#004182]' onClick={() => handleGetProfile(userData.userName)}>View Profile</button>
          <div className='w-full h-[1px] bg-gray-700 '></div>
          <div className='flex  w-full items-center justify-start text-gray-600 gap-[10px] cursor-pointer' onClick={() => navigate("/network")}>
            <FaUserGroup className='w-[23px] h-[23px] text-gray-600 ' />
            <div>My Networks</div>
          </div>
          <button className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]' onClick={handleSignOut}>Sign Out</button>
        </div>
        }



        <div className='lg:flex flex-col items-center justify-center cursor-pointer text-gray-600 hidden' onClick={() => navigate("/")}>
          <TiHome className='w-[20px] h-[20px] text-gray-600' />
          <div>Home</div>
        </div>
        <div className='md:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer' onClick={() => navigate("/network")}>
          <FaUserGroup className='w-[20px] h-[20px] text-gray-600' />
          <div>My Networks</div>
        </div>
        <div className='flex flex-col items-center justify-center text-gray-600 cursor-pointer' onClick={() => navigate("/notification")}>
          <IoNotificationsSharp className='w-[20px] h-[20px] text-gray-600' />
          <div className='hidden md:block'>Notifications</div>
        </div>
        <div className='w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer' onClick={() => setShowPopup(prev => !prev)}>
          <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
        </div>
      </div>
    </div>
  )
}

export default Nav
