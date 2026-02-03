import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '相册 - 我的博客',
  description: '浏览我的精美相册集合，记录生活中的美好瞬间',
};

const AlbumsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section>
      {children}
    </section>
  );
};

export default AlbumsLayout;