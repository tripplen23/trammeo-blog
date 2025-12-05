'use client';

import { useTranslations } from 'next-intl';
import GalleryProject from './GalleryProject';

export interface Project {
  title: string;
  color: string;
  route: string;
  description?: string;
}

interface ProjectGalleryProps {
  projects?: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const t = useTranslations('about.exploreMore.projects');

  const defaultProjects: Project[] = [
    {
      title: t('benRia.title'),
      color: '#1a1a1a',
      route: '/ben-ria-the-gioi',
      description: t('benRia.description'),
    },
    {
      title: t('beTheFlow.title'),
      color: '#2d2d2d',
      route: '/betheflow',
      description: t('beTheFlow.description'),
    },
    {
      title: t('nguoiDiTrenMay.title'),
      color: '#87CEEB',
      route: '/nguoi-di-tren-may',
      description: t('nguoiDiTrenMay.description'),
    },
    {
      title: t('duHanhKhongGian.title'),
      color: '#2d2d2d',
      route: '/du-hanh-khong-gian',
      description: t('duHanhKhongGian.description'),
    },
  ];

  const projectsToDisplay = projects || defaultProjects;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="w-full">
        {projectsToDisplay.map((project, index) => (
          <GalleryProject
            key={index}
            title={project.title}
            description={project.description}
            route={project.route}
          />
        ))}
        {/* Add bottom border for last item */}
        <div className="border-b border-white/20" />
      </div>
    </div>
  );
}