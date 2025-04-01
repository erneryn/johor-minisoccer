import HeroBanner from "@/components/hero-banner";
import MainFeature from "@/components/main-feature";
import FeatureList from '@/components/FeatureList';
import Card from "@/components/card";
import { cards } from "@/app/config";
import Promotion from "@/components/promotion";

export default async function Home() {
  return (
   <div className="max-w-screen-xl mx-auto py-6 p-4 ">
    <HeroBanner />
    <MainFeature />
    <FeatureList />
    {cards.map((card) => (
      <Card   
      key={card.id}
      mainTitle={card.mainTitle}
      title={card.title} 
      description={card.description}
      buttonText={card.buttonText}
      buttonLink={card.buttonLink}
      image={card.image} />
    ))}
    <Promotion />
   </div>
  );
}
