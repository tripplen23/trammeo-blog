'use client';

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

const defaultProjects: Project[] = [
    {
        title: 'Bên rìa thế giới',
        color: '#1a1a1a',
        route: '/ben-ria-the-gioi',
        description: 'Viết lách & suy ngẫm',
    },
    {
        title: '#betheflow',
        color: '#2d2d2d',
        route: '/betheflow',
        description: 'Barista',
    },
];



export default function ProjectGallery({ projects = defaultProjects }: ProjectGalleryProps) {

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="w-full">
        {projects.map((project, index) => (
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