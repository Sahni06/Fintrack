"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
    const imageRef = useRef();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            setScrolled(scrollPosition > scrollThreshold);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const imageStyle = scrolled
        ? {
            transform: "rotateX(0deg) scale(1) translateY(40px)",
            transition: "transform 0.5s ease-out",
            willChange: "transform"
        }
        : {
            transform: "rotateX(15deg) scale(1)",
            transition: "transform 0.5s ease-out",
            willChange: "transform"
        };

    return (
        <div className="pb-20 px-4">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl md:text-8xl lg:text-[90px] pb-2 bg-gradient-to-br from-blue-600 to-purple-600 text-transparent bg-clip-text font-extrabold tracking-tighter pr-2 ">
                    Manage Your Finances <br /> with Intelligence
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    An AI-powered financial management platform that helps you track, analyze, and optimize your spending with real-time insights.
                </p>
                
                <div className="flex justify-center space-x-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8 bg-black text-white">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="#">
                        <Button size="lg" variant="outline" className="px-8">
                            Watch Demo
                        </Button>
                    </Link>
                </div>
                <div style={{ perspective: "1000px" }}>
                    <div
                        ref={imageRef}
                        style={imageStyle}
                    >
                        <Image
                            src="/banner.jpeg"
                            width={1280}
                            height={720}
                            alt="Dashboard Preview"
                            className="rounded-lg shadow-2xl border mx-auto"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
