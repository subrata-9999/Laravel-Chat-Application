import './bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { EmojiButton } from '@joeattardi/emoji-button';


import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

// document.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
// });
// document.addEventListener('keydown', function (e) {
//     if (e.key === 'F12' || (e.ctrlKey && (e.shiftKey && e.key === 'I'))) {
//         e.preventDefault();
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const picker = new EmojiButton({
        autoHide: false,
    });
    const trigger = document.querySelector('.trigger');
    const input = document.querySelector('#chat_message_input');

    // Event listener for emoji selection
    picker.on('emoji', selection => {
        input.value += selection.emoji;
    });

    // Event listener for button click to toggle picker visibility
    trigger.addEventListener('click', () => picker.togglePicker(trigger));
});



