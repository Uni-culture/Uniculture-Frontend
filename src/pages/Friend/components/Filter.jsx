import React from 'react'
import { Select} from "antd";
import { GrClose, GrPowerReset } from "react-icons/gr";
import { useTranslation } from 'react-i18next';

export default function FilterModal({handleSelect, resetFilter, ge, mina, maxa, cl, wl, hb}) {
    const { Option } = Select;
    const { t } = useTranslation();

    const interestTag = [ // 관심사 태그
        "요리",
        "여행",
        "영화",
        "드라마",
        "애니메이션",
        "유튜브",
        "넷플릭스",
        "웹툰",
        "게임",
        "음악",
        "미술",
        "공예",
        "독서",
        "축구",
        "야구",
        "농구",
        "테니스",
        "배드민턴",
        "볼링",
        "탁구",
        "서핑",
        "스노우보드",
        "헬스",
        "명상",
        "요가",
        "필라테스",
        "과학",
        "패션",
        "메이크업",
        "헤어",
        "사진",
        "자연",
        "탐험",
        "캠핑",
        "등산",
        "재태크",
        "k-pop",
        "자원봉사",
        "사회공헌"
    ];

    return (
        <div style={{ marginTop:"10px"}}>
            <Select
                defaultValue="ge"
                value={ge} 
                style={{ width: 120, marginRight: "5px", marginBottom: "5px", display: "inline-block" }} 
                onChange={(value) => handleSelect(value, "gender")}
            >
                <Option value="ge" >Gender</Option>
                <Option value="MAN">Man</Option>
                <Option value="WOMAN">Woman</Option>
            </Select>

            <input 
                style={{width: "80px", height: "32px", display: "inline-block", marginRight: "5px", padding: "0 11px", borderRadius: "6px", border: "1px solid #d9d9d9", boxSizing: "border-box", fontSize: "14px"}} 
                placeholder={mina} 
                value={mina} 
                onChange={(e) => handleSelect(e.target.value, "mina")}
            />
            <input 
                style={{width: "80px", height: "32px", display: "inline-block", marginRight: "5px", padding: "0 11px", borderRadius: "6px", border: "1px solid #d9d9d9", boxSizing: "border-box", fontSize: "14px"}} 
                placeholder={maxa} 
                value={maxa} 
                onChange={(e) => handleSelect(e.target.value, "maxa")}
            />

            <Select
                defaultValue="cl"
                value={cl} 
                style={{ width: 150, display: "inline-block", marginRight: "5px" }} 
                onChange={(value) => handleSelect(value, "cl")}
            >
                <Option value="cl" >Can Language</Option>
                <Option value="한국어">한국어</Option>
                <Option value="영어">English</Option>
                <Option value="중국어">中文</Option>
                <Option value="일본어">日本語</Option>
                <Option value="스페인어">Español</Option>
            </Select>

            <Select
                defaultValue="wl"
                value={wl} 
                style={{ width: 150, display: "inline-block", marginRight: "5px" }} 
                onChange={(value) => handleSelect(value, "wl")}
            >
                <Option value="wl" >Want Language</Option>
                <Option value="한국어">한국어</Option>
                <Option value="영어">English</Option>
                <Option value="중국어">中文</Option>
                <Option value="일본어">日本語</Option>
                <Option value="스페인어">Español</Option>
            </Select>

            <Select
                defaultValue="hb"
                value={hb} 
                style={{ width: 150, display: "inline-block" }} 
                onChange={(value) => handleSelect(value, "hobby")}
            >
                <Option value="hb" >Interest</Option>
                {interestTag.map((hobby)=>(
                    <Option value={hobby}>{t(`interestTag.${hobby}`)}</Option>
                ))}
            </Select>

            <div style={{marginLeft: "10px", display: "inline-block"}} onClick={()=> {resetFilter();}}><GrPowerReset /></div>
            <div style={{marginLeft: "10px", display: "inline-block"}} onClick={()=> {resetFilter("false");}}><GrClose/></div>
        </div>
    )
}
