import React from 'react';
import { DropdownMenu as RadixDropdownMenu, DropdownMenuItem as RadixDropdownMenuItem, DropdownMenuTrigger as RadixDropdownMenuTrigger, DropdownMenuContent as RadixDropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react'; // Optional, for a dropdown arrow icon

// Creating your own DropdownMenu components
export const DropdownMenu = ({ children }) => {
  return <RadixDropdownMenu>{children}</RadixDropdownMenu>;
};

export const DropdownMenuTrigger = ({ children }) => {
  return <RadixDropdownMenuTrigger>{children}</RadixDropdownMenuTrigger>;
};

export const DropdownMenuContent = ({ children }) => {
  return <RadixDropdownMenuContent>{children}</RadixDropdownMenuContent>;
};

export const DropdownMenuItem = ({ children, onClick }) => {
  return <RadixDropdownMenuItem onClick={onClick}>{children}</RadixDropdownMenuItem>;
};

// Optional: You can create a DropdownButton component to trigger the dropdown
export const DropdownButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      Dropdown <ChevronDown className="h-4 w-4" />
    </button>
  );
};
