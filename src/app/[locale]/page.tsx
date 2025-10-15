import SmoothScroll from '@/components/home/SmoothScroll';
import AnimatedNavigation from '@/components/home/AnimatedNavigation';
import TransitionEffect from '@/components/shared/TransitionEffect';

export default function HomePage() {
  return (
    <SmoothScroll>
      <TransitionEffect />
      <main>
        <AnimatedNavigation />
      </main>
    </SmoothScroll>
  );
}

