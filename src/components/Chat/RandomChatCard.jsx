import React from 'react'
import styles from './RandomChatCard.module.css'
import {IoArrowBack} from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { GiMale, GiFemale } from "react-icons/gi";
import { Card } from 'antd';
import {useTranslation} from "react-i18next";
const { Meta } = Card;

export default function RandomChatCard({modal, back, userInfo, searchUser, createChat}) {
    const { t } = useTranslation();

    return (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{ minHeight: '450px' }}>
                    <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                        <div><IoArrowBack size={25} style={{marginTop: '10px', marginLeft: '15px'}} onClick={back}/></div>
                        <div><IoMdClose size={28} style={{marginTop: '10px', marginRight: '15px'}} onClick={modal}/></div>
                            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={modal}></button> */}
                    </div>
                    {/* <button type="button" className="btn-close closeButton" data-bs-dismiss="modal" aria-label="Close" onClick={modal}></button> */}
                    <div className="modal-body" style={{alignContent: "center"}}>
                        <Card
                            style={{width: "100%", height: "100%"}}
                            cover={
                                <div className={styles.imageWrapper} >
                                    <div className={styles.profileImageWrapper}>
                                        <img
                                            src={userInfo?.profileurl ? userInfo.profileurl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                            alt="profile"
                                            className={styles.image}
                                        />
                                    </div>

                                    <div className={styles.countryImageWrapper}>
                                        <img className={styles.country} alt='country' src={`/${userInfo.country}.png`} />
                                    </div>
                                </div>
                            }
                        >
                            <Meta
                                title={
                                    <div style={{display: "flex"}}>
                                        {/* 닉네임 */}
                                        <div style={{fontWeight : "bold", fontSize: "15px", overflow: "hidden", maxWidth: "90px", textOverflow: "ellipsis"}}>{userInfo.nickname}</div>

                                        {/* 성별, 나이 */}
                                        <div style={{fontWeight:"normal", display:"flex", marginLeft:"10px"}}>
                                            {userInfo?.gender === "MAN" ? (
                                                    <GiMale color='blue' size={20} />
                                            ):(
                                                <GiFemale color='red' size={20}/>
                                            )}
                                            <div style={{fontSize:"13px", marginLeft:"3px"}}>{userInfo.age}</div>
                                        </div>
                                    </div>
                                }
                                description={
                                    <div style={{display: "flex", flexDirection: "column", color: "black"}}>
                                        {/* 소개 */}
                                        {userInfo?.introduce ? (
                                            <div className={styles. introduce}>
                                                {userInfo?.introduce}
                                            </div>
                                        ) : (
                                            <div className={styles.noIntroduce} style={{height: "30px", textAlign: "left", color: "#00000073", fontSize: "13px"}}>{t('createRandomChat.introduce')}</div>
                                        )}
                                    </div>
                                }
                            />
                        </Card>
                    </div>
                    <div className="modal-footer" style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", height: "50px"}}>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{display:"inline-block", width:"45%"}} onClick={()=>{modal(); searchUser();}}>{t('createRandomChat.pass')}</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{display:"inline-block", width:"45%"}} onClick={()=>{modal(); createChat(userInfo);}}>{t('createRandomChat.chatting')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
