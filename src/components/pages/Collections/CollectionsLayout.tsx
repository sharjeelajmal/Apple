import React from 'react';

export default function CollectionsLayout({
  sidebar,
  children
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full mt-[80px] md:mt-[70px] sm:mt-[65px] mb-[60px] md:mb-[30px] sm:mb-[25px]">
      <div className="max-w-[1200px] w-[95%] xl:w-[95%] lg:w-[95%] md:w-[95%] sm:w-[95%] mx-auto px-[15px]">
        <div className="flex flex-wrap -mx-[15px]">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 px-[15px] hidden lg:block mb-[80px]">
            <div className="sticky top-[20px]">
              {sidebar}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4 px-[15px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
