import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

/**
 * 过滤器面板组件，用于房源搜索过滤
 */
const FilterPanel = ({ filters, handleFilterChange, clearFilters, applyFilters, isLoading, onCancel }) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={(value) => handleFilterChange('priceRange', null, value)}
            />
            <div className="flex justify-between">
              <p>${filters.priceRange[0]}</p>
              <p>${filters.priceRange[1]}+</p>
            </div>
          </div>
        </div>
        
        {/* Property Type */}
        <div>
          <h4 className="font-medium mb-2">Property Type</h4>
          <div className="space-y-2">
            {Object.keys(filters.propertyType).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`property-${type}`}
                  checked={filters.propertyType[type]}
                  onCheckedChange={(checked) => 
                    handleFilterChange('propertyType', type, checked)}
                />
                <Label htmlFor={`property-${type}`} className="capitalize">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rooms */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Bedrooms</h4>
            <div className="flex flex-wrap gap-2">
              {['any', 1, 2, 3, 4, '5+'].map((num) => (
                <Button
                  key={num}
                  variant={filters.bedrooms === num ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('bedrooms', null, num)}
                >
                  {num === 'any' ? 'Any' : num}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Bathrooms</h4>
            <div className="flex flex-wrap gap-2">
              {['any', 1, 2, 3, '4+'].map((num) => (
                <Button
                  key={num}
                  variant={filters.bathrooms === num ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('bathrooms', null, num)}
                >
                  {num === 'any' ? 'Any' : num}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="lg:col-span-3">
          <h4 className="font-medium mb-2">Amenities</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(filters.amenities).map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities[amenity]}
                  onCheckedChange={(checked) => 
                    handleFilterChange('amenities', amenity, checked)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="capitalize">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={applyFilters} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            `Show results`
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
);

FilterPanel.propTypes = {
  filters: PropTypes.shape({
    priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    propertyType: PropTypes.object.isRequired,
    bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    amenities: PropTypes.object.isRequired
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default FilterPanel;