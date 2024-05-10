import React, { useEffect, useState } from 'react'
import styles from './SearchUserCard.module.css';
import { GiMale, GiFemale } from "react-icons/gi";

export default function SearchUserCard({user}) {

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.profileImage}>
                <img
                    className={styles.image}
                    alt="profileimg"
                    src={user?.profileImage ? user.profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                />
            </div>
            <div className={styles.profileText}>
                <div className={styles.userInfo}>
                    <span className={styles.nicknameText}>{user?.nickname}</span>
                    <span className={styles.genderText}>
                        {user?.gender === "MAN" ? (
                                <GiMale color='blue' size={20} />
                        ):(
                            <GiFemale color='red' size={20}/>
                        )}
                    </span>
                    <span className={styles.ageText}>{user?.age}</span>
                </div>
                <div className={styles.btn}>
                </div>
            </div>
            <div className={styles.introduce}>{user?.introduce}</div>
        </div>
    )
}
