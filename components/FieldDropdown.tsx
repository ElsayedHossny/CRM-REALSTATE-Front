import React from 'react'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { ChevronDown, Search } from 'lucide-react';


export default function FieldDropdown({ field, value, onSelect }: {
    field: { id: string; label: string; options: string[] }
    value: string;
    onSelect: (val: string) => void
}) {

    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu key={field.id} open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button className={`flex flex-col justify-center items-start gap-1 px-5 py-3 hover:bg-white/5 transition-colors min-w-[130px] justify-center items-start gap-1 px-5 py-3 hover:bg-white/5 transition-colors min-w-[130px]`}>
                    <span className="text-[11px] text-neutral-500 tracking-wide">
                        {field.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                        {value}
                        <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {field.options.map((option) => (
                    <DropdownMenuItem key={option} onSelect={() => onSelect(option)}
                        className={`cursor-pointer hover:bg-white/10 focus:bg-white/10 ${value === option ? "bg-white/10" : ""}`}>
                        {option}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
