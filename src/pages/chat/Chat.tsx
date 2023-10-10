import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ChatWrap, LeftWrap, RightWrap } from "./StChat";
import {
  createRoom,
  getInteractedUsers,
  getRoom,
  getUsers,
  postMessage,
  removeUserFromRoom,
} from "../../api/chat";
import { imgGet } from "../../api/mypage";
import { HiOutlinePencilAlt } from "react-icons/hi";

interface User {
  id: number;
  name: string;
  profile_image: string | null;
  roomId: number;
  lastMessage?: string;
}

interface Message {
  id: number;
  content: string;
  user: User;
}

function Chat() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [interactedUsers, setInteractedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedUsers, interacted] = await Promise.all([
          getUsers(),
          getInteractedUsers(),
        ]);

        const usersWithImages = await Promise.all(
          fetchedUsers.map(async (user: any) => {
            try {
              const response = await imgGet(user.id);
              let imageUrl = response.data.imageUrl;
              if (imageUrl) {
                imageUrl =
                  "https://yeong-port.s3.ap-northeast-2.amazonaws.com/" +
                  imageUrl
                    .split(
                      "https://yeong-port.s3.ap-northeast-2.amazonaws.com/"
                    )
                    .join("");
              }
              return { ...user, profile_image: imageUrl };
            } catch (error) {
              console.error(error);
              return user;
            }
          })
        );

        setAllUsers(usersWithImages || []);
        setInteractedUsers(interacted || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (interactedUsers.length > 0) {
        const initialUser = interactedUsers[0];
        setSelectedUser(initialUser);
        const roomMessages = await getRoom(initialUser.roomId);
        setMessages(roomMessages.chats || []);
      }
    };
    loadInitialMessages();
  }, [interactedUsers]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const interacted = await getInteractedUsers();
        setInteractedUsers(interacted || []);

        if (interacted && interacted[0]) {
          const roomMessages = await getRoom(interacted[0].roomId);
          setMessages(roomMessages.chats || []);
          setSelectedUser(interacted[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitialData();
  }, []);

  const handleNewChat = async (userId: number) => {
    try {
      const roomName = `Room_${Date.now()}`;
      const room = await createRoom([userId], roomName);
      const newUser = allUsers.find((u) => u.id === userId);

      if (newUser && room) {
        const updatedUser = { ...newUser, roomId: room.id };
        setInteractedUsers((prev) => [updatedUser, ...prev]);
        setSelectedUser(updatedUser);
      }

      setModalIsOpen(false);
    } catch (error) {
      console.error("Error in handleNewChat", error);
    }
  };

  const handleSendMessage = async () => {
    if (selectedUser && inputValue.trim()) {
      try {
        const roomId = selectedUser.roomId;
        const userId = Number(selectedUser.id);
        const newMessageResponse = await postMessage(
          roomId,
          userId,
          inputValue
        );

        // 기존 메시지 목록에 새 메시지 추가
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: newMessageResponse.id,
            content: newMessageResponse.message,
            user: selectedUser,
          },
        ]);

        const updatedUser = {
          ...selectedUser,
          lastMessage: inputValue,
        };
        setInteractedUsers((prev) => [
          updatedUser,
          ...prev.filter((user) => user.id !== selectedUser.id),
        ]);
        setInputValue("");
      } catch (error) {
        console.error("Error in handleSendMessage", error);
      }
    }
  };

  const handleLeaveChatRoom = async (userId: number) => {
    try {
      if (selectedUser?.roomId) {
        await removeUserFromRoom(selectedUser.roomId, userId);
        setInteractedUsers((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error leaving chat room", error);
    }
  };

  return (
    <ChatWrap>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <LeftWrap>
            <button onClick={() => setModalIsOpen(true)} className='addBtn'>
              <HiOutlinePencilAlt size='33' color='#51439d' />
            </button>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              contentLabel='User List Modal'
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                content: {
                  width: "40%",
                  height: "800px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#f6f6f6",
                  border: "none",
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                },
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h5
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "60px",
                  }}
                >
                  PORT 사용자들
                </h5>
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      width: "100%",
                      height: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      borderBottom: "1.5px solid #e8e8e8",
                      padding: "15px",
                    }}
                  >
                    <img
                      src={user.profile_image || "/path-to-your-default-image"}
                      alt={`${user.name}'s profile`}
                      style={{
                        width: "80px",
                        marginRight: "30px",
                      }}
                    />
                    {user.name}
                    <button
                      onClick={() => handleNewChat(user.id)}
                      style={{
                        marginLeft: "100px",
                        width: "150px",
                        height: "50px",
                        borderRadius: "10px",
                        background: "#51439d",
                        color: "white",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                      }}
                    >
                      채팅하기
                    </button>
                  </div>
                ))}
              </div>
            </Modal>
            {interactedUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className='list'
              >
                <img
                  src={user.profile_image || "/path-to-your-default-image"}
                  alt={`${user.name}'s profile`}
                  style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                />
                <div className='flex'>
                  <p>{user.name}</p>
                  <p>{user.lastMessage}</p>
                </div>
                <button onClick={() => handleLeaveChatRoom(user.id)}>
                  채팅 나가기
                </button>
              </div>
            ))}
          </LeftWrap>
          <RightWrap>
            {selectedUser ? (
              <>
                <h3>{selectedUser.name}</h3>

                <div>
                  <input
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='메시지를 입력하세요.'
                  />
                  <button
                    onClick={() => {
                      handleSendMessage();
                    }}
                  >
                    전송
                  </button>
                </div>
                {messages.map((message) =>
                  message.user ? (
                    <div
                      key={message.id}
                      style={{
                        display: "flex",
                        flexDirection:
                          message.user.id === selectedUser?.id
                            ? "row-reverse"
                            : "row",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={
                          message.user.profile_image ||
                          "/path-to-your-default-image"
                        }
                        alt={`${message.user.name}'s profile`}
                        style={{
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                          marginRight:
                            message.user.id === selectedUser?.id ? "0" : "10px",
                          marginLeft:
                            message.user.id === selectedUser?.id ? "10px" : "0",
                        }}
                      />
                      <div
                        style={{
                          background:
                            message.user.id === selectedUser?.id
                              ? "#ACE1AF"
                              : "#E0FFFF",
                          padding: "10px",
                          borderRadius: "10px",
                          maxWidth: "70%",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {message.user.id !== selectedUser?.id
                            ? message.user.name
                            : ""}
                        </span>

                        <p style={{ margin: "5px 0 0 0" }}>{message.content}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </>
            ) : (
              "채팅할 사용자를 선택해주세요!"
            )}
          </RightWrap>
        </>
      )}
    </ChatWrap>
  );
}
export default Chat;
