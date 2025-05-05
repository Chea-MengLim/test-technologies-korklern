
export const loginService = async (user) => {
  console.log("user in svc : ",user)
  try {
    const res = await fetch(`${process.env.AUTH_API}/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data)
    return data;
  } catch (e) {
    console.log("Error : ", e);
  }
};