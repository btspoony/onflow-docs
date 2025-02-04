import React from 'react';
import { colors, ColorOption } from '@site/src/constants/colors';

interface ActionCardProps {
  iconColor?: ColorOption;
  cardColor?: ColorOption;
  heading: string;
  description: string;
  onClick?: () => void;
  variant?: 'default' | 'overlay' | 'horizontal';
}

export const LocationIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 text-black"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
);

const ActionCard: React.FC<ActionCardProps> = ({
  iconColor = 'white',
  cardColor = 'black',
  heading,
  description,
  onClick,
  variant = 'default',
}) => {
  const cardBg = colors[cardColor].dark;
  const iconBg = colors[iconColor].light;

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between p-6 rounded-lg shadow-lg hover:scale-[1.02] transition-transform ${variant === 'overlay' ? 'mt-6' : ''
        } ${onClick ? 'cursor-pointer' : ''} ${cardBg}`}
    >
      {variant === 'overlay' && (
        <div
          className={`absolute -top-5 left-6 w-10 h-10 rounded-md flex items-center justify-center ${iconBg}`}
        >
          <LocationIcon />
        </div>
      )}
      <div className="flex flex-col h-full">
        {variant === 'default' && (
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 ${iconBg}`}
          >
            <LocationIcon />
          </div>
        )}
        {variant === 'horizontal' && (
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-10 h-10 rounded-md flex items-center justify-center ${iconBg}`}
            >
              <LocationIcon />
            </div>
            <h3 className="text-xl font-semibold text-white">{heading}</h3>
          </div>
        )}
        {variant !== 'horizontal' && (
          <div className={variant === 'overlay' ? 'mt-6' : ''}>
            <h3 className="text-xl font-semibold text-white mb-2">{heading}</h3>
            <p className="text-sm text-gray-100">{description}</p>
          </div>
        )}
        {variant === 'horizontal' && (
          <p className="text-sm text-gray-100">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ActionCard;