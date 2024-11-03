import VideoPlayer from "@/components/VideoPlayer";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center px-[20px] py-[50px] lg:px-[95px] lg:py-[95px] gap-y-[50px]">
      <div className="flex flex-col gap-y-[10px] sm:gap-y-0 w-full text-start">
        <div className="text-[#001122]/80 font-medium leading-[1.4em] -tracking-[0.5px] text-left text-[20px]">
          Player{" "}
          <span className="text-[#303040B3]">
            {" "}
            / Video & Audio Player Components for ReactJS Projects
          </span>
        </div>
        <div className="text-[18px] text-slate-600 font-normal">
          by omidshabab.
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-x-[20px]">
        <div className="flex flex-grow">
          <VideoPlayer video="/sample.mp4" />
        </div>
        <div className="w-[550px]">

        </div>
      </div>
    </main>
  );
};

export default Page;
