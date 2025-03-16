import { useState, useRef, useEffect } from 'react';
import AddressPicker from "./AddressPicker";
import DatePicker from './DatePicker';
import GuestsPicker from './GuestsPicker';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Calendar, Users } from "lucide-react";

const SearchBar = ({ onSearch }) => {  
  const [address, setAddress] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [activeSection, setActiveSection] = useState(null);
  const searchBarRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setActiveSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = () => {
    const searchParams = { address, dateRange, guests };
    onSearch(searchParams);  // 调用父组件的搜索方法
    setActiveSection(null);
  };

  return (
    <div ref={searchBarRef} className="relative hidden md:flex items-center border rounded-full px-4 py-2 shadow-sm hover:shadow transition-shadow bg-white">
      {/* Address Section */}
      <div className="relative cursor-pointer" onClick={() => setActiveSection(activeSection === 'address' ? null : 'address')}>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-gray-500" />
          <AddressPicker address={address} setAddress={setAddress} performSearch={performSearch}/>
        </div>
      </div>

      <Separator orientation="vertical" className="mx-2 h-5" />
      
      {/* Date Section */}
      <div className="relative cursor-pointer" onClick={() => setActiveSection(activeSection === 'date' ? null : 'date')}>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-gray-500" />
          <DatePicker dateRange={dateRange} setDateRange={setDateRange} performSearch={performSearch}/>
        </div>
      </div>

      <Separator orientation="vertical" className="mx-2 h-5" />
      
      {/* Guests Section */}
      <div className="relative cursor-pointer" onClick={() => setActiveSection(activeSection === 'guests' ? null : 'guests')}>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-gray-500" />
          <GuestsPicker guests={guests} setGuests={setGuests} performSearch={performSearch}/>
        </div>
      </div>

      {/* Search Button */}
      <Button onClick={performSearch} variant="primary" size="icon" className="rounded-full ml-2 bg-primary hover:bg-primary/90">
        <Search className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};

export default SearchBar;
