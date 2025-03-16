import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Home, Star, Heart } from "lucide-react";

/**
 * 房产卡片组件，展示单个房源信息
 */
const PropertyCard = ({ property, onFavoriteToggle, onCardClick }) => (
  <div className="group" onClick={() => onCardClick(property.id)}>
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={property.images?.[0] || "/api/placeholder/800/500"} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/70 hover:bg-white 
            ${property.isFavorite ? 'text-red-500 hover:text-red-500' : 'text-gray-600 hover:text-gray-800'}`}                    
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(property.id);
          }}
        >
          <Heart 
            className="h-5 w-5" 
            fill={property.isFavorite ? "currentColor" : "none"}
          />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-600 cursor-pointer">
            {property.title}
          </h3>
          <div className="flex items-center">
            {property.rating ? (
              <>
                <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                <span>{property.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({property.reviews})</span>
              </>
            ) : (
              <span className="text-gray-400 text-sm italic">尚无评分</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.address}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            <span className="capitalize">{property.listingType}</span>
          </div>
        </div>
        
        <div className="font-bold text-lg">
          ${property.price} <span className="text-sm font-normal text-gray-500">/ {property.priceUnit}</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    listingType: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    priceUnit: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    isFavorite: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired
};

export default PropertyCard;