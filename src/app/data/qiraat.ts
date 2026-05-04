// Ten Qira'at (Recitation styles)
export interface Qiraa {
  id: number;
  nameArabic: string;
  rawi: string;
}

export const qiraat: Qiraa[] = [
  { id: 1, nameArabic: 'حفص عن عاصم', rawi: 'حفص' },
  { id: 2, nameArabic: 'ورش عن نافع', rawi: 'ورش' },
  { id: 3, nameArabic: 'قالون عن نافع', rawi: 'قالون' },
  { id: 4, nameArabic: 'الدوري عن أبي عمرو', rawi: 'الدوري' },
  { id: 5, nameArabic: 'السوسي عن أبي عمرو', rawi: 'السوسي' },
  { id: 6, nameArabic: 'شعبة عن عاصم', rawi: 'شعبة' },
  { id: 7, nameArabic: 'خلف عن حمزة', rawi: 'خلف' },
  { id: 8, nameArabic: 'خلاد عن حمزة', rawi: 'خلاد' },
  { id: 9, nameArabic: 'هشام عن ابن عامر', rawi: 'هشام' },
  { id: 10, nameArabic: 'ابن ذكوان عن ابن عامر', rawi: 'ابن ذكوان' },
];
