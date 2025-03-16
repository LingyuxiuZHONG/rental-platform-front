// addressSelect.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 

import { useState } from 'react';


const AddressPicker = ({ address, setAddress, performSearch }) => {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);


  return (
    <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-3 py-1 h-auto font-medium">
          {address || '任何地方'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>选择目的地</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="搜索目的地"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            {['北京', '上海', '广州', '深圳', '成都', '杭州'].map((city) => (
              <Button
                key={city}
                variant="outline"
                onClick={() => {
                  setAddress(city);

                }}
              >
                {city}
              </Button>
            ))}
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

export default AddressPicker;
