import React from 'react'
import styles from './Banner.module.css'
import {useTranslation} from "react-i18next";

export default function Banner() {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <div className={styles.title}>{t('studyBanner.title')}</div>
            <div className={styles.subTitle}>{t('studyBanner.subTitle')}</div>
        </div>
    )
}
