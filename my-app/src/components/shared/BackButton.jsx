import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button 
        onClick={() => navigate (-1)}
        aria-label="Go Back"
        className="bg-[#025cca] p-3 text-xl font-bold rounded-full text-[#f5f5f5] hover:bg-[#0a4fa8] transition-colors"
        >
            <IoArrowBack/>
        </button>
    
    );
};

export default BackButton;