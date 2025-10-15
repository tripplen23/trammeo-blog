'use client';

export default function ContentSection() {
  return (
    <div className='bg-[#F5F5F0] py-32 px-6'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-5xl md:text-6xl font-bold mb-12 text-[#5D866C]'>
          Khám Phá Thế Giới Qua Lời Viết
        </h2>
        
        <div className='space-y-8 text-[#5D866C]/80 text-lg md:text-xl leading-relaxed'>
          <p>
            Bên rìa thế giới là nơi những câu chuyện được kể lại, 
            nơi những suy nghĩ được ghi lại, và nơi những trải nghiệm 
            được chia sẻ qua lăng kính cá nhân.
          </p>
          
          <p>
            Đây là không gian dành cho những ai yêu thích văn học, 
            viết lách sáng tạo, và những góc nhìn độc đáo về cuộc sống.
          </p>
          
          <p className='text-2xl md:text-3xl font-semibold text-[#5D866C] mt-16'>
            &ldquo;Mỗi câu chuyện là một hành trình khám phá bản thân&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

