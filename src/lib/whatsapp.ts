/**
 * Utility to send test results to the teacher via WhatsApp.
 */

interface QuizResultData {
  name: string;
  surname: string;
  level: string;
  section: string;
  orderNumber: string;
  subject: string;
  result: string;
}

export const sendResultToTeacher = (data: QuizResultData) => {
  const message = `السلام عليكم أستاذي الكريم،

📊 تم تسجيل نتيجة اختبار جديدة، التفاصيل كما يلي:

👤 الاسم: ${data.name} ${data.surname}  
🎓 المستوى: ${data.level}  
🏫 القسم: ${data.section}  
🔢 الرقم الترتيبي: ${data.orderNumber}  
📝 موضوع الاختبار: ${data.subject}  
✔️ النتيجة: ${data.result}  

يرجى الاطلاع، وشكرًا لجهودكم.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/message/N2EPRSE4OZQGC1?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};
