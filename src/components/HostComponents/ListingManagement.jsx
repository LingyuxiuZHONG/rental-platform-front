import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Home, Calendar, User, CreditCard, Eye, Edit, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@/components/commonComponents/Constants';
import { Link, useNavigate } from 'react-router-dom';

const BookingDetailModal = ({ listing, bookings, onClose }) => {
  const navigate = useNavigate();
  
  const getStatusText = (status) => {
    const statusMap = {
      0: '待支付',
      1: '支付中',
      2: '已付款',
      3: '已取消',
      4: '已完成'
    };
    return statusMap[status] || '未知状态';
  };

  const handleBookingDetailNavigation = (booking) => {
    navigate(`/bookings/${booking.id}`, { 
      state: { 
        listing: listing,
        booking: booking
      } 
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-red-100 text-red-800';
      case 4: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl">预订详情</DialogTitle>
          <DialogDescription className="text-base">查看此房源的所有预订信息</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <div 
              key={booking.id} 
              className="cursor-pointer border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              onClick={() => handleBookingDetailNavigation(booking, { listing })}
            >
              <div className="flex justify-between items-center mb-4">
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </div>
                <span className="text-base font-medium">预订 #{index + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-gray-600" />
                  <span className="text-base">
                    {booking.startDate} 至 {booking.endDate}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-gray-600" />
                  <span className="text-base">客人人数: {booking.guestCount} 人</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="mr-3 h-5 w-5 text-gray-600" />
                  <span className="text-base">总金额: ¥{booking.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="mr-3 h-5 w-5 text-gray-600" />
                  <span className="text-base">已支付: ¥{booking.paidAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ListingManagement = ({ listings }) => {
  const [selectedBookings, setSelectedBookings] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  const handleBookingClick = (listing) => {
    setSelectedListing(listing);
    setSelectedBookings(listing.bookings);
  };

  const handleCloseBookingModal = () => {
    setSelectedBookings(null);
    setSelectedListing(null);
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">我的房源</CardTitle>
          <CardDescription className="text-base">管理您的所有短租房源</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold"></th>
                  <th className="text-left p-4 font-semibold">名称</th>
                  <th className="text-left p-4 font-semibold">地址</th>
                  <th className="text-center p-4 font-semibold">卧室/浴室</th>
                  <th className="text-right p-4 font-semibold">价格</th>
                  <th className="text-center p-4 font-semibold">预订</th>
                  <th className="text-right p-4 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={`${API_BASE_URL}${listing.images[0]}?timestamp=${new Date().getTime()}`}
                            className="w-16 h-16 rounded-md object-cover mr-3"
                            alt={listing.title}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                            <Home className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{listing.title}</td>
                    <td className="p-4">{listing.address}</td>
                    <td className="p-4 text-center">{listing.bedrooms}/{listing.bathrooms}</td>
                    <td className="p-4 text-right font-medium">
                      ¥{listing.price.toFixed(2)}/晚
                    </td>
                    <td className="p-4 text-center">
                      <Button 
                        variant={listing.bookings && listing.bookings.length > 0 ? "secondary" : "outline"}
                        size="sm"
                        className={`min-w-24 ${
                          listing.bookings && listing.bookings.length > 0
                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200'
                            : 'text-gray-500'
                        }`}
                        onClick={() => listing.bookings && listing.bookings.length > 0 && handleBookingClick(listing)}
                        disabled={!listing.bookings || listing.bookings.length === 0}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {listing.bookings ? `${listing.bookings.length} 个预订` : '无预订'}
                      </Button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          编辑
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 flex items-center">
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedBookings && selectedListing && (
        <BookingDetailModal
          listing={selectedListing}
          bookings={selectedBookings}
          onClose={handleCloseBookingModal}
        />
      )}
    </>
  );
};

export default ListingManagement;