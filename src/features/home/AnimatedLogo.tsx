"use client";
import { cn } from "@/lib/utils";
import styles from "./AnimatedLogo.module.css";
import React, { useMemo } from "react";

function useScrollY() {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

export const AnimatedLogo = () => {
  const hasAnimated = React.useRef(false);
  const scrollY = useScrollY();
  const rick = useMemo(() => {
    if (scrollY > 150) {
      return "R";
    }

    if (scrollY > 100) {
      return "Ri";
    }

    if (scrollY > 50) {
      return "Ric";
    }

    return "Rick";
  }, [scrollY]);

  const woltheus = useMemo(() => {
    if (scrollY > 150) {
      return "W";
    }

    if (scrollY > 132) {
      return "Wo";
    }

    if (scrollY > 114) {
      return "Wol";
    }

    if (scrollY > 96) {
      return "Wolt";
    }

    if (scrollY > 78) {
      return "Wolth";
    }

    if (scrollY > 60) {
      return "Wolthe";
    }

    if (scrollY > 42) {
      return "Woltheu";
    }

    return "Woltheus";
  }, [scrollY]);

  const letters = useMemo(() => {
    if (scrollY > 165) {
      return `${rick}${woltheus}`;
    }
    return `${rick} ${woltheus}`;
  }, [rick, scrollY, woltheus]).split("");

  return (
    <h1 className="text-5xl font-normal group">
      {letters.map((letter, index) => {
        if (scrollY > 50) {
          return (
            <span
              key={index}
              className={cn(rick.length - 1 < index && "font-extrabold")}
              style={{ animationDelay: `${(letters.length - index) * 0.1}s` }}
            >
              {letter}
            </span>
          );
        }
        return (
          <span
            key={index}
            className={cn(
              !hasAnimated.current &&
                (rick.length > index
                  ? styles["animate-bold"]
                  : styles["animate-boldest"]),
              hasAnimated.current &&
                rick.length - 1 < index &&
                "font-extrabold",
            )}
            onAnimationEnd={() => (hasAnimated.current = true)}
            style={{ animationDelay: `${(letters.length - index) * 0.1}s` }}
          >
            {letter}
          </span>
        );
      })}
    </h1>
  );
};
