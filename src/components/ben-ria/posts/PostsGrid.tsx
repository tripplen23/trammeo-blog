import PostCard from '../PostCard';
import type { Post } from '@/lib/sanity';

interface PostsGridProps {
  posts: Post[];
}

export default function PostsGrid({ posts }: PostsGridProps) {
  return (
    <div className="overflow-x-auto pb-8 scrollbar-hide">
      <div className="flex gap-6 justify-center md:justify-start">
        {posts.map((post, index) => (
          <div
            key={`${post._id}-${index}`}
            className="w-[85vw] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1rem)] flex-none"
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
