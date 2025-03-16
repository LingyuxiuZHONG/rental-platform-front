import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MapPin, Calendar, Trash2 } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "Luxury Beachfront Villa",
      location: "Malibu, California",
      images: ["/api/placeholder/800/500"],
      price: 350,
      rating: 4.9,
      reviews: 128,
      category: "stays",
      saved: "2 weeks ago"
    },
    {
      id: 2,
      title: "Modern Downtown Apartment",
      location: "New York, NY",
      images: ["/api/placeholder/800/500"],
      price: 200,
      rating: 4.7,
      reviews: 92,
      category: "stays",
      saved: "1 month ago"
    },
    {
      id: 3,
      title: "Wine Tasting Tour",
      location: "Napa Valley, CA",
      images: ["/api/placeholder/800/500"],
      price: 120,
      rating: 4.8,
      reviews: 56,
      category: "experiences",
      duration: "4 hours",
      saved: "3 days ago"
    },
    {
      id: 4,
      title: "Cooking Class with Chef Maria",
      location: "San Francisco, CA",
      images: ["/api/placeholder/800/500"],
      price: 85,
      rating: 4.9,
      reviews: 42,
      category: "experiences",
      duration: "2 hours",
      saved: "1 week ago"
    }
  ]);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Saved Items</h1>
        <p className="text-gray-500">{favorites.length} items saved</p>
      </div>

      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All Saved</TabsTrigger>
          <TabsTrigger value="stays">Stays</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <FavoriteCard 
                key={item.id} 
                item={item} 
                onRemove={() => removeFavorite(item.id)} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stays" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites
              .filter(item => item.category === "stays")
              .map((item) => (
                <FavoriteCard 
                  key={item.id} 
                  item={item} 
                  onRemove={() => removeFavorite(item.id)} 
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="experiences" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites
              .filter(item => item.category === "experiences")
              .map((item) => (
                <FavoriteCard 
                  key={item.id} 
                  item={item} 
                  onRemove={() => removeFavorite(item.id)} 
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {favorites.length === 0 && (
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No saved items yet</h2>
          <p className="text-gray-500 mb-6">
            Start exploring and save your favorite places and experiences.
          </p>
          <Button asChild>
            <Link to="/">Explore Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

const FavoriteCard = ({ item, onRemove }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={item.images[0]} 
          alt={item.title} 
          className="w-full h-48 object-cover"
        />
        <Button 
          variant="destructive" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-2 left-2">
          <Badge className="bg-white text-black">
            Saved {item.saved}
          </Badge>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span className="font-medium">{item.rating}</span>
            <span className="text-gray-500 ml-1">({item.reviews})</span>
          </div>
          {item.category === "experiences" && (
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {item.duration}
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{item.location}</span>
        </div>
        <p className="font-bold">
          ${item.price}{item.category === "stays" ? "/night" : "/person"}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" asChild className="w-full mr-2">
          <Link to={`/listings/${item.id}`}>View Details</Link>
        </Button>
        <Button asChild className="w-full">
          <Link to={`/booking/${item.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Favorites;