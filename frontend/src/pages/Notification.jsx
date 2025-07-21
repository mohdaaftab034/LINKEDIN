import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { RxCross1 } from "react-icons/rx";
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/UserContext';
function Notification() {

    let { serverUrl } = useContext(authDataContext)
    let [notificationData, setNotificationData] = useState([])
    let { userData, handleGetProfile } = useContext(userDataContext)
    const handleGetNotification = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/notification/get", { withCredentials: true })
            setNotificationData(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handledeleteNotification = async (id) => {
        try {
            let result = await axios.delete(serverUrl + `/api/notification/deleteone/${id}`, { withCredentials: true })
            await handleGetNotification()
        } catch (error) {
            console.log(error)
        }
    }
    const handleClearAllNotification = async () => {
        try {
            let result = await axios.delete(serverUrl + "/api/notification", { withCredentials: true })
            await handleGetNotification()
        } catch (error) {
            console.log(error)
        }
    }
    const handleMessage = (type) => {
        if (type == "like") {
            return "liked your post"
        } else if (type == "comment") {
            return "commented on your post"
        } else {
            return "Accept your connection"
        }
    }

    useEffect(() => {
        handleGetNotification()
    }, [])
    return (
        <div className='w-screen h-[100vh] bg-[#F4F2EE] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]'>
            <Nav />
            <div className='w-full lg:w-[90%] h-[100px] bg-[white] border-[1px] border-gray-300 rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 justify-between'>
                <div>
                    Notifications {notificationData.length}
                </div>
                {notificationData.length > 0 && <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]' onClick={handleClearAllNotification}>clear all</button>}

            </div>

            {notificationData.length > 0 && <div className='w-[100%] max-w-[800px] bg-white border-[1px] border-gray-300 rounded-lg flex flex-col gap-[20px] min-h-[100px]'>
                {notificationData.map((noti, index) => (
                    <div className='w-full min-h-[100px] pl-[20px] pt-[10px] flex justify-between items-center  border-b-2 border-b-gray-200' key={index}>
                        <div>
                            <div className='flex justify-between relative'>
                                <div className='flex justify-start ml-[80px] mb-[20px] items-center gap-[10px]'>
                                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer' onClick={()=> handleGetProfile(noti.relatedUser.userName)}>
                                        <img src={noti.relatedUser.profileImage || dp} alt="" className='w-full h-full' />
                                    </div>
                                    <div className='text-[19px] font-semibold text-gray-700'>{`${noti.relatedUser.firstName} ${noti.relatedUser.lastName} ${handleMessage(noti.type)}`}</div>
                                </div>
                                <div className='flex justify-center items-center gap-[10px] absolute right-[10px] top-[10px] ' onClick={() => handledeleteNotification(noti._id)}>
                                    <RxCross1 className='w-[25px] cursor-pointer h-[25px] text-gray-800 font-bold ' />
                                </div>
                            </div>
                            {noti.relatedPost &&

                                <div className='flex items-center gap-[10px] ml-[10px] h-[70px] overflow-hidden'>
                                    <div className='w-[80px] h-[60px] min-w-[50px] min-h-[60px] aspect-square  overflow-hidden flex items-center justify-center'>
                                        <img src={noti.relatedPost.image} alt="" className='h-full w-full object-cover' />
                                    </div>
                                    <div className='texl-sm font-light pb-[10px] '>{noti.relatedPost.description}</div>
                                </div>

                            }


                        </div>
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default Notification
