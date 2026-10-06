import type { Language } from './types';

const en = {
  widgetTitle: 'Accessibility assistance',
  closeWidget: 'Close assistance widget',
  expandWidget: 'Enlarge window',
  restoreWidget: 'Reduce window',
  languageGroup: 'Language',
  back: 'Back',

  welcomeTitle: 'Do you need assistance?',
  welcomeDescription: 'We can help you connect with a sign language translator. Sign in to continue.',
  usernameLabel: 'Username',
  passwordLabel: 'Password',
  signInButton: 'Sign in',
  signInError: 'Please enter a username and a password.',

  requestTitle: 'How the assistance works',
  requestDescription: 'Your request connects you and your client with a sign language translator in a video call.',
  requestCameraNote: "Your device's front camera will show your client. You will see the translator.",
  translator: 'Translator',
  communicationMethod: 'Communication method',
  videoCall: 'Video call',
  startCall: 'Start video call',

  waitingTitle: 'Preparing your assistance',
  waitingDescription: 'Please wait while we prepare a translator to assist you.',
  cancelRequest: 'Cancel request',

  callTitle: 'Assistance call',
  callConnected: 'Connected',
  callParticipants: '3 participants',
  callSharedNote: 'One shared call with you, your client and the sign language translator.',
  client: 'Your client',
  micOff: 'Microphone off',
  cameraOff: 'Camera off',
  callControls: 'Call controls',
  mute: 'Mute',
  stopVideo: 'Stop video',
  endCall: 'End call',

  endedTitle: 'Call ended',
  endedDescription: 'Thank you for using the assistance service.',
  rateCall: 'How would you rate this call?',
  starLabel: (stars: number) => `${stars} out of 5`,
  ratingThanks: (stars: number) => `You rated the call ${stars} out of 5. Thank you for your feedback!`,
  close: 'Close',
};

export type Translation = typeof en;

const ar: Translation = {
  widgetTitle: 'خدمة المساعدة',
  closeWidget: 'إغلاق نافذة المساعدة',
  expandWidget: 'تكبير النافذة',
  restoreWidget: 'تصغير النافذة',
  languageGroup: 'اللغة',
  back: 'رجوع',

  welcomeTitle: 'هل تحتاج إلى مساعدة؟',
  welcomeDescription: 'يمكننا مساعدتك في التواصل مع مترجم لغة الإشارة. سجّل الدخول للمتابعة.',
  usernameLabel: 'اسم المستخدم',
  passwordLabel: 'كلمة المرور',
  signInButton: 'تسجيل الدخول',
  signInError: 'يرجى إدخال اسم المستخدم وكلمة المرور.',

  requestTitle: 'كيف تعمل المساعدة',
  requestDescription: 'طلبك يوصلك أنت وعميلك بمترجم لغة الإشارة في مكالمة فيديو.',
  requestCameraNote: 'ستعرض الكاميرا الأمامية لجهازك العميل، وستشاهد أنت المترجم.',
  translator: 'المترجم',
  communicationMethod: 'طريقة التواصل',
  videoCall: 'مكالمة فيديو',
  startCall: 'بدء مكالمة الفيديو',

  waitingTitle: 'جاري تجهيز المساعدة',
  waitingDescription: 'يرجى الانتظار بينما نجهز مترجماً لمساعدتك.',
  cancelRequest: 'إلغاء الطلب',

  callTitle: 'مكالمة المساعدة',
  callConnected: 'متصل',
  callParticipants: '3 مشاركين',
  callSharedNote: 'مكالمة واحدة تجمعك أنت وعميلك بمترجم لغة الإشارة.',
  client: 'عميلك',
  micOff: 'الميكروفون مغلق',
  cameraOff: 'الكاميرا مغلقة',
  callControls: 'أدوات التحكم في المكالمة',
  mute: 'كتم الصوت',
  stopVideo: 'إيقاف الفيديو',
  endCall: 'إنهاء المكالمة',

  endedTitle: 'انتهت المكالمة',
  endedDescription: 'شكراً لاستخدام خدمة المساعدة.',
  rateCall: 'كيف تقيّم هذه المكالمة؟',
  starLabel: (stars: number) => `${stars} من 5`,
  ratingThanks: (stars: number) => `قيّمت المكالمة ${stars} من 5. شكراً لملاحظاتك!`,
  close: 'إغلاق',
};

export const translations: Record<Language, Translation> = { ar, en };

export function getDirection(language: Language): 'rtl' | 'ltr' {
  return language === 'ar' ? 'rtl' : 'ltr';
}
