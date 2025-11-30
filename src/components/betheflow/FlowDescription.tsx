'use client';

import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { useTranslations } from 'next-intl';

const playfair = Playfair_Display({
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    preload: true,
    fallback: ['serif'],
});

export default function FlowDescription() {
    const t = useTranslations('beTheFlow.flowDescription');

    return (
        <section className="bg-white text-black py-24 px-4 md:px-8">
            {/* Top Section: Title and Text */}
            <div className="max-w-6xl mx-auto lg:ml-[6%] md:ml-[0%]">
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
                            {t('paragraph1')}
                        </p>
                        <p className="text-sm md:text-base leading-relaxed text-justify font-light opacity-80">
                            {t('paragraph2')}
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
                        loading="lazy"
                        quality={85}
                    />
                </div>
            </div>
        </section>
    );
}