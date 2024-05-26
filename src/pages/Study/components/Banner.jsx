import React from 'react'
import styles from './Banner.module.css'

export default function Banner() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>함께 성장할 스터디를 모집해보세요</div>
            <div className={styles.subTitle}>새로운 언어, 새로운 친구! 지금 스터디에 참여하세요!</div>
        </div>
    )
}
