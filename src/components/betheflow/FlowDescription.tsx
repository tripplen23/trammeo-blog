'use client';

import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export default function FlowDescription() {
    return (
        <section className="bg-white text-black py-24 px-4 md:px-8">
            {/* Top Section: Title and Text */}
            <div className="max-w-6xl mx-auto md:ml-[10%]">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-20">
                    {/* Title */}
                    <div className="md:w-1/3 flex justify-center md:justify-end">
                        <h2 className={`${playfair.className} text-5xl md:text-7xl leading-tight text-right`}>
                            Go<br />
                            With<br />
                            The<br />
                            Flow
                        </h2>
                    </div>

                    {/* Text Columns */}
                    <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <p className="text-sm md:text-base leading-relaxed text-justify font-light opacity-80">
                            &ldquo;Go with the flow&rdquo; là nơi khởi nguồn mọi giấc mơ dang dở, tất cả như một dòng chảy cứ mãi trôi, dịu dàng và kiên định.
                        </p>
                        <p className="text-sm md:text-base leading-relaxed text-justify font-light opacity-80">
                            Và dòng chảy cuộc đời đã mang chiếc lá nhỏ đến đây, đến với hiện tại này, nơi cô học cách BeTheFlow, trở thành dòng chảy ấy: Tự do.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Image - Separate container to keep it centered */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="w-full h-[40vh] md:h-[60vh] relative overflow-hidden">
                    <Image
                        src="/images/bg3.webp"
                        alt="Water flowing over rocks"
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                </div>
            </div>
        </section>
    );
}
