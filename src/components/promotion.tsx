import Card from './card';
import { promotions } from '@/app/config';

export default function Promotion() {
    return (
        <div className="sm:flex sm:justify-center sm:items-center sm:gap-4 mt-10">
         <h1 className="sm:hidden text-4xl font-bold text-orange-500 mb-4">Promotion & Event</h1>
            {promotions.map((promo) => (
                <Card 
                key={promo.id} 
                mainTitle={promo.mainTitle} 
                title={promo.title} 
                description={promo.description}
                image={promo.image}
                />
            ))}
             <h1 className="hidden sm:block text-4xl font-bold text-orange-500 mb-4">Promotion & Event</h1>
        </div>
    )
}