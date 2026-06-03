// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import nodemailer from 'nodemailer';

// export async function POST(request: NextRequest) {
//   const session = await getServerSession(authOptions);
  
//   if (!session || session.user.role !== 'supervisor') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { to, subject, message } = await request.json();

//   // Configure email transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//     port: parseInt(process.env.EMAIL_PORT || '587'),
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: `"WorkReport Dashboard" <${process.env.EMAIL_USER}>`,
//       to: to,
//       subject: subject || 'Daily Work Report Reminder',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <div style="background-color: #0088D0; padding: 20px; text-align: center;">
//             <h2 style="color: white; margin: 0;">WorkReport Dashboard</h2>
//           </div>
//           <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
//             <h3 style="color: #981E52;">Hello ${session.user.name},</h3>
//             <p>${message || 'Please remember to submit your daily work report before the end of the day.'}</p>
//             <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #0088D0;">
//               <p style="margin: 0; color: #666;">Thank you for your hard work!</p>
//             </div>
//             <div style="margin-top: 20px; text-align: center;">
//               <a href="${process.env.NEXTAUTH_URL}/dashboard/employee" 
//                  style="display: inline-block; padding: 10px 20px; background-color: #0088D0; color: white; text-decoration: none; border-radius: 5px;">
//                 Submit Report Now
//               </a>
//             </div>
//           </div>
//           <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
//             <p>This is an automated reminder from WorkReport Dashboard.</p>
//           </div>
//         </div>
//       `,
//     });

//     return NextResponse.json({ success: true, message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('Email error:', error);
//     return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'supervisor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, employeeName } = await request.json();

    console.log('📧 Email would be sent to:', to);
    console.log('Employee:', employeeName);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email functionality will be available after configuring email service',
      preview: null
    });
    
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}