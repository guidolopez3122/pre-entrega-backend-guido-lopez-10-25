import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

export const sendResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${token}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #333; margin: 0; }
        .content { line-height: 1.6; color: #555; }
        .button { display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .button:hover { background-color: #0056b3; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Recuperación de Contraseña</h1>
        </div>
        <div class="content">
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Restablecer Contraseña</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por razones de seguridad.
          </div>
          
          <p>Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual seguirá siendo válida.</p>
          
          <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; font-size: 12px; color: #666;">${resetLink}</p>
        </div>
        <div class="footer">
          <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          <p>&copy; ${new Date().getFullYear()} E-commerce Platform. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"E-commerce Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Recuperación de Contraseña - E-commerce',
      html: htmlContent
    });
    console.log(`✅ Email de recuperación enviado a: ${email}`);
  } catch (error) {
    console.error(`❌ Error al enviar email: ${error.message}`);
    throw new Error('Error al enviar email de recuperación');
  }
};
