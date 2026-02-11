import os
import time
from pathlib import Path
from typing import Dict, List, Optional
try:
    from PIL import Image as PILImage
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False
    PILImage = None
from app.schemas.image import ImageUploadResponse, ImageVariant


class ImageService:
    # 预定义的图片尺寸
    IMAGE_SIZES = {
        'hero': (1920, 1080),
        'large': (1200, 675),
        'medium': (800, 450),
        'small': (400, 225),
        'thumbnail': (150, 150)
    }

    @staticmethod
    def compress_and_create_variants(
        original_path: str,
        output_dir: str,
        filename: str,
        quality: int = 85
    ) -> Dict:
        """
        压缩图片并创建多个尺寸变体
        """
        variants = []
        original_image = PILImage.open(original_path)
        width, height = original_image.size

        # 获取文件扩展名（不包含点）
        ext = Path(original_path).suffix.lower()

        # 生成唯一文件名
        base_filename = Path(filename).stem
        unique_suffix = str(int(time.time()))

        # 遍历所有预定义的尺寸
        for variant_name, target_size in ImageService.IMAGE_SIZES.items():
            # 计算保持宽高比的尺寸
            target_width, target_height = target_size
            ratio = min(target_width / width, target_height / height)
            new_width = int(width * ratio)
            new_height = int(height * ratio)

            # 缩放图片
            resized_image = original_image.resize(
                (new_width, new_height),
                PILImage.Resampling.LANCZOS
            )

            # 生成输出文件名
            output_filename = f"{base_filename}-{unique_suffix}-{variant_name}.webp"
            output_path = os.path.join(output_dir, output_filename)

            # 保存为WebP格式
            resized_image.save(
                output_path,
                'WEBP',
                quality=quality,
                method=6  # 更高的压缩率
            )

            # 获取文件大小
            file_size = os.path.getsize(output_path)

            variants.append({
                'variant_name': variant_name,
                'file_path': f"/images/uploads/{output_filename}",
                'width': new_width,
                'height': new_height,
                'file_size': file_size,
                'quality': quality,
                'format': 'webp'
            })

        return {
            'variants': variants,
            'original_width': width,
            'original_height': height,
            'total_size': sum(v['file_size'] for v in variants)
        }

    @staticmethod
    def optimize_image(
        image_path: str,
        quality: int = 85,
        max_size: tuple = None
    ) -> tuple:
        """
        优化单张图片
        """
        image = PILImage.open(image_path)

        # 如果需要调整大小
        if max_size:
            image.thumbnail(max_size, PILImage.Resampling.LANCZOS)

        # 转换为RGB（如果是RGBA）
        if image.mode in ('RGBA', 'LA', 'P'):
            # 创建白色背景
            background = PILImage.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            # 将图像粘贴到背景上
            if image.mode == 'RGBA':
                background.paste(image, mask=image.split()[-1])  # 使用alpha通道作为蒙版
            else:
                background.paste(image)
            image = background

        # 保存为WebP
        output_path = image_path.replace(
            Path(image_path).suffix,
            '.webp'
        )
        image.save(output_path, 'WEBP', quality=quality)

        return output_path, os.path.getsize(output_path)

    @staticmethod
    def validate_image_format(file_path: str) -> bool:
        """
        验证图片格式是否支持
        """
        try:
            with PILImage.open(file_path) as img:
                return img.format in ['JPEG', 'PNG', 'WEBP', 'GIF']
        except Exception:
            return False

    @staticmethod
    def get_image_info(file_path: str) -> Dict:
        """
        获取图片信息
        """
        try:
            with PILImage.open(file_path) as img:
                return {
                    'width': img.width,
                    'height': img.height,
                    'format': img.format,
                    'mode': img.mode,
                    'size': os.path.getsize(file_path)
                }
        except Exception as e:
            raise ValueError(f"无法获取图片信息: {str(e)}")

    @staticmethod
    def resize_image_to_max_dimension(image_path: str, max_dimension: int = 1920) -> str:
        """
        将图片调整到最大尺寸限制
        """
        with PILImage.open(image_path) as img:
            # 计算新的尺寸，保持宽高比
            width, height = img.size
            if max(width, height) <= max_dimension:
                return image_path  # 如果原图尺寸已小于限制，则无需调整

            if width > height:
                new_width = max_dimension
                new_height = int((new_width / width) * height)
            else:
                new_height = max_dimension
                new_width = int((new_height / height) * width)

            resized_img = img.resize((new_width, new_height), PILImage.Resampling.LANCZOS)

            # 保存调整后的图片
            output_path = image_path.rsplit('.', 1)[0] + f'_resized.{image_path.rsplit(".", 1)[1]}'
            resized_img.save(output_path, img.format)

            return output_path
