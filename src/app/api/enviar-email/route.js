import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const {subject, toStudent, toTeacher, studentName, teacherName, date, hour } = await req.json();
console.log(date)
  // Configuración del transporte de correo usando Gmail, ignorando la verificación del certificado
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Ignorar la verificación del certificado SSL
    }
  });

  const [year, month, day] = date.split('-');
  const formattedDate = new Date(year, month - 1, day); // Meses en JS son 0-based

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDateStr = formattedDate.toLocaleDateString('es-ES', options);

  const emailTemplates = {
    toTeacher: {
      from: '"Instituto de Apoyo Escolar" <' + process.env.EMAIL_USER + '>',
      to: toTeacher,
      subject: `Nueva Reserva clase de ${subject}`,
      text: `Hola ${teacherName},\n\nTienes una nueva reserva con ${studentName} para el ${formattedDateStr} a las ${hour}:00 hs.`,
    },
    toStudent: {
      from: '"Instituto de Apoyo Escolar" <' + process.env.EMAIL_USER + '>',
      to: toStudent,
      subject: 'Reserva Confirmada',
      text: `Hola ${studentName},\n\nTu reserva con ${teacherName} ha sido confirmada para el ${formattedDateStr} a las ${hour}:00 hs.`,
    }
  };

  try {
    for (const key in emailTemplates) {
      await transporter.sendMail(emailTemplates[key]);
    }
    return NextResponse.json({ message: "Emails enviados con éxito" });
  } catch (error) {
    console.error('Error al enviar el email:', error);
    return NextResponse.json({ error: "Hubo un error al enviar el email" }, { status: 500 });
  }
}