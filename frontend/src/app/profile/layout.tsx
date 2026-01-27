import ThemeWrapper from '@/components/theme-wrapper';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeWrapper>
      <main className="flex-grow py-8 sm:py-12">
        {children}
      </main>
    </ThemeWrapper>
  );
}