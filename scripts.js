/**
 * Targets for various parts of the page
 */

const search = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const card = document.getElementsByClassName('card');
const body = document.querySelector('body');
const modal = document.querySelector('.modal-container');

/**
 * Retrieves data from the api and dsiplays it on the page
 * @param {*} url the url for the api
 */

function getUsers(url) {
    return fetch(url)
        .then(res => {
            if (res.ok == true) {
                return Promise.resolve(res);
            } else {
                return Promise.reject(new Error(res.statusText));
            }
        })
        .then(res => res.json())
        .then(data => {
            const users = data.results;
            displayCard(users);
            addModal();
            addListeners(users);
        })
        .catch(error => console.log('Oops, there was a problem', error))
}

getUsers('https://randomuser.me/api/?results=12&nat=us')

/**
 * Generates the html for the card displays
 * @param {*} info recieves the data from the fetch 
 */

function displayCard(info) {
    for (let user of info) {
    gallery.insertAdjacentHTML('beforeend', `<div class="card">
                <div class="card-img-container">
                    <img class="card-img" src=${user.picture.large} alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
            </div>`
        )
    }
}

/**
 * Adds the modal to the page and adds a listener to the close btn to hide the modal
 */

function addModal(){
    body.insertAdjacentHTML('beforeend', `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                    </div>
                </div>
            </div>
            `)
    const modal = document.querySelector('.modal-container').style.display = 'none';
    const close = document.getElementById('modal-close-btn');
    close.addEventListener('click', (e) => {
        const modal = document.querySelector('.modal-container');
        modal.style.display = 'none';
    })
}

/**
 * Adds the user data to the modal
 * Reformats the DoB to MM/DD/YYYY
 * @param {*} user accepts the user information for the clicked card
 */

function popModal(user) {
    const innerModal = document.querySelector('.modal-info-container');
    innerModal.innerHTML = "";
    const dob = user.dob.date.slice(0, 10).split('-');
    const content = `
    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
    <p class="modal-text">${user.email}</p>
    <p class="modal-text cap">${user.location.city}</p>
    <hr>
    <p class="modal-text">${user.phone}</p>
    <p class="modal-text">${user.location.street.number} ${user.location.street.name}, 
    ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
    <p class="modal-text">Birthday: ${dob[1]}/${dob[2]}/${dob[0]}</p>
    `;
    innerModal.insertAdjacentHTML('afterbegin', content);
}

/**
 * Adds click listeners to the cards which display the modal
 * @param {*} array Response data from the fetch call
 */

function addListeners(array) {
    for(let i = 0; i < card.length; i++) {
        card[i].addEventListener('click', (e) => {
            const modal = document.querySelector('.modal-container');
            modal.style.display = 'block';
            popModal(array[i]);
        })
    }
}