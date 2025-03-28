import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// Your NextAuth configuration
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a temporary mock user for development
        // Replace with actual API call to your backend
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Demo User",
            email: "user@example.com",
            image: "https://i.pravatar.cc/150?img=1",
          };
        }
        
        // If no user is found, return null
        return null;
      }
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // You can add custom user data here
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        // Add any custom session data here
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "mynewjwtsecretkeytoken",
  debug: process.env.NODE_ENV === "development",
};

// Create the auth handlers
const handler = NextAuth(authOptions);

// Export the GET and POST handlers
export { handler as GET, handler as POST }; 