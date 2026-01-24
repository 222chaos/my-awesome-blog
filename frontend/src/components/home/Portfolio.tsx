'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Github } from 'lucide-react';
import type { PortfolioItem } from '@/types';

export default function Portfolio() {
  const projects: PortfolioItem[] = [
    {
      id: '1',
      title: 'Tech Blog Platform',
      description: 'A modern blog platform built with Next.js, featuring glassmorphism design and excellent UX.',
      image: 'https://images.unsplash.com/photo-1461749280684-dacba89a4e6?w=600',
      tags: ['Next.js', 'React', 'TypeScript'],
      link: 'https://github.com/your-username/blog',
    },
    {
      id: '2',
      title: 'E-Commerce Dashboard',
      description: 'Full-featured admin dashboard with real-time analytics and inventory management.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e02f3?w=600',
      tags: ['Vue.js', 'Node.js', 'MongoDB'],
      link: 'https://github.com/your-username/ecommerce',
    },
    {
      id: '3',
      title: 'AI Chat Application',
      description: 'Intelligent chatbot powered by GPT with custom training capabilities.',
      image: 'https://images.unsplash.com/photo-1677442136019-7e8c6b6d22a?w=600',
      tags: ['Python', 'TensorFlow', 'FastAPI'],
      link: 'https://github.com/your-username/ai-chat',
    },
    {
      id: '4',
      title: 'Weather Forecast App',
      description: 'Beautiful weather app with geolocation and animated weather icons.',
      image: 'https://images.unsplash.com/photo-1592210450698-2e6c8b7b4a2?w=600',
      tags: ['React', 'API Integration', 'CSS Animations'],
      link: 'https://github.com/your-username/weather',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="glass-card p-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">
              Portfolio <span className="text-gradient">Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="web">Web Apps</TabsTrigger>
                <TabsTrigger value="mobile">Mobile Apps</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="glass-hover group cursor-pointer overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-tech-cyan transition-colors">
                          {project.title}
                        </h4>

                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full bg-glass/50 text-tech-cyan border border-tech-cyan/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-tech-cyan hover:text-tech-lightcyan font-medium group-hover:translate-x-2 transition-transform"
                        >
                          View Project
                          <ExternalLink className="ml-1 w-4 h-4" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="web" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.filter(p => p.tags.includes('React') || p.tags.includes('Vue.js')).map((project) => (
                    <Card
                      key={project.id}
                      className="glass-hover group cursor-pointer overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-tech-cyan transition-colors">
                          {project.title}
                        </h4>

                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full bg-glass/50 text-tech-cyan border border-tech-cyan/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-tech-cyan hover:text-tech-lightcyan font-medium group-hover:translate-x-2 transition-transform"
                        >
                          View Project
                          <ExternalLink className="ml-1 w-4 h-4" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mobile" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.filter(p => p.tags.includes('React Native')).map((project) => (
                    <Card
                      key={project.id}
                      className="glass-hover group cursor-pointer overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-tech-cyan transition-colors">
                          {project.title}
                        </h4>

                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full bg-glass/50 text-tech-cyan border border-tech-cyan/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-tech-cyan hover:text-tech-lightcyan font-medium group-hover:translate-x-2 transition-transform"
                        >
                          View Project
                          <Github className="ml-1 w-4 h-4" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
