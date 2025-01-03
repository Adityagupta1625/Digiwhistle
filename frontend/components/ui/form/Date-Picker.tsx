"use client";

import * as React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { addDays, format } from "date-fns";

import { useFormContext } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface IFormDateRangePickerProps {
  formName: string;
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  formDescription?: string;
  defaultValue?: string;
  className?: string;
  inputCN?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  setterfunction: any;
}

export function DatePicker({
  formName,
  label,
  placeholder,
  required = false,
  disabled = false,
  formDescription,
  defaultValue,
  className,
  inputCN,
  leftIcon,
  rightIcon,
  inputProps,
  setterfunction,
}: IFormDateRangePickerProps) {
  const [date, setDate] = React.useState<any | undefined>({
    from: new Date(),
  });
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={formName}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-0">
          <FormLabel className="text-sm font-medium text-black mt-[3px] -mb-[2px]">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl className="border-gray-300 ">
                <Button
                  id="date"
                  variant={"secondary"}
                  className={cn(
                    " flex  font-normal text-sm -mt-[10px] h-[42px]",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <div className="flex w-full ">
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    <div>
                      {field.value ? format(field.value, "LLL dd, y") : <span>Pick a date</span>}
                    </div>
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={date?.from}
                selected={field.value}
                onSelect={field.onChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
