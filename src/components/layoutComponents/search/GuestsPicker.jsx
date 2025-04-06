// GuestsSelect.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button'; 
import { useState } from 'react';

const GuestsPicker = ({ guests, setGuests, performSearch }) => {
  const [guestsDialogOpen, setGuestsDialogOpen] = useState(false);

  const updateTotalGuests = (count) => {
    setGuests(count);
  };

  return (
    <Dialog open={guestsDialogOpen} onOpenChange={setGuestsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-3 py-1 h-auto font-medium">
          {`${guests}人`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>选择房客人数</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* 总人数 */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">总人数</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateTotalGuests(guests - 1)}
                disabled={guests <= 1}
                className="w-8 h-8 rounded-full"
              >
                -
              </Button>
              <span className="w-6 text-center">{guests}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateTotalGuests(guests + 1)}
                className="w-8 h-8 rounded-full"
              >
                +
              </Button>
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
  );
};

export default GuestsPicker;