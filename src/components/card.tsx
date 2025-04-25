'use client'
import Image from 'next/image';
import MainButton from './button/mainButton';
import { useState } from "react";
import { Modal } from "flowbite-react";

interface CardProps {
  mainTitle?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  badge?: string;
  type?: string;
}

export default function Card({mainTitle, title, description, buttonText, buttonLink, image ,badge, type}: CardProps) {
  const [showZoom, setShowZoom] = useState(false);

  return (
    <div className='container mx-auto px-1 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-6'>
    <div className={`relative overflow-hidden rounded-2xl bg-gray-800 shadow-xl cursor-pointer ${type === 'partner' ? '' : 'h-[50vh]'}`} onClick={() => setShowZoom(!buttonLink && !buttonText)}>
    {badge && (
          <div className="absolute top-0 right-0 z-20">
            <span className="bg-orange-500 text-white px-4 py-1  text-sm font-semibold uppercase tracking-wider shadow-lg">
              {badge}
            </span>
          </div>
        )}
      <div className="w-full h-full">
        <Image
          src={image}
          alt={title}
          {...(type === 'partner' ? {width: 1000, height: 1000} : {fill: true})}
          className="object-cover hover:scale-105 transition-transform duration-300"
          // Add a blur placeholder while loading (optional)
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshIRshHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          placeholder="blur"
        />
        {
          !buttonLink && !buttonText && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-semibold">Click to zoom</span>
        </div>
        )
        }
      </div>
      {/* <div className="absolute inset-0 bg-black/50"></div> */}
      <div className="p-6 absolute left-0  right-0 bottom-0 z-10">
        {mainTitle && <h3 className="text-2xl font-bold text-orange-500 mb-2">{mainTitle}</h3>}
        {title && <h3 className="text-3xl font-bold text-white mb-2  bg-gray-400 bg-opacity-50 p-2 rounded-lg w-fit">{title}</h3>}
        {description && <p className={`text-gray-300 mb-4 shadow-xl`}>{description}</p>}
        {buttonLink && buttonText && <MainButton text={buttonText} link={buttonLink} />}
      </div>
    </div>

    <Modal show={showZoom} onClose={() => setShowZoom(false)} size="4xl">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={() => setShowZoom(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative w-full h-[600px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </Modal>
    </div>
  );
}