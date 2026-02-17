import { Heart } from 'lucide-react';
import { useAuthContext } from '@/contexts/auth-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  prestataireId: string;
  size?: number;
  className?: string;
}

export function FavoriteButton({ prestataireId, size = 16, className }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuthContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const isFav = isFavorite(prestataireId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Connectez-vous pour sauvegarder vos favoris');
      navigate('/auth');
      return;
    }

    const success = await toggleFavorite(prestataireId);
    if (success) {
      toast.success(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris ❤️');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-9 h-9 rounded-full flex items-center justify-center transition-all',
        isFav
          ? 'bg-red-50 hover:bg-red-100'
          : 'bg-ivory/90 hover:bg-ivory',
        className
      )}
      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        size={size}
        className={cn(
          'transition-colors',
          isFav ? 'text-red-500 fill-red-500' : 'text-chocolate'
        )}
      />
    </button>
  );
}
