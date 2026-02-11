'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background py-4">
      <p className="text-muted-foreground text-sm text-center">
        © {currentYear} 我的优秀博客. 保留所有权利。
      </p>
    </footer>
  );
}
