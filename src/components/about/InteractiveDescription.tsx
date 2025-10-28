'use client';

interface InteractiveItem {
  title: string;
}

interface InteractiveDescriptionProps {
  items?: InteractiveItem[];
  className?: string;
}

export default function InteractiveDescription({
  items,
  className = '',
}: InteractiveDescriptionProps) {
  // Default items using available images
  const defaultItems: InteractiveItem[] = [
    {
      title: 'Cô đang ở độ tuổi mà không quá lớn để quên rằng mình cũng là một đứa trẻ,',
    },
    {
      title: 'cũng không quá nhỏ để thôi phấn đấu cho điều cô tin là đẹp.',
    },
    {
      title: 'Ranh giới ấy khiến cô tin rằng',
    },
    {
      title: 'những điều tốt đẹp vẫn hiện hữu,',
    },
    {
      title: 'chỉ cần chúng ta chịu mở lòng.',
    },
  ];

  const displayItems = items || defaultItems;

  return (
    <div
      className={`h-[80vh] relative [clip-path:polygon(0_0,0_100%,100%_100%,100%_0)] ${className}`}
    >
      {/* Text Container */}
      <div className="absolute w-full h-full flex items-center justify-center flex-col z-[1] bg-black/50">
        {displayItems.map((item, index) => (
          <p
            key={index}
            className="text-[2.2vw] cursor-default m-0 uppercase text-white font-bold tracking-tight hover:text-gray-300 transition-colors duration-300"
          >
            {item.title}
          </p>
        ))}
      </div>
    </div>
  );
}