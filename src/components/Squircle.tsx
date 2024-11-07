import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
     cornerRadius?: number;
     cornerSmoothing?: number;
}

const Squircle: React.FC<SquircleProps> = ({
     children,
     className,
     cornerRadius = 20,
     cornerSmoothing = 100,
     ...props
}) => {
     const childrenRef = useRef<HTMLDivElement | null>(null);
     const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

     const updateDimensions = useCallback(() => {
          if (childrenRef.current) {
               const { width, height } = childrenRef.current.getBoundingClientRect();
               setDimensions({ width, height });
          }
     }, []);


     useEffect(() => {
          updateDimensions();
          window.addEventListener("resize", updateDimensions);
          return () => window.removeEventListener("resize", updateDimensions);
     }, [updateDimensions]);

     const dynamicCornerRadius = cornerRadius * (cornerSmoothing / 100);

     const svgPath = `
    M${dynamicCornerRadius},0 
    h${dimensions.width - dynamicCornerRadius * 2} 
    a${dynamicCornerRadius},${dynamicCornerRadius} 0 0 1 ${dynamicCornerRadius},${dynamicCornerRadius} 
    v${dimensions.height - dynamicCornerRadius * 2} 
    a${dynamicCornerRadius},${dynamicCornerRadius} 0 0 1 -${dynamicCornerRadius},${dynamicCornerRadius} 
    h-${dimensions.width - dynamicCornerRadius * 2} 
    a${dynamicCornerRadius},${dynamicCornerRadius} 0 0 1 -${dynamicCornerRadius},-${dynamicCornerRadius} 
    v-${dimensions.height - dynamicCornerRadius * 2} 
    a${dynamicCornerRadius},${dynamicCornerRadius} 0 0 1 ${dynamicCornerRadius},-${dynamicCornerRadius} 
    z
  `;

     const svgMask = encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimensions.width} ${dimensions.height}" width="${dimensions.width}" height="${dimensions.height}">
            <path d="${svgPath}" fill="white" />
          </svg>
        `);

     return (
          <div
               ref={childrenRef}
               className={cn("relative w-full h-full", className)}
               style={{
                    maskImage: `url("data:image/svg+xml,${svgMask}")`,
                    WebkitMaskImage: `url("data:image/svg+xml,${svgMask}")`,
                    maskSize: '100% 100%',
                    WebkitMaskSize: '100% 100%',
               }}
               {...props}>

               {children}
          </div>
     );
};

export default Squircle;