'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Github, Twitter, Linkedin, Code, Briefcase, Users, Zap, MessageSquare as ChatIcon, HelpCircle, User } from 'lucide-react';
import ContactSidebar from '@/components/contact/ContactSidebar';
import ContactForm from '@/components/contact/ContactForm';
import ContactCards from '@/components/contact/ContactCard';
import FAQAccordion from '@/components/contact/FAQAccordion';
import SocialProof from '@/components/contact/SocialProof';
import AvailabilityCard from '@/components/contact/AvailabilityCard';

const contactMethods = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: '邮件联系',
    description: '通过电子邮件与我取得联系，我会尽快回复您的消息。',
    href: 'mailto:contact@example.com',
  },
  {
    icon: <ChatIcon className="w-6 h-6" />,
    title: '在线咨询',
    description: '通过即时消息工具与我进行快速沟通和交流。',
    href: '#contact-form',
  },
  {
    icon: <Github className="w-6 h-6" />,
    title: 'GitHub',
    description: '查看我的开源项目，提交问题或参与讨论。',
    href: 'https://github.com',
  },
  {
    icon: <Twitter className="w-6 h-6" />,
    title: 'Twitter',
    description: '在社交媒体上关注我，获取最新动态和技术分享。',
    href: 'https://twitter.com',
  },
  {
    icon: <Linkedin className="w-6 h-6" />,
    title: 'LinkedIn',
    description: '在专业社交平台上与我建立联系。',
    href: 'https://linkedin.com',
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: '商务合作',
    description: '有项目合作或商务需求？欢迎随时与我洽谈。',
    href: '#contact-form',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: '社区交流',
    description: '加入技术社区，与更多开发者交流学习。',
    href: '#',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: '快速咨询',
    description: '紧急问题？通过此渠道获得更快的响应。',
    href: '#contact-form',
  },
];

const faqs = [
  {
    id: '1',
    question: '通常多久回复消息？',
    answer: '我会尽量在24小时内回复您的消息。对于电子邮件，通常在工作日的48小时内回复。对于紧急事项，建议使用快速咨询渠道或社交媒体私信，这样响应速度会更快。',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'general' as const,
  },
  {
    id: '2',
    question: '可以接受哪些类型的合作？',
    answer: '我接受多种类型的合作，包括但不限于：技术项目开发、技术顾问咨询、内容创作合作、开源项目贡献、技术分享和培训等。如果您有具体的合作想法，欢迎通过邮件与我详细沟通。',
    icon: <Briefcase className="w-5 h-5" />,
    category: 'collaboration' as const,
  },
  {
    id: '3',
    question: '是否提供技术咨询服务？',
    answer: '是的，我提供技术咨询服务。服务范围包括：技术架构设计、代码审查、性能优化、技术选型建议、团队技术培训等。请通过商务合作渠道与我联系，我们可以根据您的具体需求制定服务方案。',
    icon: <Code className="w-5 h-5" />,
    category: 'collaboration' as const,
  },
  {
    id: '4',
    question: '如何参与开源项目？',
    answer: '我的开源项目托管在GitHub上。您可以通过以下方式参与：提交Pull Request、报告Issue、参与讨论、改进文档等。无论您是新手还是经验丰富的开发者，我都欢迎您的贡献！',
    icon: <Github className="w-5 h-5" />,
    category: 'technical' as const,
  },
  {
    id: '5',
    question: '可以请求代码审查吗？',
    answer: '当然可以！我乐于帮助开发者改进代码。您可以将代码片段或项目链接发送给我，我会从代码质量、性能、可维护性等角度提供建议。对于大型项目，可能需要安排专门的代码审查会议。',
    icon: <Zap className="w-5 h-5" />,
    category: 'technical' as const,
  },
  {
    id: '6',
    question: '社交媒体上有哪些内容？',
    answer: '我在社交媒体上分享：技术见解、开发经验、工具推荐、行业动态、学习资源等内容。您可以根据自己的兴趣选择关注不同的平台。Twitter上内容较为及时，LinkedIn更偏向专业分享。',
    icon: <Users className="w-5 h-5" />,
    category: 'social' as const,
  },
  {
    id: '7',
    question: '技术栈主要涉及哪些领域？',
    answer: '我的技术栈主要包括：前端开发、后端开发、全栈开发、系统设计、云服务、DevOps等。具体技术包括：JavaScript/TypeScript、Python、React、Next.js、FastAPI、SQL/NoSQL数据库、Docker、Kubernetes等。如果需要了解特定技术的能力，欢迎直接询问。',
    icon: <Code className="w-5 h-5" />,
    category: 'technical' as const,
  },
  {
    id: '8',
    question: '如何安排线下会面？',
    answer: '如果需要线下会面，请提前通过邮件与我联系。我会根据双方的地理位置和时间安排协商会面事宜。对于项目合作，通常建议先通过线上沟通了解需求，再决定是否需要线下会议。',
    icon: <Briefcase className="w-5 h-5" />,
    category: 'collaboration' as const,
  },
];

export default function ContactPage() {
  const [activeSection, setActiveSection] = useState<string>('all');

  return (
    <div className="h-screen pt-16 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <div className="flex h-full">
        <ContactSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-8 scrollbar-hide">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <HeroSection />
            
            {(activeSection === 'all' || activeSection === 'contact') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ContactForm id="contact-form" />
                <ContactCards cards={contactMethods} />
              </motion.div>
            )}
            
            {(activeSection === 'all' || activeSection === 'contact') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AvailabilityCard />
              </motion.div>
            )}
            
            {(activeSection === 'all' || activeSection === 'contact') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SocialProof />
              </motion.div>
            )}
            
            {(activeSection === 'all' || activeSection === 'faq') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FAQAccordion faqs={faqs} />
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 text-center"
            >
              <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  还没有找到答案？
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  如果您有其他问题或需要帮助，请随时通过上方的方式联系我。
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = 'mailto:contact@example.com'}
                >
                  立即联系
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
