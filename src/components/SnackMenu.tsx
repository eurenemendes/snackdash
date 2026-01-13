import { snacks } from '@/lib/placeholder-images';
import SnackCard from './SnackCard';

export default function SnackMenu() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {snacks.map((snack) => (
        <SnackCard key={snack.id} snack={snack} />
      ))}
    </div>
  );
}
