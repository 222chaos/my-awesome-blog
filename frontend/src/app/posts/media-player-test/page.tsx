'use client';

import { useState } from 'react';
import MediaPlayer from '@/components/ui/MediaPlayer';

export default function MediaPlayerTestPage() {
  const [mediaItems] = useState([
    {
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      alt: '风景图片1',
      caption: '美丽的自然风光'
    },
    {
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      alt: '风景图片2',
      caption: '森林小径'
    },
    {
      type: 'video' as const,
      src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      alt: 'Big Buck Bunny 视频',
      caption: 'Big Buck Bunny 开源动画'
    }
  ]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">媒体播放器测试页面</h1>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">基本图片轮播</h2>
          <div className="h-64 md:h-96 overflow-hidden rounded-xl">
            <MediaPlayer 
              mediaItems={[{
                type: 'image',
                src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                alt: '风景图片',
                caption: '美丽的自然风光'
              }]} 
              autoPlay={false}
              aspectRatio="aspect-video"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">自动播放图片轮播</h2>
          <div className="h-64 md:h-96 overflow-hidden rounded-xl">
            <MediaPlayer 
              mediaItems={[
                {
                  type: 'image',
                  src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                  alt: '风景图片1',
                  caption: '美丽的自然风光'
                },
                {
                  type: 'image',
                  src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
                  alt: '风景图片2',
                  caption: '森林小径'
                }
              ]} 
              autoPlay={true}
              aspectRatio="aspect-video"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">视频播放</h2>
          <div className="h-64 md:h-96 overflow-hidden rounded-xl">
            <MediaPlayer 
              mediaItems={[{
                type: 'video',
                src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                alt: 'Big Buck Bunny 视频',
                caption: 'Big Buck Bunny 开源动画'
              }]} 
              autoPlay={false}
              aspectRatio="aspect-video"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">混合媒体（图片+视频）</h2>
          <div className="h-64 md:h-96 overflow-hidden rounded-xl">
            <MediaPlayer 
              mediaItems={mediaItems} 
              autoPlay={true}
              aspectRatio="aspect-video"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">占据页面顶部五分之一高度的示例</h2>
          <div className="h-[20vh] mb-8 overflow-hidden rounded-xl">
            <MediaPlayer 
              mediaItems={mediaItems} 
              autoPlay={true}
              aspectRatio="aspect-[5/1]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}