'use client';

import { useState, useRef } from 'react';
import { CameraIcon, Upload, X, ZoomIn, RotateCcw, Check } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface AvatarUploaderProps {
  currentAvatar?: string;
  onAvatarChange: (avatar: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarUploader({ currentAvatar, onAvatarChange, isOpen, onClose }: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        // 模拟上传进度
        simulateUpload();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (preview) {
            onAvatarChange(preview);
            onClose();
          }
        }, 500);
      }
    }, 100);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <GlassCard
        padding="lg"
        className="max-w-lg w-full animate-scale-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gradient-primary">更换头像</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tech-cyan/10 rounded-full transition-all duration-200 cursor-pointer group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-tech-cyan transition-colors" />
          </button>
        </div>

        {/* 上传区域 */}
        {!preview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
              ${isDragging
                ? 'border-tech-cyan bg-tech-cyan/10 scale-105'
                : 'border-border hover:border-tech-cyan/50 hover:bg-tech-cyan/5'
              }
              animate-float-improved
            `}
          >
            {/* 装饰背景 */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-tech-cyan/10 via-tech-sky/10 to-tech-cyan/10" />
            </div>

            {/* 图标 */}
            <div className="relative z-10 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-tech-cyan/20 to-tech-sky/20 flex items-center justify-center
                group-hover:scale-110 transition-transform duration-300
              ">
                <Upload className="w-10 h-10 text-tech-cyan" />
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  {isDragging ? '释放以上传' : '点击或拖拽图片到此处'}
                </p>
                <p className="text-sm text-muted-foreground">
                  支持 JPG、PNG、GIF 格式，最大 5MB
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        ) : (
          /* 预览区域 */
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-tech-cyan via-tech-sky to-tech-cyan rounded-full animate-spin-slow blur-xl opacity-50" />
              <img
                src={preview}
                alt="Avatar preview"
                className="relative w-48 h-48 mx-auto rounded-full object-cover border-4 border-background shadow-2xl"
              />
            </div>

            {/* 上传进度 */}
            {uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">上传中...</span>
                  <span className="text-tech-cyan font-medium">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-tech-cyan to-tech-sky rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 完成提示 */}
            {uploadProgress === 100 && (
              <div className="flex items-center justify-center gap-2 text-green-500 animate-fade-in">
                <Check className="w-5 h-5" />
                <span className="font-medium">头像已准备好</span>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPreview(null);
                  setUploadProgress(0);
                }}
                className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors duration-200 cursor-pointer font-medium"
              >
                重新选择
              </button>
              {uploadProgress === 100 && (
                <button
                  onClick={() => {
                    onAvatarChange(preview!);
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-tech-cyan to-tech-sky text-white rounded-xl hover:from-tech-cyan/90 hover:to-tech-sky/90 transition-all duration-200 cursor-pointer font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  确认更换
                </button>
              )}
            </div>
          </div>
        )}

        {/* 底部提示 */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CameraIcon className="w-4 h-4 text-tech-cyan" />
            <span>建议尺寸：200x200 像素，支持正方形或圆形裁剪</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
