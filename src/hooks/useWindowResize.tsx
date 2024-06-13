import { useEffect, useState } from "react";

export default function useWindowResize() {
  const [wWidth, setWWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return wWidth;
}
