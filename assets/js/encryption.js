const encryptionMap = {
    'A': '𐊀', 'B': '𐊁', 'C': '𐊂', 'D': '𐊃', 'E': '𐊄',
    'F': '𐊅', 'G': '𐊆', 'H': '𐊇', 'I': '𐊈', 'J': '𐊉',
    'K': '𐊊', 'L': '𐊋', 'M': '𐊌', 'N': '𐊍', 'O': '𐊎',
    'P': '𐊏', 'Q': '𐊐', 'R': '𐊑', 'S': '𐊒', 'T': '𐊓',
    'U': '𐊔', 'V': '𐊕', 'W': '𐊖', 'X': '𐊗', 'Y': '𐊘',
    'Z': '𐊙', '0': '⊙', '1': '─', '2': '╲', '3': '╱',
    '4': '∠', '5': '╳', '6': '◊', '7': '═', '8': '●',
    '9': '↗'
};

const decryptionMap = Object.fromEntries(
    Object.entries(encryptionMap).map(([key, value]) => [value, key])
);

// Encrypt message
document.getElementById('encryptButton').addEventListener('click', () => {
    const inputMessage = document.getElementById('messageInput').value.toUpperCase();
    let encryptedMessage = '';

    for (let char of inputMessage) {
        encryptedMessage += encryptionMap[char] || char;
    }

    document.getElementById('encryptedOutput').textContent = encryptedMessage;
});