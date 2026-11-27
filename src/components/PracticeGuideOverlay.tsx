import React, { useEffect, useState } from 'react';

const practiceGuideImg = '/assets/aistudio/image_b64f9c8c.png';

interface PracticeGuideOverlayProps {
  visible: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onDismiss: () => void;
  onClickTarget: () => void;
}

/**
 * 若上传的 PNG 自带透明通道则直接使用原图；
 * 若四角为不透明纯色背景，则在客户端按原图比例平滑抠除背景。
 */
function useCutoutImage(src: string): string {
  const [resolvedUrl, setResolvedUrl] = useState<string>(src);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const maxDim = 384;
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
        const width = Math.max(1, Math.round((img.naturalWidth || maxDim) * scale));
        const height = Math.max(1, Math.round((img.naturalHeight || maxDim) * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const cornerOffsets = [
          (2 * width + 2) * 4,
          (2 * width + (width - 3)) * 4,
          ((height - 3) * width + 2) * 4,
          ((height - 3) * width + (width - 3)) * 4,
        ];

        // 如果四角已经是透明像素，直接使用高清原图
        const avgAlpha =
          cornerOffsets.reduce((sum, off) => sum + data[off + 3], 0) / cornerOffsets.length;
        if (avgAlpha < 20) {
          if (!cancelled) setResolvedUrl(src);
          return;
        }

        let bgR = 0;
        let bgG = 0;
        let bgB = 0;
        for (const off of cornerOffsets) {
          bgR += data[off];
          bgG += data[off + 1];
          bgB += data[off + 2];
        }
        bgR /= 4;
        bgG /= 4;
        bgB /= 4;

        const colorDist = (idx: number) => {
          const dr = data[idx] - bgR;
          const dg = data[idx + 1] - bgG;
          const db = data[idx + 2] - bgB;
          return Math.sqrt(dr * dr + dg * dg + db * db);
        };

        const total = width * height;
        const visited = new Uint8Array(total);
        const isBg = new Uint8Array(total);
        const queue = new Int32Array(total);
        let head = 0;
        let tail = 0;

        const enqueue = (x: number, y: number) => {
          const p = y * width + x;
          if (!visited[p]) {
            visited[p] = 1;
            queue[tail++] = p;
          }
        };

        for (let x = 0; x < width; x++) {
          enqueue(x, 0);
          enqueue(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
          enqueue(0, y);
          enqueue(width - 1, y);
        }

        const THRESH = 26;
        while (head < tail) {
          const p = queue[head++];
          const off = p * 4;
          if (colorDist(off) < THRESH) {
            isBg[p] = 1;
            const x = p % width;
            const y = (p - x) / width;
            if (x > 0) enqueue(x - 1, y);
            if (x < width - 1) enqueue(x + 1, y);
            if (y > 0) enqueue(x, y - 1);
            if (y < height - 1) enqueue(x, y + 1);
          }
        }

        // 清理环形内部封闭的纯白背景孔洞（仅处理极接近背景色的像素）
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const p = y * width + x;
            if (!isBg[p] && colorDist(p * 4) < 10) {
              isBg[p] = 1;
            }
          }
        }

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const p = y * width + x;
            const off = p * 4;
            if (isBg[p]) {
              data[off + 3] = 0;
            } else {
              const nearBg =
                (x > 0 && isBg[p - 1]) ||
                (x < width - 1 && isBg[p + 1]) ||
                (y > 0 && isBg[p - width]) ||
                (y < height - 1 && isBg[p + width]);
              if (nearBg) {
                const d = colorDist(off);
                if (d < 56) {
                  data[off + 3] = Math.round(
                    Math.max(0, Math.min(255, ((d - THRESH) / (56 - THRESH)) * 255))
                  );
                }
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        if (!cancelled) {
          setResolvedUrl(canvas.toDataURL('image/png'));
        }
      } catch {
        if (!cancelled) setResolvedUrl(src);
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return resolvedUrl;
}

export const PracticeGuideOverlay: React.FC<PracticeGuideOverlayProps> = ({
  visible,
  containerRef,
  onDismiss,
  onClickTarget,
}) => {
  const displaySrc = useCutoutImage(practiceGuideImg);
  const [anchor, setAnchor] = useState<{ cx: number; cy: number; width: number }>({
    cx: 364,
    cy: 46,
    width: 390,
  });

  useEffect(() => {
    if (!visible) return;

    const updateAnchor = () => {
      const container = containerRef.current;
      if (!container) return;
      const target = container.querySelector<HTMLElement>('[data-guide-target="practice-more-grid"]');
      if (!target) return;
      const cRect = container.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      setAnchor({
        cx: tRect.left - cRect.left + tRect.width / 2,
        cy: tRect.top - cRect.top + tRect.height / 2,
        width: cRect.width,
      });
    };

    updateAnchor();
    const raf = requestAnimationFrame(updateAnchor);
    window.addEventListener('resize', updateAnchor);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateAnchor);
    };
  }, [visible, containerRef]);

  if (!visible) return null;

  const spotlightSize = 40;
  const rightInset = Math.max(12, anchor.width - anchor.cx - spotlightSize / 2);
  const dotsTop = anchor.cy + spotlightSize / 2 + 5;
  const bubbleTop = dotsTop + 44;

  return (
    <div
      role="dialog"
      aria-label="我的练习功能引导"
      onClick={onDismiss}
      className="absolute inset-0 z-[60] bg-black/48 select-none cursor-pointer animate-fade-scale"
    >
      {/* 1. 右上角高亮白色圆形焦点按钮 */}
      <button
        type="button"
        aria-label="进入我的练习相关功能"
        onClick={(e) => {
          e.stopPropagation();
          onClickTarget();
        }}
        style={{
          left: `${anchor.cx - spotlightSize / 2}px`,
          top: `${anchor.cy - spotlightSize / 2}px`,
          width: `${spotlightSize}px`,
          height: `${spotlightSize}px`,
        }}
        className="absolute rounded-full bg-white flex items-center justify-center shadow-[0_0_0_4px_rgba(255,255,255,0.22),0_4px_16px_rgba(0,0,0,0.22)] active:scale-95 transition-transform cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <rect x="2" y="2.5" width="7.2" height="7.2" rx="1" fill="#5D6B92" />
          <rect x="2" y="12.2" width="7.2" height="7.2" rx="1" fill="#5D6B92" />
          <rect x="11.8" y="12.2" width="7.2" height="7.2" rx="1" fill="#5D6B92" />
          <rect
            x="15.4"
            y="1.1"
            width="7"
            height="7"
            rx="1"
            transform="rotate(45 15.4 1.1)"
            fill="#3478F6"
          />
        </svg>
      </button>

      {/* 2. 垂直白色虚点连接线 */}
      <div
        style={{
          left: `${anchor.cx}px`,
          top: `${dotsTop}px`,
        }}
        className="absolute -translate-x-1/2 flex flex-col items-center gap-[5.5px] pointer-events-none"
      >
        {[0, 1, 2, 3, 4].map((dot) => (
          <span
            key={dot}
            className="w-[3.5px] h-[3.5px] rounded-full bg-white/95 shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          />
        ))}
      </div>

      {/* 3. 悬浮蓝色渐变引导气泡 + 替换后的 3D 玻璃质感插图 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        style={{
          top: `${bubbleTop}px`,
          right: `${Math.max(12, rightInset - 2)}px`,
        }}
        className="absolute w-fit max-w-[calc(100%-44px)]"
      >
        <div className="relative flex items-center pl-[68px] pr-4 h-[40px] rounded-[14px] bg-gradient-to-r from-[#5B95FF] via-[#598EFF] to-[#6B9EFF] border border-white/35 shadow-[0_10px_24px_rgba(29,78,216,0.36),inset_0_1.5px_1px_rgba(255,255,255,0.45)]">
          <img
            src={displaySrc}
            alt="我的练习功能引导插图"
            referrerPolicy="no-referrer"
            draggable={false}
            className="absolute -left-[30px] -top-[22px] w-[104px] h-[70px] object-contain pointer-events-none select-none drop-shadow-[0_8px_14px_rgba(18,52,140,0.32)]"
          />

          <p className="text-white text-[13px] font-medium leading-none tracking-[0.01em] whitespace-nowrap">
            “我的练习”相关功能都在这里哦
          </p>
        </div>
      </div>
    </div>
  );
};
