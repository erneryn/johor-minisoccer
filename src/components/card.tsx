import Image from 'next/image';
import MainButton from './button/mainButton';
interface CardProps {
  mainTitle?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  badge?: string;
}

export default function Card({mainTitle, title, description, buttonText, buttonLink, image ,badge}: CardProps) {
  return (
    <div className='container mx-auto px-1 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-6'>
    <div className="relative overflow-hidden rounded-2xl bg-gray-800 shadow-xl h-[50vh]">
    {badge && (
          <div className="absolute top-0 right-0 z-20">
            <span className="bg-orange-500 text-white px-4 py-1  text-sm font-semibold uppercase tracking-wider shadow-lg">
              {badge}
            </span>
          </div>
        )}
      <div className="h-full w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          // Add a blur placeholder while loading (optional)
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshIRshHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          placeholder="blur"
        />
      </div>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="p-6 absolute left-0  right-0 bottom-0 z-10">
        {mainTitle && <h3 className="text-2xl font-bold text-orange-500 mb-2">{mainTitle}</h3>}
        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        {buttonLink && buttonText && <MainButton text={buttonText} link={buttonLink} />}
      </div>
    </div>
    </div>
  );
}