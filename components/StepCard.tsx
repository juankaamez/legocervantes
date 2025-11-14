
import React from 'react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export const StepCard: React.FC<StepCardProps> = ({ stepNumber, title, description, imageUrl, icon, children }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:border-indigo-500 hover:shadow-indigo-500/20">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          {/* Left side: content */}
          <div className={`flex-1 ${imageUrl ? 'md:w-3/5' : 'w-full'}`}>
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-xl mr-4">
                {stepNumber}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {icon}
                  {title}
                </h3>
              </div>
            </div>
            <p className="text-gray-300 mb-6">{description}</p>
            {children && <div className="mt-4">{children}</div>}
          </div>

          {/* Right side: image */}
          {imageUrl && (
            <div className="flex-shrink-0 md:w-2/5 mt-6 md:mt-0">
              <img 
                src={imageUrl} 
                alt={title} 
                className="rounded-lg object-cover w-full h-full shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
