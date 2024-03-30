import {IoArrowBack} from "react-icons/io5";
import React, {useEffect, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom";
import "./Auth.css";
import AddLanuageModal from "../Profile/Modal/AddLanuageModal";
import PercentBar from "../../components/PercentBar/PercentBar";

const SignUpOption = () => {
    const navigate = useNavigate(); // 다른 component 로 이동할 때 사용
    const location = useLocation();
    // 선택된 태그들을 저장할 상태
    const [selectedPurTags, setSelectedPurTags] = useState([]);
    const [finalPurpose, setFinalPurpose] = useState(""); // 최종적으로 선택된 주 목적 태그를 저장하는 상태변수
    const [selectedIntTags, setSelectedIntTags] = useState([]);
    // 관심사 태그 선택 개수가 10개를 초과하는지 확인하는 상태
    const [isOverSelectedIntTags, setIsOverSelectedIntTags] = useState(false);
    // 국적 상태 설정
    const [nationality, setNationality] = useState("");
    const handleNationalityChange = (e) => {
        setNationality(e.target.value);
    };
    const [isModalOpened1, setIsModalOpened1] = useState(false); //사용 언어 추가 모달창
    const [isModalOpened2, setIsModalOpened2] = useState(false); //학습 언어 추가 모달창
    const [usedLanguages, setUsedLanguages] = useState({});
    const [learningLanguages, setLearningLanguages] = useState({});


    // IoArrowBack 클릭 시 이전 경로로 이동
    const goBackToPreviousPath = () => {
        const previousPath = location.state?.from || "/"; // 이전 경로가 없으면 기본 경로는 "/"
        navigate(previousPath, {}); // 이전 페이지로 이동
    };

    // 버튼 활성화 조건
    const isButtonEnabled =
        selectedPurTags.length >= 1 &&
        selectedIntTags.length >= 3 &&
        selectedIntTags.length <= 10 &&
        finalPurpose !== "" &&
        nationality !== "" &&
        Object.keys(usedLanguages).length > 0 && // 사용 언어가 선택되었는지 확인
        Object.keys(learningLanguages).length > 0; // 학습 언어가 선택되었는지 확인

    const purposeTag = [
        "언어 교류",
        "친목",
        "문화 교류"
    ];

    const interestTag = [
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

    const purposeTagClick = (tag) => {
        // 선택된 태그가 이미 selectedTags 배열에 있으면 제거, 없으면 추가
        setSelectedPurTags(prev => {
            if (prev.includes(tag)) {
                return prev.filter(t => t !== tag);
            } else {
                return [...prev, tag];
            }
        });
    };

    // 최종 주 목적 태그 선택 함수
    const selectFinalPurpose = (tag) => {
        setFinalPurpose(tag); // 선택된 태그를 최종 목적으로 저장
    };

    const interestTagClick = (tag) => {
        setSelectedIntTags(prev => {
            // 선택된 태그가 이미 있으면 제거, 없으면 추가
            const updatedTags = prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag];
            // 선택된 관심사 태그 개수가 10개를 초과하는지 확인
            setIsOverSelectedIntTags(updatedTags.length > 10); // 10개를 넘으면 true
            return updatedTags;
        });
    };

    // 사용 언어 추가 함수
    const handleMyLanguages = (language, level) => {
        // 언어와 퍼센트 값을 사용하여 usedLanguages 업데이트
        setUsedLanguages(prev => ({
            ...prev,
            [language]: level
        }));
    };

    // 사용 언어 삭제 함수
    const deleteMyLanguage = (language) => {
        const updatedMyLanguages = { ...usedLanguages }; // usedLanguages 상태의 복사본 생성
        delete updatedMyLanguages[language];
        setUsedLanguages(updatedMyLanguages);
    };

    // 학습 언어 추가 함수
    const handleWantLanguages = (language, level) => {
        setLearningLanguages(prev => ({
            ...prev,
            [language]: level
        }));
    };

    // 학습 언어 삭제 함수
    const deleteWantLanguage = (language) => {
        const updatedWantLanguages = { ...learningLanguages };
        delete updatedWantLanguages[language];
        setLearningLanguages(updatedWantLanguages);
    };

    useEffect(() => {
        if (selectedPurTags.length === 1) {
            setFinalPurpose(selectedPurTags[0]);
        } else {
            // 여러 태그가 선택되었거나, 태그가 전혀 선택되지 않은 경우
            setFinalPurpose('');
        }
    }, [selectedPurTags]);


    const testtt = () => {
        console.log("가입 목적: ", selectedPurTags);
        console.log("최종 가입 목적: ", finalPurpose);
        console.log("관심사: ", selectedIntTags);
        console.log("사용 언어: ", usedLanguages);
        console.log("학습 언어: ", learningLanguages);
    };

    return (
        <div style={{ backgroundColor: '#FBFBF3', minHeight: '100vh' }}>
            <IoArrowBack style={{ fontSize: '25px', marginTop: '20px', marginLeft: '20px'}} onClick={goBackToPreviousPath}/>
            <div className="auth-layout">
                <div className="setup-title">꼭 맞는 친구 추천을 위해 <br />추가정보를 선택해주세요</div>
                <div className="setup-subTitle">가입 목적 (최소 1개)</div>
                <div className="tagWrap">
                    {purposeTag.map((tag) => (
                        <button
                            key={tag}
                            className={`purpose-tag ${selectedPurTags.includes(tag) ? 'selectedPurTag' : ''}`}
                            onClick={() => purposeTagClick(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/*목적 태그를 여러 개 선택했을 경우*/}
                {selectedPurTags.length > 1 && (
                    <div>
                        <div className="setup-subTitle">주 목적은 어떤 것인가요?</div>
                        <div className="tagWrap">
                            {selectedPurTags.map((tag) => (
                                <button
                                    key={tag}
                                    className={`purpose-tag ${finalPurpose.includes(tag) ? 'selectedPurTag' : ''}`}
                                    onClick={() => selectFinalPurpose(tag)} // 선택된 태그를 다시 클릭하면 제거됨
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="setup-subTitle">관심사 (최소 3개, 최대 10개)</div>
                <div className="tagWrap">
                    {interestTag.map((tag) => (
                        <button
                            key={tag}
                            className={`interest-tag ${selectedIntTags.includes(tag) ? 'selectedIntTag' : ''}`}
                            onClick={() => interestTagClick(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                    {isOverSelectedIntTags && (
                        <div className="interest-tag-warning">
                            10개 이하로 선택해주세요.
                        </div>
                    )}
                </div>

                <div className="setup-subTitle">국적</div>
                <select className="box" id="birth-year" onChange={handleNationalityChange} defaultValue="">
                    <option value="" disabled>국적을 선택해주세요</option>
                    <option value="Korea">Republic of Korea</option>
                    <option value="China">People's Republic of China</option>
                    <option value="Japan">Japan</option>
                </select>

                {/*사용 언어*/}
                <div className="setup-subTitle-container">
                    <div className="setup-subTitle">사용 언어</div>
                    {Object.keys(usedLanguages).length > 0 ? (
                        <button className="after-select" onClick={() => {setIsModalOpened1(true)}}>
                            Add Language More
                        </button>
                    ) : (
                        <div className="add-language-container">
                            <button className="add-language" onClick={() => {setIsModalOpened1(true)}}>
                                Add Language
                            </button>
                        </div>
                    )}
                </div>
                {isModalOpened1&&<AddLanuageModal handleModal={()=>{setIsModalOpened1(false)}} addLanguage={handleMyLanguages}/>}
                <div>
                    {Object.entries(usedLanguages).map(([language, level]) => (
                        <div key={language}>
                            <PercentBar language={language} level={level} onDelete={deleteMyLanguage} color={"blue"}/>
                        </div>
                    ))}
                </div>

                {/*학습 언어*/}
                <div className="setup-subTitle-container">
                    <div className="setup-subTitle">학습 언어</div>
                    {Object.keys(learningLanguages).length > 0 ? (
                        <button className="after-select" onClick={() => {setIsModalOpened2(true)}}>
                            Add Language More
                        </button>
                    ) : (
                        <div className="add-language-container">
                            <button className="add-language" onClick={() => {setIsModalOpened2(true)}}>
                                Add Language
                            </button>
                        </div>
                    )}
                </div>
                {isModalOpened2&&<AddLanuageModal handleModal={()=>{setIsModalOpened2(false)}} addLanguage={handleWantLanguages}/>}
                <div>
                    {Object.entries(learningLanguages).map(([language, level]) => (
                        <div key={language}>
                            <PercentBar language={language} level={level} onDelete={deleteWantLanguage} color={"red"}/>
                        </div>
                    ))}
                </div>

                <button className="authButton"
                        disabled={!isButtonEnabled}>
                    선택 완료
                </button>

                <button onClick={testtt}>test</button>

            </div>
        </div>
    )
}
export default SignUpOption;