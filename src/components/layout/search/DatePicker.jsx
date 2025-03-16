import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addMonths } from "date-fns";

const DatePicker = ({ dateRange, setDateRange, performSearch }) => {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);


  // 处理入住日期选择
  const handleCheckInSelect = (date) => {
    setDateRange(prev => {
      // 如果没有选择开始日期，或者已经选择了结束日期，则重新开始选择
      if (!prev.from || prev.to) {
        return { from: date, to: null };
      }
      // 如果选择的日期在开始日期之前，则交换
      if (date < prev.from) {
        return { from: date, to: prev.from };
      }
      // 否则设置结束日期
      return { from: prev.from, to: date };
    });
  };

  // 处理退房日期选择
  const handleCheckOutSelect = (date) => {
    if (dateRange.from && date <= dateRange.from) {
      alert('退房日期必须晚于入住日期');
      return;
    }
    setDateRange(prev => ({ ...prev, to: date }));
  };

  // 获取显示文本
  const getDateText = () => {
    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
    }
    if (dateRange.from) {
      return `${dateRange.from.toLocaleDateString()} - 选择结束日期`;
    }
    return "选择日期";
  };

  return (
    <>
      {/* 添加必要的全局样式 */}
      <style>
        {`
          .date-range-selection .rdp-day_range_start,
          .date-range-selection .rdp-day_range_end {
            background-color: hsl(var(--primary));
            color: white;
            font-weight: bold;
          }
          
          .date-range-selection .rdp-day_range_middle {
            background-color: hsl(var(--primary) / 0.1);
            color: hsl(var(--primary));
          }
        `}
      </style>

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="px-3 py-1 h-auto font-medium">
            {getDateText()}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>选择日期</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-row gap-4">
              {/* 入住日期选择 */}
              <div>
                <h4 className="font-medium mb-2">入住日期</h4>
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={handleCheckInSelect}  // 使用入住日期选择函数
                  defaultMonth={dateRange.from || new Date()}
                  className="border rounded date-range-selection"
                  modifiers={{
                    today: new Date(),
                    range: {
                      from: dateRange.from,
                      to: dateRange.to
                    },
                    rangeStart: dateRange.from,
                    rangeEnd: dateRange.to
                  }}
                  modifiersStyles={{
                    today: {
                      backgroundColor: '#dfdfdf',  // 蓝色背景
                      color: 'white',  // 白色文字
                      fontWeight: 'bold',  // 加粗文字
                    },
                    range: {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)' 
                    },
                    rangeStart: {
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      fontWeight: 'bold', 
                    },
                    rangeEnd: {
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      fontWeight: 'bold', 
                    },
                  }}
                />
              </div>

              {/* 退房日期选择 */}
              <div>
                <h4 className="font-medium mb-2">退房日期</h4>
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={handleCheckOutSelect}  // 使用退房日期选择函数
                  defaultMonth={dateRange.from ? addMonths(dateRange.from, 1) : addMonths(new Date(), 1)}
                  className="border rounded date-range-selection"
                  modifiers={{
                    range: {
                      from: dateRange.from,
                      to: dateRange.to
                    },
                    rangeStart: dateRange.from,
                    rangeEnd: dateRange.to
                  }}
                  modifiersStyles={{
                    range: {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)' 
                    },
                    rangeStart: {
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      fontWeight: 'bold', 
                    },
                    rangeEnd: {
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      fontWeight: 'bold', 
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  performSearch(); 
                }}
              >
                确定
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DatePicker;
