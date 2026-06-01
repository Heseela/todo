import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  // For development, log emails instead of sending
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email would be sent:', {
      to,
      subject,
      html: html.substring(0, 200) + '...',
    });
    return { success: true, message: 'Email logged (development mode)' };
  }

  // Production email configuration
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"WorkReport Dashboard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html,
    });
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
}

export function generateReportReminderEmail(employeeName: string, date: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0088D0 0%, #006699 100%); padding: 30px 20px; text-align: center;">
        <h2 style="color: white; margin: 0; font-size: 24px;">Daily Work Report Reminder</h2>
      </div>
      
      <div style="padding: 30px 25px; background: white; border: 1px solid #e0e0e0; border-top: none;">
        <h3 style="color: #981E52; margin-top: 0;">Hello ${employeeName},</h3>
        
        <p style="color: #444; line-height: 1.6;">This is a friendly reminder to submit your daily work report for <strong>${date}</strong>.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #0088D0; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #666;">Please include the following in your report:</p>
          <ul style="color: #666; margin: 0;">
            <li>Tasks completed today</li>
            <li>Hours worked</li>
            <li>Key accomplishments</li>
            <li>Challenges faced</li>
            <li>Plan for tomorrow</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard/employee" 
             style="display: inline-block; padding: 12px 30px; background-color: #0088D0; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Submit Your Report
          </a>
        </div>
        
        <p style="color: #888; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
          Thank you for your contribution to the team's success!
        </p>
      </div>
      
      <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">WorkReport Dashboard - Team Productivity Tool</p>
      </div>
    </div>
  `;
}