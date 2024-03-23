import React, { useEffect, useState } from 'react';

const PercentBar = ({ language, percentage, color}) => {
    const [percent, setPercent] = useState(percentage);
    const [rgb, setRgb] = useState('');
    // prop에서 percentage 값이 변경될 때마다 내부의 percent 상태를 업데이트합니다.
    useEffect(() => {
        setPercent(percentage);
    }, [percentage]);

    useEffect(()=>{
        if(color == "red") setRgb("rgb(255, 0, 0");
        else if(color == "blue") setRgb("rgb(13, 110, 253)");
    }, [color])

    return (
        <>
            <div className="d-flex align-items-center">
                {language && (<label style={{textAlign: "left", width: "50px", marginRight: "10px"}}>{language}</label>)}
                <div>
                    <div className="progress" style={{ width: '150px'}}>
                        <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${percent}%`, backgroundColor: rgb}}
                        aria-valuenow={percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        >
                        {`${percent}%`}
                        </div>
                    </div>
                </div>
            </div>     
        </>
    );
};

export default PercentBar;
