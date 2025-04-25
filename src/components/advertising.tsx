import Card from './card';
import { partner } from '@/app/config';

export default function Promotion() {
    return (
        <div className="mt-14 text-center">
            <h1 className="text-4xl font-bold text-orange-500 mb-4">Official Partner</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-6 justify-center"> 
                {partner.map((partner) => (
                    <Card 
                        key={partner.id} 
                        mainTitle={partner.mainTitle} 
                        title={partner.title} 
                        description={partner.description}
                        image={partner.image}
                        type={partner.type}
                    />
                ))}
            </div>
        </div>
    );
}