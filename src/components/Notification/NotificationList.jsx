import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { BiSolidEdit } from "react-icons/bi";
import { IoPersonAddSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { BiCommentDetail } from "react-icons/bi";

export default function NotificationList({notification, readNotification}) {
    const type = notification?.notificationType;
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        switch (type) {
            case "POST":
                setMessage(t('Notification.post'));
                break;
            case "COMMENT":
                setMessage(t('Notification.comment'));
                break;
            case "FRIEND":
                setMessage(t('Notification.friend'));
                break;
            default:
                setMessage('');
                break;
        }
    }, [type]);

    const renderContent = () => {
        switch (type) {
            case "POST":
                return (
                    <BiSolidEdit size={20} />
                );
            case "COMMENT":
                return (
                    <BiCommentDetail size={20} />
                );
            case "FRIEND":
                return (
                    <IoPersonAddSharp size={20} />
                );
            default:
                return null;
        }
    };

    const handleNavigate = () => {
        switch (type) {
            case "POST":
                readNotification(notification.id);
                navigate(`/board/${notification.relatedNum}`);
                break;
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
                    {notification?.content}{message}
                </div>
            </div>
        </div>
    )
}
