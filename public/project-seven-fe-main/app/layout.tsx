import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { NavBar } from './components/NavBar';

export const metadata: Metadata = {
  title: 'SEVEN',
  description: '기록 기반의 운동 커뮤니티, 세븐',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <Providers>
          <NavBar />
          <main className="main-root">{children}</main>
          <div id="modal-root"></div>
        </Providers>
      </body>
    </html>
  );
}
