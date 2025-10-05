import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api/users";

async function main() {
  const userData = {
    name: "Edward Mendoza",
    email: "edward@example.com",
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  console.log("✅ Usuario creado:", data);
}

main().catch(console.error);
