"use client";
import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export const MotionDiv = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    (props, ref) => {
        return <motion.div ref={ref} {...props} />;
    },
);

MotionDiv.displayName = "MotionDiv";
