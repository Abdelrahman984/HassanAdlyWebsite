import { Play, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import reciterImage from '../../imports/hassan-adly.jpg';
import { surahs } from '../data/surahs';
import { qiraat } from '../data/qiraat';
import { usePlayer } from '../context/PlayerContext';
import { apiService } from '../services/api';

export const Hero = () => {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const handleStartListening = async () => {
    // Start with Al-Fatihah (Surah 1) with Hafs recitation (Qiraa 1)
    const track = await apiService.getAudioTrack(1, 1);
    playTrack(track);
    navigate('/player');
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Sound Wave Visualization */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-full h-32 lg:h-48"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary rounded-full"
              style={{
                left: `${i * 5}%`,
                width: '2px',
                bottom: '50%',
              }}
              animate={{
                height: [20, 60, 20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Right on desktop, Top on mobile */}
          <motion.div
            className="text-center lg:text-right order-2 lg:order-1 space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Title */}
            <div className="space-y-3">
              <motion.h1
                className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                استمع إلى القرآن الكريم
              </motion.h1>
              <motion.p
                className="text-lg lg:text-xl text-primary font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                بصوت الشيخ حسن عدلي وبالقراءات العشر
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              تجربة استماع روحانية بجودة عالية لجميع السور والقراءات
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <button
                onClick={handleStartListening}
                className="group px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                ابدأ الاستماع
                <Play className="w-5 h-5" fill="currentColor" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium text-lg transition-all hover:scale-105 border border-border flex items-center justify-center gap-3"
              >
                <User className="w-5 h-5" />
                تعرف على الشيخ
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary">{surahs.length}</div>
                <div className="text-sm text-muted-foreground">سورة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary">{qiraat.length}</div>
                <div className="text-sm text-muted-foreground">قراءات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary">١</div>
                <div className="text-sm text-muted-foreground">قارئ متميز</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image - Left on desktop, Bottom on mobile */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-3xl blur-3xl opacity-50" />

              {/* Image Container */}
              <div className="relative">
                <motion.div
                  className="relative rounded-3xl overflow-hidden border-4 border-primary/20 shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={reciterImage}
                    alt="الشيخ حسن عدلي"
                    className="w-full h-auto object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Name Badge */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <motion.div
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      <h3 className="text-white text-xl lg:text-2xl font-bold text-center">
                        الشيخ حسن عدلي
                      </h3>
                      <p className="text-white/90 text-sm lg:text-base text-center mt-1">
                        قارئ القرآن الكريم
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Floating Audio Preview */}
                <motion.div
                  className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-card rounded-2xl p-3 lg:p-4 shadow-xl border border-border"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Play className="w-5 h-5 lg:w-6 lg:h-6 text-primary" fill="currentColor" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-medium">جودة عالية</p>
                      <p className="text-xs text-muted-foreground">بث مباشر</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
