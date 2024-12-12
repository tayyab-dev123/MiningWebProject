import Image from "next/image";
const Footer = () => {
  return (
    <footer className="md:mx-5 mx-2.5 rounded-[30px] bg-secondary md:px-6 py-12 text-white mb-4 ">
      <div className="mx-auto flex max-w-6xl flex-col items-center lg:flex-row lg:justify-between lg:space-x-8">
        {/* Left Side */}
        <div className="mb-8 md:px-24 px-5 text-center lg:mb-0 max-w-2xl  lg:text-left">
          <h2 className="mb-4 md:text-5xl text-4xl font-medium text-[#ffff] ">
            Embark on Your Tradifier Experience!
          </h2>
          <p className="mb-6  text-[#ffff] px-2 ">
            Tradifier simplifies your solar and IT trading process so you can
            grow your business and achieve greater profitability.
          </p>
          <button className="rounded-full bg-white px-6 py-2 text-xl font-medium text-[#000] transition hover:bg-primary hover:text-[#fff]">
            Join Tradifier Today
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="flex justify-center lg:w-1/2">
          <Image
            src="/footer1.png"
            alt="Solar House"
            width={300}
            height={300}
            className="rounded-lg object-contain"
          />
        </div>
      </div>

      {/* Bottom Links */}
      <div className="mt-10 border-t border-gray-700 pt-6 ">
        <div className="flex flex-col items-center justify-between space-y-4 rounded-2xl bg-[#ffffff] py-5 lg:flex-row lg:space-y-0 px-6 mx-3">
          {/* Logo */}
          <div className="flex items-center space-x-2 ">
            <svg
              className="h-8 w-40"
              viewBox="0 0 892.39 200.7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <style>{".cls-2{stroke-width:0;fill:#161e3c}"}</style>
              </defs>
              <g data-name="Layer 1">
                <path
                  className="cls-2"
                  d="M361.89 51.9h-36.87v113.82h-18.44V51.9h-36.87V34.03h92.18V51.9Zm-11.29 64.72c0-30.1 15.61-45.34 39.51-45.34h1.88v17.87h-1.88c-13.55 0-21.07 8.84-21.07 27.47v49.1H350.6v-49.1Zm94.63-46.47c26.15-.56 48.91 22.39 48.35 48.54v47.03h-18.44v-14.86c-4.52 9.22-16.93 16.37-29.91 16.37-26.15.56-49.1-22.39-48.54-48.54-.56-26.15 22.39-49.1 48.54-48.54Zm.19 17.87c-17.12 0-30.29 13.55-30.29 30.67s13.36 30.66 30.29 30.66 29.91-13.54 29.91-30.66-12.79-30.67-29.91-30.67Zm58.5 30.67c-.56-26.15 22.39-49.1 48.54-48.54 12.23 0 22.39 5.08 29.72 13.54V34.02h18.62v84.66c.56 26.15-22.2 49.1-48.35 48.54-26.15.56-49.1-22.39-48.54-48.54Zm48.54 30.66c16.93 0 30.1-13.54 30.1-30.66s-13.17-30.67-30.1-30.67-30.1 13.55-30.1 30.67 13.17 30.66 30.1 30.66ZM627.14 36.1c6.21 0 11.1 5.08 11.1 11.29s-4.89 11.29-11.1 11.29-11.29-5.08-11.29-11.29c0-6.58 5.08-11.29 11.29-11.29Zm-9.22 35.56h18.44v94.06h-18.44V71.66Zm43.83 17.87h-14.11V71.66h14.49c2.07-23.33 15.61-37.25 38.38-38.19v17.87c-11.29 1.32-19.19 8.28-19.94 20.32h19.94v17.87h-20.32v76.19h-18.44V89.53Zm61.14-53.43c6.21 0 11.1 5.08 11.1 11.29s-4.89 11.29-11.1 11.29-11.29-5.08-11.29-11.29c0-6.58 5.08-11.29 11.29-11.29Zm-9.21 35.56h18.44v94.06h-18.44V71.66ZM840.66 117c0 3.2-.19 6.02-.56 8.47h-76c1.51 14.11 12.98 23.89 28.03 23.89 9.22 0 16.74-3.2 22.58-9.41l22.01.19c-8.28 16.37-25.21 27.09-44.02 27.09-26.53.56-48.91-22.2-48.35-48.35-.56-26.15 21.63-49.29 47.78-48.73 24.46 0 47.78 18.44 48.54 46.84Zm-19.76-6.59c-3.57-12.98-14.86-22.39-28.22-22.39-14.3 0-25.02 9.03-28.6 22.39h56.82Zm30.1 6.21c0-30.1 15.61-45.34 39.51-45.34h1.88v17.87h-1.88c-13.55 0-21.07 8.84-21.07 27.47v49.1H851v-49.1Z"
                ></path>
                <path
                  d="m214.27 48.16-57.79 27.52V48.16H0V0h214.27v48.16zm-57.79 75.68-57.79 27.52v-27.52H49.35V75.68h107.13v48.16z"
                  style={{ fill: "#f6660d", strokeWidth: 0 }}
                ></path>
                <path
                  className="cls-2"
                  d="M49.35 151.36H98.7v49.35H49.35z"
                ></path>
              </g>
            </svg>{" "}
          </div>

          {/* Links */}
          <div className="flex flex-col  md:space-x-4 space-y-4 md:space-y-0 text-[#000] md:flex-row  ">
            <button className="rounded-full border border-[#000] px-4 py-2 transition hover:bg-white hover:text-[#1f2b57]">
              About
            </button>
            <button className="rounded-full border border-[#000] px-4  py-2 transition hover:bg-white hover:text-[#1f2b57]">
              Membership
            </button>
            <button className="rounded-full border border-[#000] px-4  py-2 transition hover:bg-white hover:text-[#1f2b57]">
              Demo
            </button>
          </div>
        </div>

        {/* Footer Bottom Text */}
        <div className="mt-6 text-center text-gray-400 flex md:flex-row  flex-col space-y-4 md:space-y-0  justify-between md:px-7 text-xs">
          <p>Copyright © 2024 Tradifier. All Rights Reserved.</p>
          <p className="md:mt-2">
            <a href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:text-white">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
