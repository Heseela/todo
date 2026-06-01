import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Demo users - in production, check against database
        const users = [
          { id: '1', email: 'cto@company.com', password: 'demo123', name: 'CTO User', role: 'cto' },
          { id: '2', email: 'john@company.com', password: 'demo123', name: 'John Doe', role: 'employee' },
          { id: '3', email: 'jane@company.com', password: 'demo123', name: 'Jane Smith', role: 'employee' },
        ];

        const user = users.find(u => u.email === credentials?.email);
        
        if (user && credentials?.password === user.password) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this',
};

export default NextAuth(authOptions);