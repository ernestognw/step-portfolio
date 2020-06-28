import { api } from "./client.js";

const addQuote = async () => {
  const quote = await api.get("/data");

  document.getElementById("quote-content").innerHTML = quote;
};

export { addQuote };
