'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";

const SwitchSection = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col mt-20 w-[600px]">
            <div className="px-4 text-[20px] text-white font-semibold">Get Started</div>
            <div className="px-4 text-box-fontSub text-[16px] mt-3">Select an element to get started</div>
            <div className="flex flex-col gap-4 p-4 border-[#1C1C1E] bg-[#0E0E10] rounded-[20px] border mt-6">
                <div className="flex flex-col py-4 px-3 gap-5 bg-[#0B0B0D] border border-[#25252799] rounded-[8px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
                        <button
                            className={`text-white rounded-md flex flex-col items-center justify-center py-7 px-2 md:px-16 relative cursor-pointer bg-[#29292980] shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)]`}
                            onClick={() => router.push('/edith')}
                        >
                            <div className="flex items-center gap-2">
                                <Image src="/logo-ryxen.svg" alt="edith-logo" className="h-[22px] w-auto" width={100} height={22} />
                                <span className="text-[16px] text-nowrap">EDITH</span>
                            </div>
                        </button>
                        <button
                            className={`text-white rounded-md flex flex-col items-center justify-center py-7 px-2 md:px-16 relative cursor-pointer bg-[#29292980] shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)]`}
                            onClick={() => router.push('/dashboard')}
                        >
                            <div className="flex items-center gap-2">
                                <Image src="/logo-ryxen.svg" alt="edith-logo" className="h-[22px] w-auto" width={100} height={22} />
                                <span className="text-[16px] text-nowrap">ULTRON</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SwitchSection;