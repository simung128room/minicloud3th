import React from "react";
import {
  Zap,
  ShieldCheck,
  CreditCard,
  Headphones,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

interface FeaturesSectionProps {
  onExploreClick?: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onExploreClick,
}) => {
  const features = [
    {
      icon: Zap,
      title: "ระบบส่งมอบทันที 3 วิ",
      description:
        "เมื่อชำระเงินสำเร็จ ระบบอัจฉริยะจะจัดส่งข้อมูลไอดีและรหัสผ่านเข้าสู่หน้าคำสั่งซื้อของคุณทันที 24 ชั่วโมง",
      color: "text-amber-400",
    },
    {
      icon: ShieldCheck,
      title: "รับประกันแท้ 100%",
      description:
        "คัดกรองไอดีและคีย์แท้ทุกรายการ มีระบบบันทึกประวัติการเคลมและดูแลเปลี่ยนให้อัตโนมัติหากพบปัญหา",
      color: "text-emerald-400",
    },
    {
      icon: CreditCard,
      title: "เติมเงิน QR & TrueMoney",
      description:
        "สแกนจ่ายผ่านพร้อมเพย์ทุกธนาคาร และทรูมันนี่ ยอดเข้ากระเป๋าทันที ไม่มีค่าธรรมเนียมแฝง",
      color: "text-blue-400",
    },
    {
      icon: Headphones,
      title: "บริการดูแลตลอด 24 ชม.",
      description:
        "ทีมงานพร้อมให้คำแนะนำและแก้ไขข้อสงสัยทุกขั้นตอนผ่านแชทสดและ Discord อย่างรวดเร็ว",
      color: "text-purple-400",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative select-none">
      {/* Subtle Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
          <span>GUARANTEED SERVICE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          มาตรฐานบริการระดับพรีเมียม
        </h2>
        <p className="text-sm text-white/50 font-light mt-2">
          ระบบคลาวด์อัตโนมัติความเร็วสูง มั่นใจได้ทุกคำสั่งซื้อ
        </p>
      </div>

      {/* Borderless Open Features Grid (No Boxy Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                <Icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
