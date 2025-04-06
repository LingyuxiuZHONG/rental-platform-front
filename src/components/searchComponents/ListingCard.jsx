import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Home, Star, Heart } from "lucide-react";
import { API_BASE_URL } from '@/components/commonComponents/Constants';

/**
 * 房产卡片组件，保持一致高度并优化评分显示
 */
const ListingCard = ({ listing, onFavoriteToggle, onCardClick }) => (
  <div className="group w-full" onClick={() => onCardClick(listing.id)}>
    <Card className="overflow-hidden hover:shadow-md transition-shadow w-full h-96">
      <div className="relative h-48">
        <img 
          src={`${API_BASE_URL}${listing.image}`}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/70 hover:bg-white 
            ${listing.isFavorite ? 'text-red-500 hover:text-red-500' : 'text-gray-600 hover:text-gray-800'}`}                    
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(listing.id);
          }}
        >
          <Heart 
            className="h-5 w-5" 
            fill={listing.isFavorite ? "currentColor" : "none"}
          />
        </Button>
      </div>
      
      <CardContent className="p-4 h-48 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-600 cursor-pointer max-w-[65%]">
              {listing.title}
            </h3>
            <div className="flex items-center ml-2 min-w-[80px] justify-end">
              {listing.rating ? (
                <>
                  <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                  <span>{listing.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({listing.reviewcount})</span>
                </>
              ) : (
                <span className="text-gray-400 text-sm italic">尚无评分</span>
              )}
            </div>
          </div>
          
          <div className="flex items-start text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
            <span className="text-sm line-clamp-1">{listing.address}</span>
          </div>
          
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'bed' : 'beds'}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'bath' : 'baths'}</span>
            </div>
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              <span className="capitalize">{listing.listingType}</span>
            </div>
          </div>
        </div>
        
        <div className="font-bold text-lg">
          ${listing.price} <span className="text-sm font-normal text-gray-500">/晚</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

ListingCard.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    listingType: PropTypes.string.isRequired,
    rating: PropTypes.number,
    reviewcount: PropTypes.number,
    isFavorite: PropTypes.bool
  }).isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired
};

export default ListingCard;