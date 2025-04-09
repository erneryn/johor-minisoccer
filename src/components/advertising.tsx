import Card from './card';
import { partner } from '@/app/config';

export default function Promotion() {
    return (
        <div className="sm:flex sm:justify-center sm:items-center sm:gap-4 mt-10">
            <h1 className="text-4xl font-bold text-orange-500 mb-4">Official Partner</h1>
            {partner.map((partner) => (
                <Card 
                key={partner.id} 
                mainTitle={partner.mainTitle} 
                title={partner.title} 
                description={partner.description}
                image={partner.image}
                />
            ))}
        </div>
    )
}