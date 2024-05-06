import React from 'react'
import { BiSolidEdit } from "react-icons/bi";
import { IoPersonAddSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export default function NotificationList({notification, readNotification}) {
    const type = notification?.notificationType;
    const navigate = useNavigate();

    const renderContent = () => {
        switch (type) {
            case "COMMENT":
                return (
                    <div>
                        <BiSolidEdit size={20} />
                    </div>
                );
            case "FRIEND":
                return (
                    <div>
                        <IoPersonAddSharp size={20} />
                    </div>
                );
            default:
                return null;
        }
    };

    const handleNavigate = () => {
        switch (type) {
            case "COMMENT":
                readNotification(notification.id);
                navigate(`/board/${notification.relatedNum}`);
                break;
            case "FRIEND":
                readNotification(notification.id);
                navigate(`/profile/${notification.relatedNum}`);
                break;
            default:
                return null;
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E0E0E0', padding: '10px 0', alignItems:"center" }}>
            <div style={{ display: 'flex', alignItems:"center", padding: '2px 10px'}} onClick={handleNavigate}>
                <div style={{marginRight:"10px"}} >
                    {renderContent()}
                </div>
                <div >
                    {notification?.content}
                </div>
            </div>
        </div>
    )
}
