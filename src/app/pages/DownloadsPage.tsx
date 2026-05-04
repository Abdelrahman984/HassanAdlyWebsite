import { Download } from 'lucide-react';

export const DownloadsPage = () => {
  return (
    <div className="min-h-screen pb-20 lg:pb-8 lg:mr-64">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 lg:p-8">
          <h1 className="text-xl lg:text-2xl font-bold">التنزيلات</h1>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-6xl mx-auto">
        <div className="text-center py-12 lg:py-20">
          <Download className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground lg:text-lg">لا توجد تنزيلات</p>
          <p className="text-sm text-muted-foreground mt-1">
            قم بتنزيل السور للاستماع إليها دون اتصال
          </p>
        </div>
      </main>
    </div>
  );
};
