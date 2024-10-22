'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  User,
  Wrench,
  Menu,
  ChevronDown,
  FileImage,
  FileSpreadsheet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

// 定义工具项类型
type ToolItemWithIcon = {
  label: string;
  path: string;
  icon?: JSX.Element;
};

type ToolGroup = {
  label: string;
  items: ToolItemWithIcon[];
};

type Tool = ToolItemWithIcon | ToolGroup;

// 工具项配置
const toolsConfig: Tool[] = [
  {
    label: '图片工具',
    items: [
      { label: '图片格式转换', path: '/convert/image-format', icon: <FileImage /> },
      { label: '图片压缩', path: '/compress/image', icon: <FileImage /> },
      { label: '图片加水印', path: '/watermark/image', icon: <FileImage /> },
      { label: '图片去水印', path: '/remove-watermark/image', icon: <FileImage /> },
    ],
  },
  { label: '拆分PDF', path: '/split-pdf' },
  { label: '压缩PDF', path: '/compress-pdf' },
  {
    label: 'PDF转换工具',
    items: [
      { label: 'JPG转PDF', path: '/convert/jpg-to-pdf', icon: <FileImage /> },
      { label: 'PPT转PDF', path: '/convert/ppt-to-pdf', icon: <FileSpreadsheet /> },
      { label: 'EXCEL转PDF', path: '/convert/excel-to-pdf', icon: <FileSpreadsheet /> },
    ],
  },
  {
    label: '所有工具',
    items: [
      { label: '更多工具', path: '/more-tools' },
      { label: '帮助文档', path: '/help' },
    ],
  },
];

enum PopoverType {
  TOOLS = 'tools', // 工具
  MENU = 'menu', // 菜单
}

/**
 * 小扳手按钮（小屏幕）
 */
const WrenchButton = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: (value: PopoverType | null) => void;
}) => {
  return (
    <div className="WrenchButton inline-block md:hidden">
      <IconButton
        className="relative z-10"
        onClick={() => onClick(PopoverType.TOOLS)}
        icon={<Wrench />}
      />
      <div
        className={cn(
          'ToolListContainer w-screen px-4 pt-20 p-b-4 fixed top-0 bottom-0 left-1/2 -translate-x-1/2 scale-0 opacity-0 transition-all duration-150 overflow-y-auto',
          open && ['scale-100', 'opacity-100'],
        )}
        onClick={() => onClick(null)}
      >
        <ul className="ToolListScrollable w-full" onClick={($event) => $event.stopPropagation()}>
          {toolsConfig.map((tool, index) => {
            if ('items' in tool) {
              return (
                <ul className="mb-1.5 p-4 rounded shadow-md" key={index}>
                  <li className="mb-2 text-slate-400 text-lg font-medium">{tool.label}</li>
                  {tool.items.map((item, i) => (
                    <li className="text-slate-950 text-base" key={i}>
                      <NavLink href={item.path}>
                        <span className="py-2.5 flex items-center">
                          {item.icon ? <span className="mr-2">{item.icon}</span> : null}
                          <span>{item.label}</span>
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <li className="mb-1.5 text-base rounded shadow-md" key={index}>
                <NavLink href={tool.path}>
                  <span className="px-4 py-2.5 flex items-center">{tool.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/**
 * 菜单按钮
 */
const MenuButton = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: (value: PopoverType | null) => void;
}) => {
  const [menuIndex, setMenuIndex] = useState<number | null>(null);

  const toggleMenu = (index: number | null) => {
    setMenuIndex(menuIndex === index ? null : index);
  };

  useEffect(() => {
    if (!open) {
      setMenuIndex(null);
    }
  }, [open]);

  return (
    <div
      className="MenuButton inline-block"
      onMouseEnter={() => onClick(PopoverType.MENU)}
      onMouseLeave={() => onClick(null)}
    >
      <IconButton
        className="relative z-10"
        onClick={() => onClick(PopoverType.MENU)}
        icon={<Menu />}
      />
      <div
        className={cn(
          'MenuListContainer w-screen md:w-auto pt-20 md:pt-8 md:pb-2 flex justify-end items-start fixed top-0 md:top-12 bottom-0 md:bottom-[unset] -right-full scale-0 opacity-0 transition-all duration-150 overflow-visible',
          open && ['right-0', 'scale-100', 'opacity-100'],
        )}
        onClick={($event) => {
          $event.stopPropagation();
          onClick(null);
        }}
      >
        <ul className="Menu min-w-56 bg-white rounded-xl shadow-md overflow-visible">
          {toolsConfig.map((tool, index) => {
            if ('items' in tool) {
              return (
                <li
                  className="mb-1.5 pr-3.5 flex justify-between items-center relative text-base cursor-pointer hover:text-red-500 group"
                  key={index}
                  onClick={($event) => {
                    $event.stopPropagation();
                    toggleMenu(index);
                  }}
                  onMouseEnter={() => toggleMenu(index)}
                  onMouseLeave={() => toggleMenu(null)}
                >
                  <span className="px-4 py-2.5 flex items-center">{tool.label}</span>
                  <ChevronDown className="ml-1 w-5 h-5 -rotate-90" />

                  <ul
                    className={cn(
                      'SubMenu absolute top-0 left-0 scale-0 opacity-0 transition-all duration-150 bg-white rounded-xl shadow-md',
                      menuIndex === index ? 'opacity-100 scale-100 -translate-x-full' : '',
                    )}
                  >
                    {tool.items.map((item, i) => (
                      <li className="text-slate-950 text-base" key={i}>
                        <NavLink href={item.path}>
                          <span className="px-4 py-2.5 flex items-center">
                            {item.icon ? <span className="mr-2">{item.icon}</span> : null}
                            <span>{item.label}</span>
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            return (
              <li className="mb-1.5 text-base" key={index}>
                <NavLink href={tool.path}>
                  <span className="px-4 py-2.5 flex items-center">{tool.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const Header = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [popoverType, setPopoverType] = useState<PopoverType | null>(null);

  const isToolsOpen = popoverType === PopoverType.TOOLS;
  const isMenuOpen = popoverType === PopoverType.MENU;

  const togglePopover = (value: PopoverType | null) => {
    setPopoverType(value === popoverType ? null : value);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="flex justify-between items-center py-3 px-4">
        {/* Logo 区域 */}
        <div className="flex items-center">
          <button className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <span className="text-red-500 text-3xl mr-2">❤️</span>
            PDF
          </button>
        </div>

        {/* 桌面端导航菜单 */}
        <nav className="hidden md:flex space-x-6 text-lg">
          {toolsConfig.map((tool, index) =>
            'items' in tool ? (
              <DropdownMenu key={index} label={tool.label}>
                {tool.items.map((item, i) => (
                  <DropdownMenuItem key={i} icon={item.icon} label={item.label} href={item.path} />
                ))}
              </DropdownMenu>
            ) : (
              <NavLink key={index} href={tool.path}>
                {tool.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* 图标按钮区域 */}
        <div className="flex items-center [&>*:not(:last-child)]:mr-4">
          {/* 小扳手 */}
          <WrenchButton open={isToolsOpen} onClick={(value) => togglePopover(value)} />
          <IconButton
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            icon={resolvedTheme === 'dark' ? <Sun /> : <Moon />}
          />
          <IconButton icon={<User />} />

          {/* 菜单 */}
          <MenuButton open={isMenuOpen} onClick={(value) => togglePopover(value)} />
        </div>
      </div>
    </header>
  );
};

// IconButton 组件，用于简化图标按钮的创建
const IconButton = ({
  onClick,
  icon,
  className = '',
}: {
  onClick?: () => void;
  icon: JSX.Element;
  className?: string;
}) => (
  <Button variant="ghost" onClick={onClick} className={`p-2 ${className}`}>
    {icon}
  </Button>
);

// 单独的导航链接组件
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="flex items-center space-x-2 text-gray-800 dark:text-gray-100 hover:text-red-500 transition duration-300"
  >
    {children}
  </a>
);

// 工具栏的下拉菜单项组件
const DropdownMenuItem = ({
  icon,
  label,
  href,
}: {
  icon?: React.ReactNode;
  label: string;
  href: string;
}) => (
  <a
    href={href}
    className="flex items-center text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg transition duration-300"
  >
    {icon && <span className="mr-3">{icon}</span>}
    <span>{label}</span>
  </a>
);

// 菜单下拉组件
const DropdownMenu = ({
  label,
  children,
}: {
  label: string | React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="relative group">
    <div className="group flex items-center text-gray-800 dark:text-gray-100 hover:text-red-500 transition duration-300">
      {label}
      <ChevronDown className="ml-1 w-4 h-4" />
    </div>
    <div className="absolute hidden group-hover:block">
      <div className="bg-white dark:bg-gray-800 mt-2 shadow-lg rounded-lg z-50 left-0 p-4 min-w-max transform translate-y-2 pointer-events-auto">
        {children}
      </div>
    </div>
  </div>
);

export default Header;
