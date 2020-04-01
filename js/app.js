(function() {

	// SELECTORS
	const playerCard  	   = document.querySelectorAll(".player-card");
	const cardContent 	   = document.querySelectorAll(".card-content");
	const settingTabs	   = document.querySelectorAll('.settings-tabs');
	const app 			   = document.querySelector('.app');
	const activePlayerCard = document.querySelector('.selected-card');
	const navigation	   = document.querySelector('.navigation-container');
	const navTrigger 	   = document.querySelector('.nav-trigger');
	const deckTrigger 	   = document.querySelector('.deck');
	const navOverlay 	   = document.querySelector('.nav-overlay');
	const shareBtn 		   = document.querySelector('.share');
	const rulesContainer   = document.querySelector('.rules-container');
	const settings 		   = document.querySelector('.settings-container');
	const rulesTrigger	   = document.querySelector('.rules');
	const closeTrigger	   = document.querySelector('.close-trigger');
	const closeSettings    = document.querySelector('.close-trigger-settings');
	const shareInput       = document.querySelector('.share-url');
	const settingsTrigger  = document.querySelector('.settings');
	const playerCardStnd   = document.querySelectorAll(".player-card")
	const pageTitle		   = window.document.title;
	const currentURL	   = window.document.location.href;
	const triggers 		   = [navTrigger, deckTrigger, closeTrigger, rulesTrigger, navOverlay, settingsTrigger, closeSettings];

	// SELECTS CURRENT CARD TO DISPLAY
	playerCard.forEach(function(e) {
	    e.addEventListener("click", function(e) {
	    	let currentNum = this.innerHTML;
	       	activePlayerCard.parentElement.classList.add('active');
	       	activePlayerCard.children[0].innerHTML = currentNum;
	    });
		activePlayerCard.addEventListener("click", function() {
			this.parentElement.classList.remove('active');
		});
	});

	// CHECK TRIGGERS 
	triggers.forEach(function(e) {
		e.addEventListener("click", function(e) {
			e.preventDefault();
			if(this === navTrigger || this === deckTrigger) {
				navigation.classList.toggle('active');
			} else if(this === rulesTrigger)  {
				navigation.classList.remove('active');
				rulesContainer.classList.add('active');
			} else if(this === navOverlay) {
				navigation.classList.remove('active');
			} else if(this === closeTrigger || this === closeSettings) {
				rulesContainer.classList.remove('active');
				settings.classList.remove('active');
			} else if(this === settingsTrigger) {
				navigation.classList.remove('active');
				settings.classList.add('active');
			}
		});
	});

	// CUSTOM APP SETTINGS
	settingTabs.forEach(function(e) {

		let currentElement = e;
		let currentTheme   = e.dataset.theme;
		let currentDeck    = e.dataset.deck;
		let themeStorage   = localStorage.getItem('Theme');
		let deckStorage    = localStorage.getItem('Deck');

		if(themeStorage === currentTheme) {
			setTheme(currentElement, currentTheme,);
		}
		if(deckStorage === currentDeck) {
			setDeck(currentElement,currentDeck);
		}
		e.addEventListener("click", function(e) {
			if(currentTheme) {
				setTheme(currentElement, currentTheme);
			} else if(currentDeck) {
				setDeck(currentElement, currentDeck);
			}
		});

	});

	// CHECKS SERVICE WORKER SUPPORT
	if('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./sw.js')
			.then((reg) => console.log('service worker registered', reg))
			.catch((err) => console.log('service worker not registered', err));
	}

	// SHARE API
	shareBtn.onclick = function(e) {
		
		if (navigator.share) {
			navigator.share({
		    	title: pageTitle,
		    	url: currentURL
		  	})
			.then(() => console.log('Successful share'))
		    .catch((error) => console.log('Error sharing', error));
		} else {
	        const text = currentURL;
	        const input = document.createElement('input');
	        document.body.appendChild(input);
	        input.value = text;
	        input.focus();
	        input.select();
	        input.setSelectionRange(0, 99999);
	        document.execCommand('copy');
	        input.remove();
	        alert('Link Copied to Clipboard');
		}

	}

	// SET DECK STYLE
	function setDeck(element, currentDeck) {

		element.classList.toggle('on');
		app.classList.toggle(currentDeck);

		if(element.classList.contains('on')) {
			cardContent.forEach(function(e) {
				let dataTee = e.dataset.tee;
				if(dataTee) {
					e.innerHTML = dataTee;
				} 
				else {
					e.parentElement.style.display = "none";
				}
			});
			localStorage.setItem('Deck', currentDeck);
		} else {
			cardContent.forEach(function(e) {
				let dataDefault = e.dataset.default;
				let parent 	    = e.parentElement;
				if(dataDefault) {
					e.innerHTML = dataDefault;
					parent.style.display = "block";
				} else {
					parent.style.display = "block";
				}
			});	
			localStorage.removeItem('Deck');
		}

	}


	// SET THEME
	function setTheme(element, themeType) {

		element.classList.toggle('on');
		app.classList.toggle(themeType);

		if(element.classList.contains('on')) {
			localStorage.setItem('Theme', themeType);
		} else {
			localStorage.removeItem('Theme');
		}

	}

})();