import React, { useState } from 'react'
import Layout from '../../components/Layout'
import styles from './Study.module.css'
import { StudyCard } from './components/StudyCard'
import { FaSearch } from "react-icons/fa";

export const Study = () => {
  const [selectedMenu, setSelectedMenu] = useState('전체');


  //선택하면 그거에 맞는 서버 요청 시도 코드 추가해야함
  const handleMenuClick = (Menu) =>{
    return () => setSelectedMenu(Menu);
  }

  return (
    <Layout>
      <div className={styles.background}>
        <div className={styles.menu}>
          <button className={selectedMenu==='전체' ? styles.menubtn_selected : styles.menubtn} onClick={handleMenuClick('전체')}>전체</button>
          <button className={selectedMenu==='스터디' ? styles.menubtn_selected : styles.menubtn} onClick={handleMenuClick('스터디')}>스터디</button>
          <button className={selectedMenu==='멘토링' ? styles.menubtn_selected : styles.menubtn} onClick={handleMenuClick('멘토링')}>멘토링</button>
        </div>
        <div className={styles.opt}>
          <div className={styles.optbtn}>인기순</div>
          <div className={styles.optbtn}>분야</div>
          <div className={styles.searchBar}>
            <FaSearch/>
            <input className={styles.search} placeholder='제목, 글 내용을 검색해보세요'></input>
          </div>

        </div>
        <div className={styles.studyCards}>
          <StudyCard />
          <StudyCard />
          <StudyCard />
          <StudyCard />
          <StudyCard />
        </div>
      </div>
    </Layout>

    
  )
}
