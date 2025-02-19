document.addEventListener("DOMContentLoaded", function () {
  const contactsList = document.getElementById("contacts-List");
  const chatName = document.getElementById("chat-Name");
  const chatBio = document.getElementById("chat-Bio");
  const chatStatus = document.getElementById("chat-Status");
  const chatProfilePic = document.getElementById("chat-ProfilePic");
  const chatMessages = document.getElementById("chat-Messages");
  const messageInput = document.getElementById("message-Input");
  const sendBtn = document.getElementById("send-Btn");

  let contacts = [];
  let currentChat = null;

  // Fetch contacts from contacts.json
  fetch("contacts.json")
      .then(response => response.json())
      .then(data => {
          contacts = data;
          renderContacts();
          //show last opened chat otherwise show the first contact in the contact list
          const lastChatId = localStorage.getItem("lastChatId");
          const firstContact = contacts.find(c=> c.id === lastChatId ) || contacts[0]
          if(firstContact){
            openChat(firstContact)
          }
        });
//left panel contacts list
  function renderContacts() {
      contactsList.innerHTML = "";
      contacts.forEach(contact => {
          const contactEle = document.createElement("div");
          contactEle.classList.add("contact");
          contactEle.innerHTML = `
              <img src="${contact.profilePic}" alt="${contact.name}">
              <div class="user-details">
                  <p class="user-name">${contact.name}</p>
                  <p>${contact.lastMessage}</p>
              </div>
              <p class="time-texted">${contact.time}</p>
          `;

          //open the chat on right panel
          contactEle.addEventListener("click", () => openChat(contact));
          contactsList.appendChild(contactEle);
      });
  }
  //current clicked person contact and message on the right panel
  function openChat(contact) {
      currentChat = contact;
      chatName.textContent = contact.name;
      chatBio.textContent = contact.bio;
      chatProfilePic.src = contact.profilePic;
      //if person in online show "Online" otherwise show the lastseen time
      chatStatus.textContent = contact.status === "online" ? "Online" : "Last seen: " + contact.lastSeen;
      chatStatus.innerHTML = contact.status ==="online"? '<span class = "online-status"></span> Online' : "Last seen : " + contact.lastSeen
      chatMessages.innerHTML = "";

      //send and receive messages
      contact.messages.forEach((msg, ind) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        if (ind % 2 === 0) {
            messageElement.classList.add("received"); 
        } else {
            messageElement.classList.add("sent");
        }

        messageElement.innerHTML = `<p>${msg}</p>`;
        chatMessages.appendChild(messageElement);
    });

    //storing the last opened chat id
    localStorage.setItem("lastChatId", contact.id)
    //scrolling bottom
    chatMessages.scrollTop = chatMessages.scrollHeight; 

    if(window.innerWidth <= 576){
        document.querySelector(".chat-session").classList.add("hidden")
        document.querySelector(".chat-details").classList.add("active")
    }
  }

  //back button
  document.getElementById("backBtn").addEventListener("click",goBackContacts)
  function goBackContacts(){
    document.querySelector(".chat-session").classList.remove("hidden")
    document.querySelector(".chat-details").classList.remove("active")
  }
  //sending message
  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
  });

function sendMessage() {
    let messageInput = document.getElementById("message-Input"); 
    let messageText = messageInput.value.trim(); //to avoid extra whitespaces in the input

    if (messageText === "" || !currentChat) return; // avoiding empty messages

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "sent"); // my messages should be in the sender side
    messageElement.innerHTML = `<p>${messageText}</p>`;
    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    messageInput.value = "";
}
});
