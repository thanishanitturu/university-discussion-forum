import { useEffect } from "react";

const Chatbot = ({ isLoggedIn }) => {
  useEffect(() => {
    if (isLoggedIn) {
      const script = document.createElement("script");
      script.src = "https://chatling.ai/js/embed.js";
      script.async = true;
      script.setAttribute("data-id", "7486417844");
      script.id = "chatling-embed-script";

      document.body.appendChild(script);

      return () => {
        document.getElementById("chatling-embed-script")?.remove();
      };
    }
  }, [isLoggedIn]);

  return null;
};

export default Chatbot;
