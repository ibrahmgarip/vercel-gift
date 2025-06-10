import React from 'react';

const CommunityBanners = () => {
  return (
    <div className="bg-gray-100 rounded-lg py-4 mt-2 w-7xl max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-4 px-4">
          <div className="flex flex-col items-center">
          <img src="/community.png" alt="Community Icon" className="w-10 h-10" />
            <div className="text-center">
              <p className="text-sm font-semibold">Gerçek Kullanıcı Deneyimleri</p>
              <p className="text-xs text-gray-500">Topluluk Odaklı</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
          <img src="/community.png" alt="Community Icon" className="w-10 h-10" />
            <div className="text-center">
              <p className="text-sm font-semibold">Gerçek Kullanıcı Deneyimleri</p>
              <p className="text-xs text-gray-500">Topluluk Odaklı</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
          <img src="/community.png" alt="Community Icon" className="w-10 h-10" />
            <div className="text-center">
              <p className="text-sm font-semibold">Gerçek Kullanıcı Deneyimleri</p>
              <p className="text-xs text-gray-500">Topluluk Odaklı</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CommunityBanners;
