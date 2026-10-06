import type { Language } from './types';

const en = {
  widgetTitle: 'Accessibility assistance',
  closeWidget: 'Close assistance widget',
  expandWidget: 'Enlarge window',
  restoreWidget: 'Reduce window',
  changeLanguage: 'Change language',
  back: 'Back',

  welcomeTitle: 'Do you need assistance?',
  welcomeDescription: 'We can help you connect with a support agent and a translator.',
  welcomeButton: 'Request assistance',
  noSignIn: 'No sign-in required',

  requestTitle: 'How the assistance works',
  requestDescription: 'One request connects you with both of these people in the same video call:',
  agent: 'Support agent',
  agentDescription: 'Helps you with your request.',
  translator: 'Translator',
  translatorDescription: 'Helps you communicate with the support agent.',
  requestNote: 'Both join together. You do not need to choose.',
  communicationMethod: 'Communication method',
  videoCall: 'Video call',
  startCall: 'Start video call',

  waitingTitle: 'Preparing your assistance',
  waitingDescription: 'Please wait while we prepare a support agent and a translator to assist you.',
  cancelRequest: 'Cancel request',

  unavailableTitle: 'Assistance is not available right now',
  unavailableDescription:
    'We could not find an available support agent and translator for you at the moment. Please try again in a few minutes.',
  unavailableNote: 'No call was started.',
  tryAgain: 'Try again',

  callTitle: 'Assistance call',
  callConnected: 'Connected',
  callParticipants: '3 participants',
  callSharedNote: 'One shared call with you, the support agent and the translator.',
  you: 'You',
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
  changeLanguage: 'تغيير اللغة',
  back: 'رجوع',

  welcomeTitle: 'هل تحتاج إلى مساعدة؟',
  welcomeDescription: 'يمكننا مساعدتك في التواصل مع موظف الدعم ومترجم.',
  welcomeButton: 'طلب المساعدة',
  noSignIn: 'لا يلزم تسجيل الدخول',

  requestTitle: 'كيف تعمل المساعدة',
  requestDescription: 'طلب واحد يوصلك بالشخصين التاليين في مكالمة فيديو واحدة:',
  agent: 'موظف الدعم',
  agentDescription: 'يساعدك في طلبك.',
  translator: 'المترجم',
  translatorDescription: 'يساعدك على التواصل مع موظف الدعم.',
  requestNote: 'ينضم كلاهما معاً، ولا حاجة للاختيار.',
  communicationMethod: 'طريقة التواصل',
  videoCall: 'مكالمة فيديو',
  startCall: 'بدء مكالمة الفيديو',

  waitingTitle: 'جاري تجهيز المساعدة',
  waitingDescription: 'يرجى الانتظار بينما نجهز موظف الدعم والمترجم لمساعدتك.',
  cancelRequest: 'إلغاء الطلب',

  unavailableTitle: 'المساعدة غير متاحة حالياً',
  unavailableDescription:
    'لم نتمكن من إيجاد موظف دعم ومترجم متاحين لك في الوقت الحالي. يرجى المحاولة مرة أخرى بعد بضع دقائق.',
  unavailableNote: 'لم تبدأ أي مكالمة.',
  tryAgain: 'حاول مرة أخرى',

  callTitle: 'مكالمة المساعدة',
  callConnected: 'متصل',
  callParticipants: '3 مشاركين',
  callSharedNote: 'مكالمة واحدة تجمعك مع موظف الدعم والمترجم.',
  you: 'أنت',
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
