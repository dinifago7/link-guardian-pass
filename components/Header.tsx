
import React from 'react';

const Header = () => {
  return (
    <header className="bg-usps-blue text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">USPS</div>
            <div className="hidden md:block text-sm">
              United States Postal Service
            </div>
          </div>
          <div className="text-sm hidden lg:block">
            1-800-ASK-USPS (1-800-275-8777)
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
