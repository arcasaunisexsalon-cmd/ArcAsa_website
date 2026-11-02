import {useState} from "react";
import { FaChevronRight, FaArrowLeft } from "react-icons/fa";
import {allSkin} from "../../constants/services/alskin"

const SkinFace = () =>{

    const [stack, setStack] = useState([]);//opened groups name

    const current = stack.length ? stack[stack.length-1]:null
    const list = current? current.items :allSkin;
    const title = current? current.name: "Skins";


    return(
        <div className="bg-[#1a1a1a] rounded-lg w-full h-full flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4">
            {
                current && (
                    <button
                    onClick={() => setStack(stack.slice(0,-1))}
                    aria-label="Black"
                    className="text-[#f5f5f5] p-2 rounded-full h-full hover:bg-[#1f1f1f]">
                        <FaArrowLeft/>
                    </button>
                )
            }

            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            {title}
            </h1>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
        {list.map((services) => {
          const hasChildren = Boolean(services.children);
          return(
            <div 
          key = {services.sid}
          onClick={() => 
            hasChildren &&
            setStack([...stack, {name: services.serviceName, items:services.children}])
          }
          className={`flex items-center justify-between bg-[#1f1f1f] rounded-[15px] px-6 py-4 mt-4 mx-6 ${hasChildren? "cursor-pointer hover:bg-[#262626]":""}`}
          >
            <h2 className="text-[#f5f5f5] font-semibold tracking-wide">{services.serviceName}</h2>
              {hasChildren ? (
                <FaChevronRight className="text-[#f5f5f5]" />
              ) : (
                <p className="text-[#f6b100] font-bold text-lg">₹{services.price}</p>
              )}
            </div>  
          );
        }
        )
}
      </div>
      </div>

    );
};
export default SkinFace;