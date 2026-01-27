'use client';

import { Camera } from 'lucide-react';

interface AvatarUploaderProps {
  avatar?: string;
  name?: string;
  isEditing?: boolean;
  onAvatarChange: (avatar: string) => void;
}

export default function AvatarUploader({ 
  avatar, 
  name, 
  isEditing = false,
  onAvatarChange 
}: AvatarUploaderProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group cursor-pointer">
      <div className="relative w-32 h-32 mx-auto">
        {/* 脉冲光环动画 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-tech-cyan to-tech-sky opacity-20 animate-pulse-glow" />
        
        {/* 主头像容器 */}
        <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-tech-cyan/30 shadow-[0_0_20px_var(--shadow-tech-cyan)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_var(--shadow-tech-cyan)] group-hover:border-tech-cyan/50">
          {avatar ? (
            <img 
              src={avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-tech-cyan/20 to-tech-sky/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-gradient-primary">
                {name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>

        {/* 编辑模式下的上传按钮 */}
        {isEditing && (
          <label className="absolute bottom-0 right-0 bg-tech-cyan hover:bg-tech-sky text-white p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-180 shadow-lg animate-float">
            <Camera className="w-5 h-5" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        )}

        {/* 悬浮效果的光环 */}
        <div className="absolute inset-0 rounded-full border-2 border-tech-cyan/0 group-hover:border-tech-cyan/30 transition-all duration-500" />
      </div>
    </div>
  );
}
