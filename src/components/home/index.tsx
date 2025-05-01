"use client";

import SectionOne from "./section-1";
import SectionTwo from "./section-2";

const HomeComponent = () => {
  return (
    <main className="flex min-h-[70dvh]">
      {/* Section 1 */}
      <div className="w-1/5 hidden md:block">
        {/* Content for section 1 */}
        <SectionOne />
      </div>

      {/* Section 2 */}
      <div className="w-full md:w-4/5 bg-black">
        {/* Content for section 2 */}
        <SectionTwo />
      </div>
    </main>
  );
};

export default HomeComponent;
