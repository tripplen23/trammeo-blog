import { getTranslations } from 'next-intl/server';
import SmoothScroll from '@/components/home/SmoothScroll';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-white">
        {/* Main Content - Centered */}
        <section className="min-h-screen flex items-center justify-center px-10">
          <div className="max-w-4xl w-full">
            {/* Large Title */}
            <h1 className="text-[12vw] md:text-[8vw] font-bold leading-none mb-16 text-black">
              trammeo
            </h1>

            {/* Description */}
            <div className="space-y-8 text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
              <p>
                Chào mừng bạn đến với không gian cá nhân của tôi - nơi chia sẻ đam mê về viết lách và cà phê.
              </p>
              
              <p>
                <span className="font-semibold text-[#5D866C]">Bên Rìa Thế Giới</span> là nơi tôi ghi lại những suy nghĩ, 
                những mảnh ghép văn học và những trải nghiệm đời thường qua lăng kính cá nhân.
              </p>
              
              <p>
                <span className="font-semibold text-betheflow">BeTheFlow</span> ra đời từ đam mê với nghề barista - 
                từ việc chọn hạt, rang xay, đến từng giọt espresso hoàn hảo.
              </p>
            </div>

            {/* Contact Info */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Get in touch: <a href="mailto:hello@trammeo.com" className="text-black hover:underline">hello@trammeo.com</a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </SmoothScroll>
  );
}

