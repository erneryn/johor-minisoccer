import { promotions } from "@/app/config/config.json";
import Card from "./card";

export default function Promotion() {
    return (
        <div className="sm:flex sm:justify-center sm:items-center sm:gap-4">
            <h1 className="text-4xl font-bold text-orange-500 mb-4">Promotion & Event</h1>
            {promotions.map((promotion) => (
                <Card 
                key={promotion.id} 
                mainTitle={promotion.mainTitle} 
                title={promotion.title} 
                buttonLink={promotion.buttonLink}
                buttonText={promotion.buttonText}
                description={promotion.description} image={promotion.image} 
                badge={promotion.badge}
                />
            ))}
        </div>
    )
}