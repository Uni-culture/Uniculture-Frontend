import React, { useEffect } from 'react'
import NotificationList from './NotificationList';

export default function NotificationModal({handleModal, myNotification, readNotification, readAllNotification}) {
    const renderContent = () => {
        switch (myNotification.length > 0) {
            case true:
                return (
                    <>
                        {myNotification.length > 0 && myNotification?.map((notification) => (
                            <NotificationList key={notification.id} notification={notification} readNotification={readNotification} />
                        ))}
                    </>
                );
            default:
                return <div style={{fontSize: "13px", color: "#737373"}}>알림이 없습니다.</div>;
        }
    };

    useEffect(() => {
        // 모달이 열렸을 때 body에 overflow: hidden 스타일을 적용하여 스크롤을 막음
        document.body.style.overflow = 'hidden';

        // 모달이 닫힐 때 body에 적용한 스타일을 제거하여 스크롤을 복원
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="modal fade show" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{height:"450px"}}>
                    <div className="modal-header" style={{width: "100%", justifyContent: "center"}}>
                        <div className="modal-title" style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center"}}>
                            알림창
                        </div>
                        {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleModal}></button> */}
                    </div>
                    {myNotification.length > 0 && <div style={{ width: "90%", textAlign: "right", fontSize: "15px", fontWeight: "bold", padding: "8px 0px 3px 0px"}} onClick={readAllNotification}>모두 읽기</div>}
                    <div className="modal-body" style={{width: "90%"}}>
                        {renderContent()}
                    </div>
                    
                    <div className="modal-footer" style={{width: "100%"}}>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{width: "100%"}} onClick={handleModal}>닫기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
