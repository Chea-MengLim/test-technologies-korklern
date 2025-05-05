import { loginService } from "@/service/authService";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

async function continueWithGoogle(profile, token) {
  console.log("token", token);

  try {
    const res = await fetch(
      "http://localhost:8080/auth/continue-with-google",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: profile.name,
          email: profile.email,
          profilePicture: profile.picture,
          token: token
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data.payload.token; // assuming your backend returns { token: "..." }
  } catch (err) {
    console.error("Backend login failed:", err.message);
    throw new Error("Login error");
  }
}


export const authOption = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      
      async authorize(data) {
        const userData = {
          email: data?.email,
          password: data?.password,
        };


        const userInfo = await loginService(userData)
         if (userInfo?.status === 400) {
          throw new Error(userInfo?.detail);
        }
        return userInfo;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
  ],
  
  // Optional: Usage When Deployment   
  secret: process.env.NEXTAUTH_SECRET,
  
  // Optional
  session: {
    strategy: "jwt", // Adjust this based on your session strategy
  },
  
  // Custom Login page
     // pages: {
    //   signIn: "/login",
    // },
    callbacks: {
      async jwt({ token, account, profile }) {
        console.log("account", account);
        console.log("profile", profile);
        if (account && profile) {
          // await syncUserWithBackend(profile);

          token.idToken = account.id_token;
          const backendJwt = await continueWithGoogle(profile, account.id_token);
          token.appJwt = backendJwt;

        }
        return token;
      },
      async session({ session, token }) {
        session.token = token;
        console.log("session", session);
        return session;
      },
    },
};
const handler = NextAuth(authOption);

export { handler as GET, handler as POST };