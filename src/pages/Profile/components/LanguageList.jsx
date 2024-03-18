import React, { useEffect, useState } from 'react';

export default function LanguageList({ language, value, color}) {
    const [rgb, setRgb] = useState('');

    useEffect(()=>{
        if(color === "red") setRgb("rgb(255, 0, 0");
        else if(color === "blue") setRgb("rgb(13, 110, 253)");
    }, [color])

    return (
        <div style={{ display: 'flex', width: "280px", justifyContent: 'space-between', borderBottom: '1px solid #E0E0E0', padding: '10px 10px' }}>
            <div style={{marginRight: "20px"}}>{language}</div>
            <div>
                <div className="progress" style={{ width: '150px'}}>
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${value}%`, backgroundColor: rgb, transition: "none"}}
                        aria-valuenow={value}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        >
                        {`${value}%`}
                    </div>
                </div>
            </div>
        </div>
    );
};
