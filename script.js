const select = (selector) => document.querySelector(selector);

/* Menu mobile */
const burger = select('.burger');
const menu = select('.menu');

burger.onclick = () => {
	const isOpen = menu.classList.toggle('open');
	burger.setAttribute('aria-expanded', isOpen);
};

menu.onclick = (event) => {
	if (event.target.matches('a')) {
		menu.classList.remove('open');
		burger.setAttribute('aria-expanded', false);
	}
};

/* Navigasi aktif saat scroll */
const navigationLinks = [...menu.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				navigationLinks.forEach((link) => {
					link.classList.toggle(
						'active',
						link.getAttribute('href') === `#${entry.target.id}`,
					);
				});
			}
		});
	},
	{ rootMargin: '-40% 0px -55% 0px' },
);

document.querySelectorAll('main section[id]').forEach((section) => {
	sectionObserver.observe(section);
});

/* Carousel hewan */
const track = select('#track');
const dots = select('#dots');

const visibleCards = () => (innerWidth <= 720 ? 1 : innerWidth <= 960 ? 2 : 3);
const pageCount = () => Math.ceil(track.querySelectorAll('.card').length / visibleCards());
const pageWidth = () => track.clientWidth + 24;

function updateDots() {
	dots.innerHTML = '';

	for (let pageIndex = 0; pageIndex < pageCount(); pageIndex++) {
		const dot = document.createElement('button');
		dot.setAttribute('aria-label', `Halaman ${pageIndex + 1}`);
		dot.onclick = () => {
			track.scrollTo({ left: pageIndex * pageWidth(), behavior: 'smooth' });
		};
		dots.appendChild(dot);
	}

	updateActiveDot();
}

function updateActiveDot() {
	const activePage = Math.min(
		pageCount() - 1,
		Math.round(track.scrollLeft / pageWidth()),
	);

	[...dots.children].forEach((dot, index) => {
		dot.classList.toggle('on', index === activePage);
	});
}

select('#next').onclick = () => {
	const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
	const nextPosition = isAtEnd ? 0 : track.scrollLeft + pageWidth();

	track.scrollTo({ left: nextPosition, behavior: 'smooth' });
};

select('#prev').onclick = () => {
	const previousPosition = track.scrollLeft < 4
		? track.scrollWidth
		: track.scrollLeft - pageWidth();

	track.scrollTo({ left: previousPosition, behavior: 'smooth' });
};

track.addEventListener('scroll', () => requestAnimationFrame(updateActiveDot));
addEventListener('resize', updateDots);
updateDots();

/* Testimoni */
const peopleContainer = select('#people');

function selectPerson(index) {
	const safeIndex = Math.min(
		Math.max(Number(index) || 0, 0),
		Math.max(peopleContainer.children.length - 1, 0)
	);

	[...peopleContainer.children].forEach((personButton, buttonIndex) => {
		personButton.classList.toggle('on', buttonIndex === safeIndex);
	});
}

peopleContainer.onclick = (event) => {
	const personButton = event.target.closest('.person');
	if (personButton) selectPerson(Number(personButton.dataset.i));
};

selectPerson(0);
