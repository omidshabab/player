import VideoPlayer from "@/components/VideoPlayer";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-y-[50px]">
      <div className="flex flex-col gap-y-[10px] w-full text-start">
        <div className="text-[#001122]/80 font-medium leading-[1.4em] -tracking-[0.5px] text-left text-[20px]">
          Player{" "}
          <span className="text-[#303040B3]">
            {" "}
            / Video & Audio Player Components for ReactJS Projects
          </span>
          <div className="text-[18px] text-slate-600 font-normal">
            by omidshabab.
          </div>
        </div>
      </div>

      <VideoPlayer />
    </main>
  );
};

export default Page;
