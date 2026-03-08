import api from "./client";

export const createOneToOneConversation = async (otherUserId : number) => {
    const response = await api.post("/conversation/one-to-one",
        {otherUserId})
    return response.data
}

export const createGroup = async ( name : string, members : number[]) => {
    const response = await api.post("/conversation/group",
         { name, members })
    return response.data
}

// get logged in user conversations
export const getMyConversations =  async () => {
    const response = await api.get("/conversation/")
    return response.data
}

// single conversation
export const getConversationById = async (conversationId: string ) => {
  const response = await api.get(`/conversation/${conversationId}`);
  return response.data;
  
};