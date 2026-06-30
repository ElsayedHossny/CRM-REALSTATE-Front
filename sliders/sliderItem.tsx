/*Ensure you have installed the package
or read our installation document. (go to lightswind.com/components/Installation)
npm i lightswind@latest*/

"use client";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./slider.css";
import Image from "next/image";
// --- Type Definitions ---
interface Slide {
  id: number;
  src: string;
  // href: string;
}

interface ThreeDImageCarouselProps {
  /** The array of image data for the slider. */
  slides: Slide[];
  /** Number of visible items in the slider (3 or 5). Default is 5. */
  itemCount?: 3 | 5;
  /** Enables/Disables automatic sliding. Default is false. */
  autoplay?: boolean;
  /** Delay in seconds for autoplay. Default is 3. */
  delay?: number;
  /** Pauses autoplay when the mouse hovers over the slider. Default is true. */
  pauseOnHover?: boolean;
  /** Tailwind class for the main container (e.g., margins, padding). */
  className?: string;
}

// --- Helper Function: Get Slide Classes ---
const getSlideClasses = (
  index: number,
  activeIndex: number,
  total: number,
  visibleCount: 3 | 5,
): string => {
  const diff = index - activeIndex;
  if (diff === 0) return "now";
  if (diff === 1 || diff === -total + 1) return "next";
  if (visibleCount === 5 && (diff === 2 || diff === -total + 2)) return "next2";
  if (diff === -1 || diff === total - 1) return "prev";
  if (visibleCount === 5 && (diff === -2 || diff === total - 2)) return "prev2";
  return "";
};

// --- ThreeDImageCarousel Component Logic ---
export const ThreeDImageCarousel: React.FC<ThreeDImageCarouselProps> = ({
  slides,
  itemCount = 5,
  autoplay = false,
  delay = 3,
  pauseOnHover = true,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayIntervalRef = useRef<number | null>(null);
  const total = slides.length;

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const swipeThreshold = 50;

  const navigate = useCallback(
    (direction: "next" | "prev") => {
      setActiveIndex((current) => {
        if (direction === "next") {
          return (current + 1) % total;
        } else {
          return (current - 1 + total) % total;
        }
      });
    },
    [total],
  );

  const startAutoplay = useCallback(() => {
    if (autoplay && total > 1) {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
      autoplayIntervalRef.current = window.setInterval(() => {
        navigate("next");
      }, delay * 1000);
    }
  }, [autoplay, delay, navigate, total]);

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  // Handler to stop autoplay on hover
  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      stopAutoplay();
    }
  };

  // Handler to start autoplay on mouse exit AND handle drag cancellation
  const handleExit = (e: React.MouseEvent) => {
    // 1. Autoplay resume logic
    if (autoplay && pauseOnHover) {
      startAutoplay();
    }

    // 2. Drag cancellation logic (Equivalent to the removed onMouseLeaveDrag)
    if (isDragging) {
      handleEnd(e.clientX);
    }
  };

  // --- Touch/Mouse Drag Logic ---
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    stopAutoplay();
  };

  const handleEnd = (clientX: number) => {
    if (!isDragging) return;

    const distance = clientX - startX;

    if (Math.abs(distance) > swipeThreshold) {
      if (distance < 0) {
        navigate("next"); // Swipe left (negative distance) -> show next slide
      } else {
        navigate("prev"); // Swipe right (positive distance) -> show previous slide
      }
    }

    setIsDragging(false);
    setStartX(0);
    // Autoplay is resumed by the useEffect on state change or by handleExit/onMouseUp
  };

  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX);
    startAutoplay(); // Resume autoplay when mouse button is released
  };

  const onTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    handleEnd(e.changedTouches[0].clientX);
    startAutoplay(); // Resume autoplay after touch interaction
  };

  return (
    <>
      {/* 2. SLIDER HTML STRUCTURE */}
      <div
        className={`cascade-slider_container ${className} bg-transparent 
               `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleExit}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cascade-slider_slides">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`cascade-slider_item ${getSlideClasses(index, activeIndex, total, itemCount)}`}
              data-slide-number={index}
            >
              <Image
                src={slide.src}
                alt={`Slide ${index + 1}`}
                width={200}
                height={200}
                // Fallback for image loading
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://placehold.co/350x200/4F46E5/ffffff?text=Slide%20${index + 1}`;
                }}
              />
              <div className="relative overflow-hidden rounded-[32px] shadow-2xl">
                <Image
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  width={300}
                  height={400}
                  className=" object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Fully Tailwind-styled) */}
        {total > 1 && (
          <>
            <span
              className="cascade-slider_arrow cascade-slider_arrow-left rounded-full bg-orange-500 text-white p-2 hover:bg-orange-600 transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                navigate("prev");
              }}
              data-action="prev"
            >
              <ArrowLeftCircle className="  " size={30} />
            </span>
            <span
              className="cascade-slider_arrow cascade-slider_arrow-right rounded-full bg-orange-500 text-white p-2 hover:bg-orange-600  transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                navigate("next");
              }}
              data-action="next"
            >
              <ArrowRightCircle size={30} />
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default ThreeDImageCarousel;
