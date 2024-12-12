import TradifierHero from "@/components/home/aboutHeader";
import LandingLayout from "@/components/Layouts/LandingLayout";
import Teamabout from "@/components/Team";
import ModernFeatures from "@/components/whyChoice";
import React from "react";

function Team() {
 
  return (
    <div>
      <LandingLayout>
     <TradifierHero/>

        <section className="relative mr-0 py-12 2xsm:mx-6 md:mx-12 lg:mr-5 xl:mr-0 ">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-5">
            <div className="grid w-full grid-cols-1 items-center justify-start gap-10 lg:grid-cols-2 xl:gap-12">
              <div className="inline-flex w-full flex-col items-center justify-center gap-10 lg:items-start">
                <div className="flex w-full flex-col items-start justify-center gap-8">
                  <div className="flex flex-col items-center justify-start gap-4 lg:items-start">
                    <div className="mb-4 inline-block rounded-full bg-orange-500 px-3 py-1.5 text-sm font-bold uppercase tracking-[0.2rem] text-white">
                      About us{" "}
                    </div>
                    <div className="flex w-full flex-col items-center justify-start gap-2 lg:items-start">
                      <h2 className="font-manrope text-center text-5xl font-medium leading-normal text-secondary lg:text-start">
                        Who We Are{" "}
                      </h2>
                      <p className="text-center text-base md:text-lg font-normal leading-relaxed text-black lg:text-start">
                        Tradifier revolutionizes the way industries source their
                        assets. We unite a global network of trusted suppliers,
                        distributors, and certified recyclers, ensuring seamless
                        transactions and dependable partnerships. Whether you’re
                        in solar energy or IT industry, our trading hub is
                        engineered to support businesses of every scale—one
                        trade at a time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-start justify-center lg:justify-start">
                <div className="relative h-full w-full rounded-3xl border-gray-200 sm:h-[646px] sm:w-[564px] sm:border sm:bg-gray-100">
                  <img
                    className="h-full w-full rounded-3xl object-cover sm:ml-5 sm:mt-5"
                    src="https://pagedone.io/asset/uploads/1717742431.png"
                    alt="about Us image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
       <ModernFeatures/>
        {/* <TradifierPromise/> */}
      </LandingLayout>
    </div>
  );
}

export default Team;
