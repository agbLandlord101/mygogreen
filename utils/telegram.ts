export const sendTelegramMessage = async (message: string) => {
  // Get user IP from client
  const ipResponse = await fetch("https://api.ipify.org?format=json");
  const userIp = (await ipResponse.json()).ip;

  const response = await fetch("/api/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, userIp }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Failed to send message");
  return data;
};



