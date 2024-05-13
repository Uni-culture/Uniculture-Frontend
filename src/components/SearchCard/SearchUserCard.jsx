import React, { useEffect, useState } from 'react'
import styles from './SearchUserCard.module.css';
import { GiMale, GiFemale } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

export default function SearchUserCard({user}) {
    const navigate = useNavigate();

    //친구 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${user.nickname}`);
    }

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.profileImage} onClick={handleProfile}>
                <img
                    className={styles.image}
                    alt="profileimg"
                    src={user?.profileImage ? user.profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                />
            </div>
            <div className={styles.profileText}>
                <div className={styles.userInfo}>
                    <span className={styles.nicknameText} onClick={handleProfile} >{user?.nickname}</span>
                    <span className={styles.genderText}>
                        {user?.gender === "MAN" ? (
                                <GiMale color='blue' size={20} />
                        ):(
                            <GiFemale color='red' size={20}/>
                        )}
                    </span>
                    <span className={styles.ageText}>{user?.age}</span>
                    <span >
                        <button className={styles.btn}>+ 친구 신청</button>
                    </span>
                </div>
                
            </div>
            <div className={styles.introduce}>{user?.introduce ? user.introduce : <span className={styles.introtext}>사용자가 설정한 소개가 없습니다.</span>}</div>
        </div>
    )
}
