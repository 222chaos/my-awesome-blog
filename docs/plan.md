  ✦ 现代化相册页面设计方案

    1. 概述

    本文档详细介绍了现代化相册页面的设计方案，包括整体布局、功能特性、UI/UX设计、技术实现等方面。该设计方案旨在创建一个美观、功能丰富且用户友好的相册页面。

    2. 整体布局设计

    2.1 响应式网格布局

     - 使用 Masonry 瀑布流布局，让图片按自然高度排列
     - 支持多种屏幕尺寸（手机、平板、桌面）
     - 图片间距均匀，保持视觉平衡

    2.2 视觉层次

     - 顶部导航栏，包含相册标题和筛选功能
     - 中央内容区域，展示照片网格
     - 底部页脚，包含版权信息

    3. 功能特性

    3.1 核心功能

     - 照片网格展示（瀑布流布局）
     - 照片筛选（按标签、日期、相册分类）
     - 照片搜索功能
     - 照片详情弹窗（灯箱效果）
     - 照片下载功能
     - 社交分享功能

    3.2 交互功能

     - 悬停效果（显示照片标题、描述）
     - 点击放大（灯箱效果）
     - 懒加载（提升性能）
     - 平滑过渡动画

    4. UI/UX 设计

    4.1 色彩方案

     - 背景色：深色主题（#111111）或浅色主题（#f8fafc）
     - 卡片边框：透明或微妙的边框
     - 按钮：科技蓝渐变（#2563eb 到 #60a5fa）
     - 文字：高对比度（#f8fafc 或 #0a0a0a）

    4.2 字体设计

     - 标题：使用粗体，字号较大
     - 描述：使用常规字体，较小字号
     - 确保在各种背景上的可读性

    5. 技术实现

    5.1 前端技术栈

     - React + TypeScript
     - Tailwind CSS（样式）
     - Framer Motion（动画）
     - React Lightbox（灯箱效果）
     - React Virtualized（懒加载）

      1 // AlbumPage.tsx
      2 'use client';
      3
      1 // AlbumPage.tsx
      2 'use client';
      3
      4 import { useState, useEffect } from 'react';
      5 import { motion, AnimatePresence } from 'framer-motion';
      6 import { Search, Filter, Download, Share2, X, Grid3X3, Calendar, Tag } from 'lucide-react';
      7 import { Button } from '@/components/ui/Button';
      8 import { Input } from '@/components/ui/Input';
      9 import GlassCard from '@/components/ui/GlassCard';
       1 // AlbumPage.tsx
       2 'use client';
       3
       4 import { useState, useEffect } from 'react';
       5 import { motion, AnimatePresence } from 'framer-motion';
       6 import { Search, Filter, Download, Share2, X, Grid3X3, Calendar, Tag } from 'lucide-react';
       7 import { Button } from '@/components/ui/Button';
       8 import { Input } from '@/components/ui/Input';
       9 import GlassCard from '@/components/ui/GlassCard';
      10 import { useThemedClasses } from '@/hooks/useThemedClasses';
      11
      12 interface Photo {
      13   id: string;
      14   src: string;
      15   alt: string;
      16   title: string;
      17   description?: string;
      18   tags: string[];
      19   date: string;
      20   width: number;
      21   height: number;
      22 }
      23
      24 interface AlbumPageProps {
      25   albumId: string;
      26 }
      27
      28 export default function AlbumPage({ albumId }: AlbumPageProps) {
      29   const { themedClasses, getThemeClass } = useThemedClasses();
      30   const [photos, setPhotos] = useState<Photo[]>([]);
      31   const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
      32   const [searchQuery, setSearchQuery] = useState('');
      33   const [selectedTags, setSelectedTags] = useState<string[]>([]);
      34   const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
      35   const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
      36   const [loading, setLoading] = useState(true);
      37   const [allTags, setAllTags] = useState<string[]>([]);
      38
      39   // 模拟获取相册数据
      40   useEffect(() => {
      41     const fetchPhotos = async () => {
      42       setLoading(true);
      43       // 模拟 API 调用
      44       await new Promise(resolve => setTimeout(resolve, 800));
      45
      46       // 模拟数据
      47       const mockPhotos: Photo[] = [
      48         {
      49           id: '1',
      50           src: '/assets/album/photo1.jpg',
      51           alt: '风景照',
      52           title: '美丽的山景',
      53           description: '在山区拍摄的壮丽景色',
      54           tags: ['风景', '自然', '山脉'],
      55           date: '2023-05-15',
      56           width: 1200,
      57           height: 800
      58         },
      59         {───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
      60           id: '2', 切换)                                                                                                                                                     24.7% context used | ✖ 7 errors (ctrl+o for details)
      61           src: '/assets/album/photo2.jpg',
      62           alt: '城市夜景',                                                                                                                                                   24.7% context used | ✖ 7 errors (ctrl+o for details)
      63           title: '都市之夜',
      64           description: '繁华城市的夜景',
      65           tags: ['城市', '夜景', '建筑'],
      66           date: '2023-06-20',
      67           width: 1000,
      68           height: 667
      69         },
      70         {
      71           id: '3',
      72           src: '/assets/album/photo3.jpg',
      73           alt: '人物肖像',
      74           title: '微笑的人',
      75           description: '自然光线下的肖像',
      76           tags: ['人物', '肖像', '人像'],
      77           date: '2023-07-10',
      78           width: 800,
      79           height: 1200
      80         },
      81         {
      82           id: '4',
      83           src: '/assets/album/photo4.jpg',
      84           alt: '海滩日落',
      85           title: '夕阳西下',
      86           description: '海滩上的美丽日落',
      87           tags: ['海滩', '日落', '天空'],
      88           date: '2023-08-05',
      89           width: 1200,
      90           height: 800
      91         },
      92         {
      93           id: '5',
      94           src: '/assets/album/photo5.jpg',
      95           alt: '森林小径',
      96           title: '林间小路',
      97           description: '穿过森林的小径',
      98           tags: ['森林', '自然', '小径'],
      99           date: '2023-09-12',
     100           width: 900,
     101           height: 600
     102         },
     103         {
     104           id: '6',
     105           src: '/assets/album/photo6.jpg',
     106           alt: '星空夜景',
     107           title: '璀璨星河',
     108           description: '清晰可见的银河系',
     109           tags: ['星空', '夜景', '天文'],
     110           date: '2023-10-18',
     111           width: 1200,
     112           height: 800
     113         }
     114       ];
     115
     116       setPhotos(mockPhotos);
     117       setFilteredPhotos(mockPhotos);
     118
     119       // 提取所有唯一标签
     120       const tags = Array.from(new Set(mockPhotos.flatMap(photo => photo.tags)));
     121       setAllTags(tags);
     122
     123       setLoading(false);
     124     };
     125
     126     fetchPhotos();
     127   }, [albumId]);
     128
     129   // 过滤和筛选逻辑
     130   useEffect(() => {
     131     let result = photos;
     132
     133     // 按搜索查询过滤
     134     if (searchQuery) {
     135       const query = searchQuery.toLowerCase();
     136       result = result.filter(photo =>
     137         photo.title.toLowerCase().includes(query) ||
     138         photo.description?.toLowerCase().includes(query) ||
     139         photo.tags.some(tag => tag.toLowerCase().includes(query))
     140       );
     141     }
     142
     143     // 按标签过滤
     144     if (selectedTags.length > 0) {
     145       result = result.filter(photo =>
     146         selectedTags.every(tag => photo.tags.includes(tag))
     147       );
     148     }
     149
     150     // 排序
     151     result = [...result].sort((a, b) => {
     152       if (sortBy === 'date') {
     153         return new Date(b.date).getTime() - new Date(a.date).getTime();
     154       } else {
     155         return a.title.localeCompare(b.title);
     156       }
     157     });
     158
     159     setFilteredPhotos(result);
     160   }, [searchQuery, selectedTags, sortBy, photos]);
     161
     162   const handleTagToggle = (tag: string) => {
     163     setSelectedTags(prev =>
     164       prev.includes(tag)
     165         ? prev.filter(t => t !== tag)
     166         : [...prev, tag]
     167     );
     168   };
     169
     170   const openLightbox = (photo: Photo) => {
     171     setSelectedPhoto(photo);
     172   };
     173
     174   const closeLightbox = () => {
     175     setSelectedPhoto(null);
     176   };
     177
     178   // 主题相关样式
     179   const containerBgClass = getThemeClass(
     180     'bg-gradient-to-br from-tech-darkblue/20 via-tech-deepblue/10 to-tech-cyan/5',
     181     'bg-gradient-to-br from-gray-100 to-gray-50'
     182   );
     183
     184   const cardBgClass = themedClasses.cardBgClass;
     185   const textClass = themedClasses.textClass;
     186   const accentClass = getThemeClass(
     187     'text-tech-cyan',
     188     'text-blue-600'
     189   );
     190
     191   return (
     192     <div className={`min-h-screen py-8 sm:py-12 transition-colors duration-300 ${containerBgClass}`}>
     193       <div className="container mx-auto px-4 max-w-7xl">
     194         {/* 相册标题 */}
     195         <div className="mb-8 text-center">
     196           <h1 className={`text-4xl font-bold ${accentClass}`}>我的相册</h1>
     197           <p className={`text-lg mt-2 ${getThemeClass('text-foreground/70', 'text-gray-600')}`}>
     198             {filteredPhotos.length} 张照片
     199           </p>
     200         </div>
     201
     202         {/* 搜索和筛选控件 */}
     203         <GlassCard className={`mb-8 p-6 ${cardBgClass}`}>
     204           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     205             {/* 搜索框 */}
     206             <div className="relative">
     207               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
     208               <Input
     209                 type="text"
     210                 placeholder="搜索照片..."
     211                 value={searchQuery}
     212                 onChange={(e) => setSearchQuery(e.target.value)}
     213                 className={`pl-10 ${getThemeClass(
     214                   'bg-glass/30 border-glass-border text-foreground placeholder:text-foreground/50',
     215                   'bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500'
     216                 )}`}
     217               />
     218             </div>
     219
     220             {/* 标签筛选 */}
     221             <div className="flex flex-wrap gap-2">
     222               <div className="flex items-center gap-2 mr-2">
     223                 <Filter className="w-4 h-4 text-tech-cyan" />
     224                 <span className={`text-sm ${textClass}`}>标签:</span>
     225               </div>
     226               {allTags.map(tag => (
     227                 <button
     228                   key={tag}
     229                   onClick={() => handleTagToggle(tag)}
     230                   className={`px-3 py-1 rounded-full text-sm transition-colors ${
     231                     selectedTags.includes(tag)
     232                       ? 'bg-tech-cyan text-white'
     233                       : getThemeClass(
     234                           'bg-glass/30 text-foreground hover:bg-glass/50',
     235                           'bg-gray-200 text-gray-800 hover:bg-gray-300'
     236                         )
     237                   }`}
     238                 >
     239                   {tag}
     240                 </button>
     241               ))}
     242             </div>
     243
     244             {/* 排序选项 */}
     245             <div className="flex items-center justify-end gap-4">
     246               <div className="flex items-center gap-2">
     247                 <span className={`text-sm ${textClass}`}>排序:</span>
     248                 <select
     249                   value={sortBy}
     250                   onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
     251                   className={`px-3 py-1 rounded-lg ${getThemeClass(
     252                     'bg-glass/30 border-glass-border text-foreground',
     253                     'bg-white/80 border-gray-300 text-gray-800'
     254                   )}`}
     255                 >
     256                   <option value="date">按日期</option>
     257                   <option value="title">按标题</option>
     258                 </select>
     259               </div>
     260               <Button
     261                 variant="outline"
     262                 className={getThemeClass(
     263                   'border-glass-border text-foreground hover:bg-glass/40',
     264                   'border-gray-300 text-gray-800 hover:bg-gray-50'
     265                 )}
     266               >
     267                 <Grid3X3 className="w-4 h-4 mr-2" />
     268                 网格
     269               </Button>
     270             </div>
     271           </div>
     272         </GlassCard>
     273
     274         {/* 照片网格 */}
     275         {loading ? (
     276           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
     277             {[...Array(8)].map((_, idx) => (
     278               <div key={idx} className="aspect-square bg-muted rounded-xl animate-pulse" />
     279             ))}
     280           </div>
     281         ) : filteredPhotos.length === 0 ? (
     282           <div className="text-center py-16">
     283             <div className="mx-auto w-24 h-24 rounded-full bg-tech-cyan/10 flex items-center justify-center mb-6">
     284               <Search className="w-12 h-12 text-tech-cyan" />
     285             </div>
     286             <h3 className={`text-xl font-semibold ${textClass} mb-2`}>未找到照片</h3>
     287             <p className={`text-muted-foreground ${textClass}`}>
     288               尝试调整搜索条件或清除筛选器
     289             </p>
     290             <Button
     291               variant="outline"
     292               className="mt-6"
     293               onClick={() => {
     294                 setSearchQuery('');
     295                 setSelectedTags([]);
     296               }}
     297             >
     298               清除筛选器
     299             </Button>
     300           </div>
     301         ) : (
     302           <motion.div
     303             layout
     304             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
     305           >
     306             <AnimatePresence>
     307               {filteredPhotos.map((photo) => (
     308                 <motion.div
     309                   key={photo.id}
     310                   layout
     311                   initial={{ opacity: 0, scale: 0.8 }}
     312                   animate={{ opacity: 1, scale: 1 }}
     313                   exit={{ opacity: 0, scale: 0.8 }}
     314                   transition={{ duration: 0.3 }}
     315                   whileHover={{ y: -5 }}
     316                   className="group cursor-pointer"
     317                   onClick={() => openLightbox(photo)}
     318                 >
     319                   <GlassCard className={`overflow-hidden aspect-square ${cardBgClass} transition-all duration-300`}>
     320                     <div className="relative w-full h-full">
     321                       <img
     322                         src={photo.src}
     323                         alt={photo.alt}
     324                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
     325                       />
     326                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
     327                         <div className="text-white">
     328                           <h3 className="font-semibold truncate">{photo.title}</h3>
     329                           <p className="text-sm opacity-80 truncate">{photo.date}</p>
     330                         </div>
     331                       </div>
     332                       <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
     333                         <Button
     334                           size="sm"
     335                           variant="secondary"
     336                           className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
     337                           onClick={(e) => {
     338                             e.stopPropagation();
     339                             // 下载逻辑
     340                           }}
     341                         >
     342                           <Download className="w-4 h-4" />
     343                         </Button>
     344                         <Button
     345                           size="sm"
     346                           variant="secondary"
     347                           className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
     348                           onClick={(e) => {
     349                             e.stopPropagation();
     350                             // 分享逻辑
     351                           }}
     352                         >
     353                           <Share2 className="w-4 h-4" />
     354                         </Button>
     355                       </div>
     356                     </div>
     357                   </GlassCard>
     358                 </motion.div>
     359               ))}
     360             </AnimatePresence>
     361           </motion.div>
     362         )}
     363       </div>
     364
     365       {/* 照片灯箱 */}
     366       <AnimatePresence>
     367         {selectedPhoto && (
     368           <motion.div
     369             className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
     370             initial={{ opacity: 0 }}
     371             animate={{ opacity: 1 }}
     372             exit={{ opacity: 0 }}
     373             onClick={closeLightbox}
     374           >
     375             <motion.div
     376               className="relative max-w-6xl max-h-[90vh] w-full"
     377               initial={{ scale: 0.8 }}
     378               animate={{ scale: 1 }}
     379               exit={{ scale: 0.8 }}
     380               onClick={(e) => e.stopPropagation()}
     381             >
     382               <button
     383                 onClick={closeLightbox}
     384                 className="absolute -top-12 right-0 text-white hover:text-tech-cyan transition-colors"
     385               >
     386                 <X className="w-8 h-8" />
     387               </button>
     388
     389               <div className="relative rounded-xl overflow-hidden">
     390                 <img
     391                   src={selectedPhoto.src}
     392                   alt={selectedPhoto.alt}
     393                   className="w-full h-auto max-h-[80vh] object-contain"
     394                 />
     395
     396                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
     397                   <h2 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h2>
     398                   <div className="flex flex-wrap gap-4 items-center">
     399                     <div className="flex items-center gap-2">
     400                       <Calendar className="w-4 h-4" />
     401                       <span>{selectedPhoto.date}</span>
     402                     </div>
     403                     <div className="flex items-center gap-2">
     404                       <Tag className="w-4 h-4" />
     405                       <div className="flex gap-2">
     406                         {selectedPhoto.tags.map(tag => (
     407                           <span key={tag} className="px-2 py-1 bg-tech-cyan/20 rounded-full text-sm">
     408                             {tag}
     409                           </span>
     410                         ))}
     411                       </div>
     412                     </div>
     413                   </div>
     414                   {selectedPhoto.description && (
     415                     <p className="mt-3 opacity-90">{selectedPhoto.description}</p>
     416                   )}
     417                 </div>
     418
     419                 <div className="absolute top-4 right-4 flex gap-2">
     420                   <Button
     421                     variant="secondary"
     422                     className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
     423                     onClick={() => {
     424                       // 下载逻辑
     425                     }}
     426                   >
     427                     <Download className="w-4 h-4 mr-2" />
     428                     下载
     429                   </Button>
     430                   <Button
     431                     variant="secondary"
     432                     className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
     433                     onClick={() => {
     434                       // 分享逻辑
     435                     }}
     436                   >
     437                     <Share2 className="w-4 h-4 mr-2" />
     438                     分享
     439                   </Button>
     440                 </div>
     441               </div>
     442             </motion.div>
     443           </motion.div>
     444         )}
     445       </AnimatePresence>
     446     </div>
     447   );
     448 }

    7. 设计亮点

     1. 响应式瀑布流布局：使用 CSS Grid 实现响应式照片网格
     2. 悬停效果：鼠标悬停时显示照片信息和操作按钮
     3. 灯箱效果：点击照片时弹出全屏查看模式
     4. 筛选功能：支持按标签、搜索词和排序方式进行筛选
     5. 加载状态：显示骨架屏提升用户体验
     6. 玻璃态设计：使用磨砂玻璃效果增强视觉层次
     7. 平滑动画：使用 Framer Motion 添加过渡动画