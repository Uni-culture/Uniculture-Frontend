import React, { useState } from 'react'
import styles from './ImgSlider.module.css'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import './slick-theme.css'
import { useNavigate } from 'react-router-dom'
import img1 from './images/img1.jpg'

export default function ImgSlider() {
    const navigate = useNavigate();

    const images = [
        {src: img1, link: "/board/1"},
        {src: img1, link: null},
        {src: img1, link: null},
    ];

    var settings = {
        arrows: false,
        dots: true,
        infinite: true,
        lazyLoad: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "linear",
        slidesToScroll: 1,
    };

    const handleNavigate = (link) => {
        if(link !== null) navigate(link);
    }

    return (
        <div className={styles.slider}>
            <Slider {...settings}>
                {images.map((item, index)=> (
                    <div className={styles.imgWrap} key={index} onClick={() => handleNavigate(item.link)}>
                        <img 
                            className={styles.img}
                            alt="이미지"
                            src={item.src}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}
