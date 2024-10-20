import { useEffect, useRef, useState } from 'react';

import Mask from './mask';

import { cn } from '@/utils';

const Drawer = ({
  children,
  title,
  emitClose,
}: {
  children: React.ReactNode;
  title?: string;
  emitClose: () => void;
}) => {
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isEnter, setIsEnter] = useState(false);

  const clickMask = () => {
    if (closeTimeout.current) {
      return;
    }

    setIsEnter(false);
    closeTimeout.current = setTimeout(() => {
      emitClose();
    }, 150); // 150毫秒后关闭（因为过渡持续时间是150ms）
  };

  useEffect(() => {
    setIsEnter(true);

    return () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }
    };
  }, []);

  return (
    <Mask emitClick={clickMask}>
      {/* Drawer组件内容区域 */}
      <div
        className={cn(
          'DrawerWrapper flex flex-col w-full min-h-[30%] max-h-[80%] px-4 py-4 absolute bottom-0 translate-y-full transition-transform duration-150 bg-white rounded-t-2xl',
          isEnter ? 'translate-y-0' : '',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="flex-none text-center text-lg font-bold">{title}</h3>}
        <div className="DrawerScrollable flex-1 overflow-y-auto">{children}</div>
      </div>
    </Mask>
  );
};

export default Drawer;
