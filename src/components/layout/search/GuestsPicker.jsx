// GuestsSelect.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button} from '@/components/ui/button'; 
import { useState } from 'react';

const GuestsPicker = ({ guests, setGuests, performSearch }) => {
  const [guestsDialogOpen, setGuestsDialogOpen] = useState(false);

  const updateGuestCount = (type, count) => {
    setGuests(prev => ({ ...prev, [type]: count }));
  };

  return (
    <Dialog open={guestsDialogOpen} onOpenChange={setGuestsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-3 py-1 h-auto font-medium">
          {`${guests.adults}成人 ${guests.children}儿童 ${guests.infants}婴幼儿`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>选择房客</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* 成人 */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">成人</p>
              <p className="text-sm text-muted-foreground">18岁以上</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateGuestCount('adults', guests.adults - 1)}
                disabled={guests.adults <= 1}
                className="w-8 h-8 rounded-full"
              >
                -
              </Button>
              <span className="w-6 text-center">{guests.adults}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateGuestCount('adults', guests.adults + 1)}
                className="w-8 h-8 rounded-full"
              >
                +
              </Button>
            </div>
          </div>

          {/* 儿童 */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">儿童</p>
              <p className="text-sm text-muted-foreground">2-17岁</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateGuestCount('children', guests.children - 1)}
                disabled={guests.children <= 0}
                className="w-8 h-8 rounded-full"
              >
                -
              </Button>
              <span className="w-6 text-center">{guests.children}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateGuestCount('children', guests.children + 1)}
                className="w-8 h-8 rounded-full"
              >
                +
              </Button>
            </div>
          </div>

          {/* 婴幼儿 */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">婴幼儿</p>
              <p className="text-sm text-muted-foreground">2岁以下</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateGuestCount('infants', guests.infants - 1)}
                disabled={guests.infants <= 0}
                className="w-8 h-8 rounded-full"
              >
                -
              </Button>
              <span className="w-6 text-center">{guests.infants}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateGuestCount('infants', guests.infants + 1)}
                className="w-8 h-8 rounded-full"
              >
                +
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button type="button"
            onClick={() =>{
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
