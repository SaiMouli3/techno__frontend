import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../context/ContextProvider";

const Navbarr = () => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between z-[100] p-2 md:ml-6 md:mr-6 relative">
      <TooltipComponent content="Menu" position="BottomCenter">
        <button
          type="button"
          onClick={() => handleActiveMenu()}
          style={{ currentColor }}
          className="relative text-xl rounded-full p-3 "
        >
          <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
          <AiOutlineMenu color="white"/>
        </button>
      </TooltipComponent>
    </div>
  );
};

export default Navbarr;
