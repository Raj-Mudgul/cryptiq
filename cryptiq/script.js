// ===== SECTION SWITCHING =====
function showSection(id) {
    document.querySelectorAll("main section").forEach(sec => {
        sec.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
}
// ================= HASH =================
async function generateHash() {
    const msg = document.getElementById("hashInput").value;
    const buffer = new TextEncoder().encode(msg);
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    document.getElementById("hashOutput").value = hashHex;
}

// ================= DIFFIE HELLMAN =================
function powerMod(base, exp, mod) {
    let result = 1;
    for (let i = 0; i < exp; i++)
        result = (result * base) % mod;
    return result;
}

function calculateDH() {
    let p = parseInt(prime.value);
    let g = parseInt(generator.value);
    let a = parseInt(privateA.value);
    let b = parseInt(privateB.value);

    let A = powerMod(g, a, p);
    let B = powerMod(g, b, p);

    let sharedA = powerMod(B, a, p);

    dhOutput.value =
        "Public A: " + A +
        "\nPublic B: " + B +
        "\nShared Key: " + sharedA;

    document.getElementById("sharedKey").value = sharedA;
}

function encrypt() {
    let text = plainText.value;
    let key = parseInt(sharedKey.value);
    let result = "";

    for (let i = 0; i < text.length; i++)
        result += String.fromCharCode(text.charCodeAt(i) + key);

    cipherOutput.value = result;
}

function decrypt() {
    let text = cipherOutput.value;
    let key = parseInt(sharedKey.value);
    let result = "";

    for (let i = 0; i < text.length; i++)
        result += String.fromCharCode(text.charCodeAt(i) - key);

    cipherOutput.value = result;
}

// ================= STEGANOGRAPHY =================
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

imageInput.addEventListener("change", function () {
    let reader = new FileReader();
    reader.onload = function (event) {
        let img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(this.files[0]);
});

function encodeMessage() {
    let message = secretMessage.value + "###";
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    let binary = "";
    for (let i = 0; i < message.length; i++)
        binary += message.charCodeAt(i).toString(2).padStart(8, '0');

    for (let i = 0; i < binary.length; i++)
        data[i] = (data[i] & 254) | parseInt(binary[i]);

    ctx.putImageData(imgData, 0, 0);
    alert("Message Encoded!");
}

function decodeMessage() {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;
    let binary = "";

    for (let i = 0; i < data.length; i++)
        binary += (data[i] & 1);

    let message = "";
    for (let i = 0; i < binary.length; i += 8) {
        let byte = binary.substr(i, 8);
        let char = String.fromCharCode(parseInt(byte, 2));
        message += char;
        if (message.includes("###")) break;
    }

    decodedMessage.value = message.replace("###", "");
}

function downloadImage() {
    let link = document.createElement('a');
    link.download = "encoded.png";
    link.href = canvas.toDataURL();
    link.click();
}

// ================= DIGITAL SIGNATURE =================
let privateKey, publicKey;

async function generateKeys() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["sign", "verify"]
    );
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
    alert("Keys Generated");
}

async function signData() {
    const msg = new TextEncoder().encode(signText.value);
    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        privateKey,
        msg
    );
    signatureOutput.value =
        btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifyData() {
    const msg = new TextEncoder().encode(signText.value);
    const signature = Uint8Array.from(
        atob(signatureOutput.value),
        c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        publicKey,
        signature,
        msg
    );
// ===== PAGE NAVIGATION =====
function openPage(id) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
}

function goHome() {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });
    document.getElementById("home").classList.add("active");
}
    alert("Signature Valid: " + valid);
}
// ================= GOOGLE LOGIN =================

function googleLogin(){

var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider)
.then(function(result){

var user = result.user;

document.getElementById("userInfo").innerHTML = `
  <span>Welcome ${user.displayName}</span>`;

})
.catch(function(error){
console.log(error.message);
alert(error.message);
});

}