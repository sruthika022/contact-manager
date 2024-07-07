// script.js
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const contactList = document.getElementById('contacts');
    const searchInput = document.getElementById('search');

    contactForm.addEventListener('submit', addContact);
    contactList.addEventListener('click', modifyContact);
    searchInput.addEventListener('keyup', filterContacts);

    loadContacts();

    function addContact(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const emailError = document.getElementById('email-error');
        const phoneError = document.getElementById('phone-error');

        emailError.style.display = 'none';
        phoneError.style.display = 'none';

        if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
            return;
        }

        if (!validatePhone(phone)) {
            phoneError.textContent = 'Please enter a valid phone number (10 digits)';
            phoneError.style.display = 'block';
            return;
        }

        const contact = {
            id: generateId(),
            name,
            email,
            phone
        };

        saveContact(contact);
        displayContact(contact);
        contactForm.reset();
    }

    function modifyContact(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.parentElement.dataset.id;
            removeContact(id);
            e.target.parentElement.remove();
        }

        if (e.target.classList.contains('edit-btn')) {
            const li = e.target.parentElement;
            const id = li.dataset.id;
            const name = li.querySelector('.name').textContent;
            const email = li.querySelector('.email').textContent;
            const phone = li.querySelector('.phone').textContent;

            document.getElementById('name').value = name;
            document.getElementById('email').value = email;
            document.getElementById('phone').value = phone;

            removeContact(id);
            li.remove();
        }
    }

    function filterContacts(e) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll('li').forEach(contact => {
            const item = contact.textContent.toLowerCase();
            if (item.indexOf(text) != -1) {
                contact.style.display = 'flex';
            } else {
                contact.style.display = 'none';
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^\d{10}$/;
        return re.test(String(phone));
    }

    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function saveContact(contact) {
        let contacts = getContactsFromStorage();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    function removeContact(id) {
        let contacts = getContactsFromStorage();
        contacts = contacts.filter(contact => contact.id !== id);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    function loadContacts() {
        let contacts = getContactsFromStorage();
        contacts.forEach(contact => displayContact(contact));
    }

    function getContactsFromStorage() {
        return localStorage.getItem('contacts') ? JSON.parse(localStorage.getItem('contacts')) : [];
    }

    function displayContact(contact) {
        const li = document.createElement('li');
        li.dataset.id = contact.id;
        li.innerHTML = `
            <span class="name">${contact.name}</span> - 
            <span class="email">${contact.email}</span> - 
            <span class="phone">${contact.phone}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        contactList.appendChild(li);
    }
});
