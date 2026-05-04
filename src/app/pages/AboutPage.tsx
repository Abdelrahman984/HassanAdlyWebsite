import { ChevronRight, Play, BookOpen, GraduationCap, Award, Users, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import reciterImage from '../../imports/hassan-adly.jpg';
import { usePlayer } from '../context/PlayerContext';
import { apiService } from '../services/api';

export const AboutPage = () => {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const handleStartListening = async () => {
    const track = await apiService.getAudioTrack(1, 1);
    playTrack(track);
    navigate('/player');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-8 lg:mr-64">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 lg:p-8 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-foreground hover:text-primary transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
          <h1 className="text-lg lg:text-xl font-medium flex-1 text-center">نبذة عن الشيخ</h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="space-y-8 lg:space-y-12">
          {/* Header Section */}
          <motion.div
            className="text-center space-y-6"
            {...fadeInUp}
          >
            <h2 className="text-3xl lg:text-4xl font-bold">نبذة عن الشيخ حسن عدلي</h2>

            <div className="relative w-full max-w-sm mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-3xl blur-3xl opacity-50" />
              <div className="relative rounded-2xl overflow-hidden border-4 border-primary/20 shadow-2xl">
                <img
                  src={reciterImage}
                  alt="الشيخ حسن عدلي"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              قارئ متقن للقراءات العشر، وإمام ومُعلّم للقرآن الكريم
            </p>
          </motion.div>

          {/* Basic Information Card */}
          <motion.div
            className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">المعلومات الأساسية</h3>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">الاسم الكامل</p>
                  <p className="font-medium text-lg">حسن بن عدلي بن محمد كامل بن مشيط</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">تاريخ الميلاد</p>
                  <p className="font-medium text-lg">12 مارس 1981</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">مكان الميلاد</p>
                  <p className="font-medium text-lg">محافظة الجيزة – مصر</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education Section */}
          <motion.div
            className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">التعليم</h3>
            </div>

            <div className="space-y-6">
              <div className="relative pr-6 border-r-2 border-primary/20">
                <div className="absolute -right-2 top-2 w-4 h-4 rounded-full bg-primary" />
                <div className="space-y-2">
                  <h4 className="font-bold text-lg">بكالوريوس علوم – جامعة القاهرة</h4>
                  <p className="text-muted-foreground">تخصص كيمياء / بيولوجي (شعبة حشرات)</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">2006</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">بتقدير جيد</span>
                  </div>
                </div>
              </div>

              <div className="relative pr-6 border-r-2 border-primary/20">
                <div className="absolute -right-2 top-2 w-4 h-4 rounded-full bg-primary" />
                <div className="space-y-2">
                  <h4 className="font-bold text-lg">شهادة التخصص في القراءات العشر</h4>
                  <p className="text-muted-foreground">من معهد قراءات خاتم المرسلين – العمرانية</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">2012</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">79%</span>
                  </div>
                </div>
              </div>

              <div className="relative pr-6 border-r-2 border-primary/20">
                <div className="absolute -right-2 top-2 w-4 h-4 rounded-full bg-primary" />
                <div className="space-y-2">
                  <h4 className="font-bold text-lg">كلية القرآن الكريم وعلومها</h4>
                  <p className="text-muted-foreground">جامعة الأزهر (طنطا) – طالب</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">الخبرات</h3>
            </div>

            <div className="grid gap-3">
              {[
                'إجازة برواية حفص عن عاصم',
                'إجازة بالقراءات العشر الصغرى',
                'محفظ قرآن بدار الزهراء (2003 – 2009)',
                'إمام تراويح منذ 1997',
                'قارئ بقناة الفجر القضائية',
                'إمام بجامع عمرو بن العاص منذ 2008',
                'مدرس بمعهد الهدى الأزهري (أكتوبر)',
                'مدرس بمركز الأرقم – بريطانيا (2011)',
                'إمام مسجد الخلفاء الراشدين – أكتوبر'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scholars Section */}
          <motion.div
            className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">المشايخ الذين قرأ عليهم</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {[
                { name: 'الشيخ محمود فرغل', detail: 'من الناس إلى نوح' },
                { name: 'الشيخ حسام خضر', detail: 'ختمتين كاملتين' },
                { name: 'الشيخ طارق عبد الحكيم', detail: 'ختم كامل بالمسجد النبوي' },
                { name: 'الشيخ يحيى خالد', detail: 'ختم كامل' },
                { name: 'الشيخ أحمد التلباني', detail: 'الفاتحة إلى التوبة' },
                { name: 'الشيخ مصطفى العدوي', detail: 'القراءات العشر كاملة' },
                { name: 'الشيخ رشوان زايد', detail: 'من طريق الطيبة' }
              ].map((scholar, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                  <h4 className="font-bold text-lg mb-1">{scholar.name}</h4>
                  <p className="text-sm text-muted-foreground">{scholar.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-8 lg:p-12 text-center border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">ابدأ رحلتك مع القرآن الكريم</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              استمع إلى تلاوة الشيخ حسن عدلي بجودة عالية واستمتع بتجربة روحانية فريدة
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartListening}
                className="group px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-lg transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                استمع الآن
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium text-lg transition-all hover:scale-105 border border-border flex items-center justify-center gap-3"
              >
                <BookOpen className="w-5 h-5" />
                تصفح السور
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
