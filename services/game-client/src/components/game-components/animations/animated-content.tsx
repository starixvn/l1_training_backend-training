import React, { useEffect, useRef } from "react";

// Dynamic imports for SSR compatibility
let gsap: any = null;
let ScrollTrigger: any = null;

const loadGSAP = async () => {
    if (typeof window !== "undefined" && !gsap) {
        const gsapModule = await import("gsap");
        const scrollTriggerModule = await import("gsap/ScrollTrigger");
        
        gsap = gsapModule.gsap;
        ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        
        if (!(gsap as any)._scrollTriggerRegistered) {
            gsap.registerPlugin(ScrollTrigger);
            (gsap as any)._scrollTriggerRegistered = true;
        }
    }
    return { gsap, ScrollTrigger };
};

export type AnimatedContentProps = {
    children: React.ReactNode;
    distance?: number;
    direction?: "vertical" | "horizontal";
    reverse?: boolean;
    duration?: number;
    ease?: string;
    initialOpacity?: number;
    animateOpacity?: boolean;
    scale?: number;
    threshold?: number; // 0..1
    delay?: number;
    onComplete?: () => void;
};

const AnimatedContent: React.FC<AnimatedContentProps> = ({
    children,
    distance = 100,
    direction = "vertical",
    reverse = false,
    duration = 0.8,
    ease = "power3.out",
    initialOpacity = 0,
    animateOpacity = true,
    scale = 1,
    threshold = 0.1,
    delay = 0,
    onComplete,
}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") {
            return () => {};
        }

        const el = ref.current;
        if (!el) {
            return () => {};
        }

        // Load GSAP dynamically
        loadGSAP().then(({ gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance }) => {
            if (!gsapInstance || !ScrollTriggerInstance) return;

            const axis = direction === "horizontal" ? "x" : "y";
            const offset = reverse ? -distance : distance;
            const startPct = (1 - Math.min(Math.max(threshold, 0), 1)) * 100;

            gsapInstance.set(el, {
                [axis]: offset,
                scale,
                opacity: animateOpacity ? initialOpacity : 1,
            } as any);

            gsapInstance.to(el, {
                [axis]: 0,
                scale: 1,
                opacity: 1,
                duration,
                ease,
                delay,
                onComplete,
                scrollTrigger: {
                    trigger: el,
                    start: `top ${startPct}%`,
                    toggleActions: "play none none none",
                    once: true,
                },
            } as any);
        }).catch(() => {
            // Fallback: just show content without animation
            if (el) {
                el.style.opacity = "1";
                el.style.transform = "none";
            }
        });

        return () => {
            try {
                if (ScrollTrigger && typeof ScrollTrigger.getAll === "function") {
                    ScrollTrigger.getAll().forEach((t: any) => t.kill());
                }
                if (gsap && typeof gsap.killTweensOf === "function") {
                    gsap.killTweensOf(el);
                }
            } catch { }
        };
    }, [
        distance,
        direction,
        reverse,
        duration,
        ease,
        initialOpacity,
        animateOpacity,
        scale,
        threshold,
        delay,
        onComplete,
    ]);

    return <div ref={ref}>{children}</div>;
};

export default AnimatedContent;
