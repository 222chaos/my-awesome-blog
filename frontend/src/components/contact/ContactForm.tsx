'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, User, MessageSquare, Tag } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    } else if (formData.name.length < 2) {
      newErrors.name = '姓名至少需要2个字符';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入您的邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '请输入主题';
    } else if (formData.subject.length < 3) {
      newErrors.subject = '主题至少需要3个字符';
    }

    if (!formData.message.trim()) {
      newErrors.message = '请输入消息内容';
    } else if (formData.message.length < 10) {
      newErrors.message = '消息至少需要10个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-1">
        发送消息
      </h2>

      <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-gray-200 dark:border-gray-800">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                发送成功！
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                感谢您的留言，我会尽快回复您的消息。
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetForm}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
              >
                发送另一条消息
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2">
                    <User className="w-4 h-4" />
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="您的姓名"
                    className={cn(
                      'w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400',
                      errors.name
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
                    )}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-1.5 text-sm text-red-500"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2">
                    <Mail className="w-4 h-4" />
                    邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={cn(
                      'w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400',
                      errors.email
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
                    )}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-1.5 text-sm text-red-500"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <Tag className="w-4 h-4" />
                  主题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="消息主题"
                  className={cn(
                    'w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400',
                    errors.subject
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
                  )}
                />
                {errors.subject && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 mt-1.5 text-sm text-red-500"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.subject}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <MessageSquare className="w-4 h-4" />
                  消息 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="请输入您的消息内容..."
                  rows={6}
                  className={cn(
                    'w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 resize-none',
                    errors.message
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
                  )}
                />
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 mt-1.5 text-sm text-red-500"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.message}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={cn(
                    'flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer',
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5"
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                      发送中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      发送消息
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
