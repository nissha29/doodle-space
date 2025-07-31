import React from "react";

function Background() {
  return (
    <div>
      <div className="">
        <div className="absolute top-10 sm:top-60 left-1/4 z-0 m-auto size-1/4 bg-cyan-600 mt-96 sm:mt-0 opacity-50 sm:opacity-15 blur-[200px] rounded-full"></div>
      </div>
      <div className="">
        <div className="absolute top-10 sm:top-60 left-1/2 z-0 m-auto size-1/4 bg-cyan-600 mt-96 sm:mt-0 opacity-50 sm:opacity-25 blur-[200px] rounded-full"></div>
      </div>
      <div className="">
        <div className="absolute top-10 sm:top-60 left-1/12 z-0 m-auto size-1/4 bg-cyan-400 mt-96 sm:mt-0 opacity-50 sm:opacity-25 blur-[200px] rounded-full"></div>
      </div>
      <div className="">
        <div className="absolute top-10 sm:top-60 right-1/12 z-0 m-auto size-1/4 bg-cyan-400 mt-96 sm:mt-0 opacity-50 sm:opacity-15 blur-[200px] rounded-full"></div>
      </div>
    </div>
  );
}

export default Background;
