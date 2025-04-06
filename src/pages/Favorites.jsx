import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Trash2, Heart } from 'lucide-react';
import { fetchFavorites, removeFavorite } from '@/services/FavoritesApi';
import { useAuth } from '@/components/commonComponents/AuthProvider';
import FormattedDate from '@/components/utils/formattedDate';
import { API_BASE_URL } from '@/components/commonComponents/Constants';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch favorites when component mounts
  useEffect(() => {
    const getFavorites = async () => {
      try {
        setLoading(true);
        const data = await fetchFavorites(user.id);
        setFavorites(data);
        setError(null);
      } catch (err) {
        setError('Failed to load favorites. Please try again later.');
        
      } finally {
        setLoading(false);
      }
    };

    getFavorites();
  }, []);


  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await removeFavorite(user.id, favoriteId);
      setFavorites(favorites.filter(item => item.favoriteId !== favoriteId));
      
    } catch (err) {
      // 错误处理可以在这里添加
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-6xl text-center">
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">收藏列表</h1>
        <p className="text-gray-500">{favorites.length} 个收藏</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <FavoriteCard
              key={item.favoriteId}
              item={item}
              onRemove={() => handleRemoveFavorite(item.favoriteId)}
            />
          ))}
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">暂无收藏</h2>
          <p className="text-gray-500 mb-6">
            开始探索并保存您喜欢的地点和体验。
          </p>
          <Button asChild>
            <Link to="/">立即探索</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

const FavoriteCard = ({ item, onRemove }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img
          src={`${API_BASE_URL}${item.images}`}
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
            收藏于 <FormattedDate date={item.createdAt} />
          </Badge>
        </div>
      </div>
      <CardContent className="pt-3 pb-2 flex-grow">
        {/* 调整了内容顺序，将标题移到了最上面 */}
        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{item.address}</span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {item.rating ? (
              <>
                <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                <span>{item.rating}</span>
              </>
            ) : (
              <span className="text-gray-400 text-sm italic">尚无评分</span>
            )}
          </div>
          {item.category === "experiences" && (
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {item.duration}
            </Badge>
          )}
        </div>
        
        <p className="font-bold mt-1">
          ${item.price}{"/晚"}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-row justify-between gap-2">
        <Button variant="outline" asChild className="flex-1">
          <Link to={`/listings/${item.listingId}`}>房源详细</Link>
        </Button>
        
      </CardFooter>
    </Card>
  );
};

export default Favorites;