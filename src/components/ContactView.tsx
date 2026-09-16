import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare, Mail, Sparkles, Send, ExternalLink } from 'lucide-react';

interface ContactViewProps {
  onBack: () => void;
  facebookLink?: string;
  discordLink?: string;
  instagramLink?: string;
  contactEmail?: string;
}

export const ContactView: React.FC<ContactViewProps> = ({ 
  onBack, 
  facebookLink = '#',
  discordLink = 'https://discord.gg/2NSuSmkzun',
  instagramLink = '#',
  contactEmail = 'support.apexstoreth@gmail.com'
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-white min-h-[85vh]">
      {/* Back button */}
      <motion.button 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-all font-bold bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2 border border-white/[0.08] rounded-full text-xs sm:text-sm active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-blue-400" /> 
        <span>ย้อนกลับ</span>
      </motion.button>

      {/* Header Glass Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#0c0c12]/85 backdrop-blur-2xl p-6 sm:p-8 mb-8 glass-card glass-reflection shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ศูนย์บริการและติดต่อเรา
              </h1>
              <p className="text-white/50 text-xs sm:text-sm font-medium mt-0.5">
                Contact & Support Center — มีปัญหาการใช้งาน ติดต่อสอบถามทีมงานได้ตลอด 24 ชม.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Discord */}
        <motion.a 
          href={discordLink} 
          target={discordLink !== '#' ? "_blank" : "_self"} 
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -5 }}
          className="bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.08] hover:border-[#5865F2]/50 transition-all p-8 flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden rounded-[32px] shadow-xl glass-card glass-reflection"
          onClick={(e) => {
            if (discordLink === '#') e.preventDefault();
          }}
        >
          <div className="w-20 h-20 bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform rounded-3xl shadow-lg shadow-[#5865F2]/10">
            <svg width="40" height="40" viewBox="0 0 127.14 96.36" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.68,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.1,46,96,53,91,65.69,84.69,65.69Z"/>
            </svg>
          </div>
          <h2 className="text-xl font-black text-white mb-1.5 group-hover:text-[#5865F2] transition-colors">
            Discord Community
          </h2>
          <p className="text-white/50 text-xs sm:text-sm font-medium mb-6">
            พูดคุย สอบถามปัญหา แจ้งเคลมสินค้า และรับข่าวสารโปรโมชั่นล่าสุดผ่าน Discord
          </p>
          <div className="px-6 py-2.5 bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white font-bold text-xs rounded-full shadow-lg shadow-[#5865F2]/25 group-hover:scale-105 transition-all flex items-center gap-2">
            <span>เข้าร่วมเซิร์ฟเวอร์ Discord</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </motion.a>

        {/* Facebook */}
        <motion.a 
          href={facebookLink} 
          target={facebookLink !== '#' ? "_blank" : "_self"} 
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.08] hover:border-[#1877F2]/50 transition-all p-8 flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden rounded-[32px] shadow-xl glass-card glass-reflection"
          onClick={(e) => {
            if (facebookLink === '#') e.preventDefault();
          }}
        >
          <div className="w-20 h-20 bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform rounded-3xl shadow-lg shadow-[#1877F2]/10">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <h2 className="text-xl font-black text-white mb-1.5 group-hover:text-[#1877F2] transition-colors">
            Facebook Page
          </h2>
          <p className="text-white/50 text-xs sm:text-sm font-medium mb-6">
            ส่งข้อความผ่านทาง Facebook Inbox เพื่อขอความช่วยเหลือโดยตรงจากแอดมิน
          </p>
          <div className="px-6 py-2.5 bg-gradient-to-r from-[#1877F2] to-[#166fe5] text-white font-bold text-xs rounded-full shadow-lg shadow-[#1877F2]/25 group-hover:scale-105 transition-all flex items-center gap-2">
            <span>ส่งข้อความ Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </motion.a>
      </div>
    </div>
  );
};
