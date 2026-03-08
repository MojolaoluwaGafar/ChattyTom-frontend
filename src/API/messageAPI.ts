import api from "./client";

export const getMessages = async (conversationId: string) => {
  const response = await api.get(`/message/${conversationId}`);
  return response.data;
};

export const sendMessage = async (
  conversationId: string,
  content: string
) => {
  const response = await api.post("/message", {
    conversationId,
    content,
  });

  return response.data;
};

export const markAsRead = async (conversationId: string) => {
  const response = await api.put(
    `/message/read/${conversationId}`
  );

  return response.data;
};