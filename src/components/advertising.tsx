import { partner } from "@/app/config";
import Image from "next/image";
import { FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

export default function Promotion() {
  return (
    <div className="mt-14 text-center">
      <h1 className="text-4xl font-bold text-orange-500 mb-4">
        Official Partner
      </h1>
      <div className="sm:px-40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
        {partner.map((partner) => (
          <div key={partner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={partner.image}
                alt={partner.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 bg-gray-800 h-full flex flex-col">
              <h3 className="text-2xl font-semibold text-white mb-1">{partner.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{partner.description}</p>
              <div className="flex flex-col items-start">
                <a 
                  href={partner.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 flex hover:text-pink-700 transition-colors text-left"
                >
                  <FaInstagram className="w-6 h-6" />
                  {partner.instagramName && <span className="text-white ml-2 mb-4">{partner.instagramName}</span>}
                </a>  
                <a 
                  href={partner.maps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-pink-600 flex hover:text-pink-700 transition-colors text-left ${partner.maps ? '' : 'hidden'}`}
                >
                  <FaMapMarkerAlt className="w-6 h-6" />
                  {partner.mapsName && <span className="text-white ml-2 text-xs">{partner.mapsName}</span>}
                </a>                    
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
