'use client';

import React, { useState } from 'react';
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

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/ui/drawer';

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

const Header = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleToolsMenu = () => setIsToolsMenuOpen(!isToolsMenuOpen);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo 区域 */}
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center"
          >
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
          <IconButton className="md:hidden" onClick={toggleToolsMenu} icon={<Wrench />} />
          <IconButton
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            icon={resolvedTheme === 'dark' ? <Sun /> : <Moon />}
          />
          <IconButton icon={<User />} />
          <IconButton onClick={toggleMobileMenu} icon={<Menu />} />
        </div>
      </div>

      {/* 小屏幕工具菜单下拉显示，点击扳手图标时展示 */}
      {isToolsMenuOpen && (
        <Drawer title="工具箱" emitClose={toggleToolsMenu}>
          <Accordion type="single" collapsible className="w-full">
            {toolsConfig.map((tool, index) =>
              'items' in tool ? (
                <AccordionItem key={index} value={tool.label}>
                  <AccordionTrigger>{tool.label}</AccordionTrigger>
                  <AccordionContent>
                    {tool.items.map((item, i) => (
                      <NavLink key={i} href={item.path}>
                        <span className="py-2 flex flex-1 items-center font-medium text-gray-400 transition-all hover:underline">
                          {item.label}
                        </span>
                      </NavLink>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <NavLink key={index} href={tool.path}>
                  <span className="py-4 flex flex-1 items-center justify-between font-medium transition-all border-b hover:underline">
                    {tool.label}
                  </span>
                </NavLink>
              ),
            )}
          </Accordion>
        </Drawer>
      )}

      {/* 菜单 */}
      {isMobileMenuOpen && (
        <>
          {/* 大屏幕菜单 */}
          <menu className="px-4 pb-4 pt-2 hidden border-t [&>*:not(:last-child)]:mr-16 md:flex">
            {toolsConfig.map((tool, index) => {
              if ('items' in tool) {
                return (
                  <ul key={index}>
                    <li className="py-2 font-medium text-zinc-400">{tool.label}</li>
                    {tool.items.map((item, i) => {
                      return (
                        <li key={i} className="py-1 text-sm">
                          <NavLink href={item.path}>{item.label}</NavLink>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              return (
                <li className="py-2 font-medium" key={index}>
                  <NavLink href={tool.path}>{tool.label}</NavLink>
                </li>
              );
            })}
          </menu>

          {/* 小屏幕侧边栏菜单，使用Accordion组件 */}
          <Drawer className="md:hidden" title="菜单" mode="toRight" emitClose={toggleMobileMenu}>
            <Accordion type="single" collapsible className="w-full">
              {toolsConfig.map((tool, index) =>
                'items' in tool ? (
                  <AccordionItem key={index} value={tool.label}>
                    <AccordionTrigger>{tool.label}</AccordionTrigger>
                    <AccordionContent>
                      {tool.items.map((item, i) => (
                        <NavLink key={i} href={item.path}>
                          <span className="py-2 flex flex-1 items-center font-medium transition-all hover:underline">
                            &nbsp;&nbsp;{item.icon}&nbsp;&nbsp;{item.label}
                          </span>
                        </NavLink>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <NavLink key={index} href={tool.path}>
                    <span className="py-4 flex flex-1 items-center justify-between font-medium text-[hsl(var(--foreground))] transition-all border-b hover:underline">
                      {tool.label}
                    </span>
                  </NavLink>
                ),
              )}
            </Accordion>
          </Drawer>
        </>
      )}
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
