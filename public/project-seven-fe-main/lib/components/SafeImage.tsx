'use client';

import Image, { ImageProps } from 'next/image';
import { ReactNode, useEffect, useState } from 'react';

interface SafeImageProps extends ImageProps {
  fallback?: string | ReactNode;
}

const SafeImage = ({ fallback, src: srcProp, ...rest }: SafeImageProps) => {
  const [src, setSrc] = useState<string | null>(
    typeof srcProp === 'string' && srcProp.length > 0 ? srcProp : null,
  );

  useEffect(() => {
    setSrc(typeof srcProp === 'string' && srcProp.length > 0 ? srcProp : null);
  }, [srcProp]);

  // src가 비어 있고 fallback이 문자열이면 fallback을 이미지로 사용
  // blob: 또는 data: URL은 next/image에서 처리하지 않으므로 기본 img로 렌더링
  if (src?.startsWith('blob:') || src?.startsWith('data:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...(rest as any)}
        src={src}
        onError={() => setSrc(null)}
        style={{ objectFit: 'contain', ...(rest as any).style }}
      />
    );
  }

  if (src) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image {...rest} src={src} onError={() => setSrc(null)} />;
  }

  if (typeof fallback === 'string') {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image {...rest} src={fallback} onError={() => setSrc(null)} />;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
};

export default SafeImage;
