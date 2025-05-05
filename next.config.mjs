/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      //  NEXT_APIURL: "http://localhost:8080/api/v1",
      NEXT_APIURL: "http://localhost:8080/api/v1",
      AUTH_API: "http://localhost:8080/auth"
    },
  };
  
  export default nextConfig;
