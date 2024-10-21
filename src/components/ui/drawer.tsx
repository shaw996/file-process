import { useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';

import Mask from './mask';

import { cn } from '@/utils';

const drawerVariants = cva(
  'DrawerWrapper flex flex-col w-full px-4 py-4 absolute transition-transform duration-150 bg-white dark:bg-gray-900',
  {
    variants: {
      mode: {
        toBottom: 'min-h-[30%] max-h-[80%] top-0 -translate-y-full rounded-b-2xl',
        toTop: 'min-h-[30%] max-h-[80%] bottom-0 translate-y-full rounded-t-2xl',
        toLeft: 'w-3/4 h-full right-0 translate-x-full rounded-l-xl',
        toRight: 'w-3/4 h-full left-0 -translate-x-full rounded-r-xl',
      },
    },
    defaultVariants: {
      mode: 'toTop',
    },
  },
);

const Drawer = ({
  className = '',
  children,
  mode,
  title,
  emitClose,
}: {
  children: React.ReactNode;
  className?: string;
  mode?: 'toBottom' | 'toTop' | 'toLeft' | 'toRight';
  title?: string;
  emitClose: () => void;
}) => {
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isEnter, setIsEnter] = useState(false);

  let titleClassName = '';

  if (title) {
    switch (mode) {
      case 'toLeft':
      case 'toRight':
        titleClassName = 'text-left';
        break;
      case 'toTop':
      case 'toBottom':
      default:
        titleClassName = 'text-center';
        break;
    }
  }

  let transitionClassName = '';

  if (isEnter) {
    switch (mode) {
      case 'toLeft':
      case 'toRight':
        transitionClassName = 'translate-x-0';
        break;
      case 'toBottom':
      case 'toTop':
      default:
        transitionClassName = 'translate-y-0';
        break;
    }
  }

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
    <div className={className}>
      <Mask emitClick={clickMask}>
        {/* Drawer组件内容区域 */}
        <div
          className={cn(drawerVariants({ mode }), transitionClassName)}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <h3 className={cn('mb-2 flex-none text-lg font-bold', titleClassName)}>{title}</h3>
          )}
          <div className="DrawerScrollable flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </div>
      </Mask>
    </div>
  );
};

export default Drawer;
