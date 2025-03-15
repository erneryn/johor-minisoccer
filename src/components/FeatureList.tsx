import { LifebuoyIcon, UserGroupIcon, BuildingStorefrontIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { features, type Feature } from '@/app/config';

const icons = {
  LifebuoyIcon: () => <LifebuoyIcon className="h-8 w-8 text-white" />,
  UserGroupIcon: () => <UserGroupIcon className="h-8 w-8 text-white" />,
  BuildingStorefrontIcon: () => <BuildingStorefrontIcon className="h-8 w-8 text-white" />,
  SparklesIcon: () => <SparklesIcon className="h-8 w-8 text-white" />
};

export default function FeatureList() {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-12">
      {features.map((feature: Feature) => {
        const IconComponent = icons[feature.icon as keyof typeof icons];
        return (
          <div key={feature.id} className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <IconComponent />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
} 