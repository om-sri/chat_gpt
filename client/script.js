import bot from "/bot.svg";
import user from "/user.svg";

const form= document.querySelector('form');
const chatcontainer = document.querySelector('.chat-container');

let loadInterval;

function loader(element) {
    element.textContent = ' ';
    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = ' ';
        }
    },300);
}

function typetext(element,text){
    let i = 0;
    let interval = setInterval(() => {
        if(i < text.length){
            element.innerHTML += text.charAt(i);
            i++;
        } else{
            clearInterval(interval);
        }
    }, 20);

}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomnumber = Math.random();
    const hexadecimalstring = randomnumber.toString(16);

    return 'id-${timestamp}-${hexadecimalstring}';

}

function chatstripe (isAi, value, uniqueId) {
    return( `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img
                      src=${isAi ? bot : user}
                      alt="${isAi ? 'bot' : 'user'}"
                    />
                 </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}
  

const handlesubmit = async (e) => {
    e.preventDefault();
    
    
    const data = new FormData(form);
    
    chatcontainer.innerHTML += chatstripe(false, data.get('prompt'));
    
    
    form.reset();

    const uniqueId = generateUniqueId();
    
    
    chatcontainer.innerHTML += chatstripe(true," ", uniqueId);
    
    
    chatcontainer.scrollTop = chatcontainer.scrollHeight;
    
    
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);
    
    const response = await fetch('http://localhost:5000',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    }) 

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();

        console.log({parsedData});

        typetext(messageDiv, parsedData);
    }else{
        const err = await response.text();

        messageDiv.innerHTML = "something went wrong";

        alert(err);
    }

}


form.addEventListener('submit', handlesubmit);

form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13){
        handlesubmit(e);
    }
})



