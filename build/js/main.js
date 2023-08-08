

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
const scrollToSection = () => {
	$('.js-scrollToSection').click(function () {
		var scroll_elem = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(scroll_elem).offset().top
		}, 1000);
	});
}
// document.addEventListener('DOMContentLoaded', function () {
//     // СКРОЛЛ К НУЖНОЙ СЕКЦИИ ПО КЛИКУ НА ПУНКТАХ МЕНЮ
//     $('.menu__link').click(function () {
//         var scroll_elem = $(this).attr('href');
//         $('html, body').animate({
//             scrollTop: $(scroll_elem).offset().top
//         }, 1000);
//     });
//     // ДОБАВЛЯЕМ АКТИВНЫЙ КЛАСС ШАПКЕ
//     function headerActiveToggle() {
//         const scrollSize = window.pageYOffset
//         scrollSize > 1 ? header.classList.add('active') : header.classList.remove('active')
//     }
//     window.addEventListener('load', headerActiveToggle) // ПРИ ПЕРЕЗАГРУЗКЕ СТРАНИЦЫ ЕСЛИ СТРАНИЦА УЖЕ ПРОСКРОЛЛЕНА
//     window.addEventListener('scroll', headerActiveToggle) // ПРИ СКРОЛЛЕ
// });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
document.querySelector('.js-closeFancybox').addEventListener('click', function () {
	Fancybox.close()
})


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ МАСКА ДЛЯ ИНПУТОВ (https://github.com/RobinHerbots/Inputmask)
const inputMask = () => {
	$(".js-maskPhone").inputmask({
		mask: "+7 (999) 99-99-999",
		clearIncomplete: true,
	});
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ СЛАЙДЕР SWIPER (https://swiperjs.com/get-started)
const sliders = () => {
	const swiper = new Swiper(".js-sliderSteps", {
		slidesPerView: 4,
		spaceBetween: 30,
		navigation: {
			nextEl: ".steps .js-slideNext",
			prevEl: ".steps .js-slidePrev",
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			565: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 4,
			},
		},
	});
	const swiper1 = new Swiper(".js-sliderPartners", {
		loop: true,
		slidesPerView: 5,
		spaceBetween: 10,
		navigation: {
			nextEl: ".partners .js-slideNext",
			prevEl: ".partners .js-slidePrev",
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			565: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 4,
			},
			1200: {
				slidesPerView: 5,
			},
		},
	});
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ КАЛЬКУЛЯТОР
const calculator = () => {
	// ~~~~~~~~~~~~~~~~ подсвечиваем цвет бордера
	document.documentElement.addEventListener("click", function (e) {
		let target = e.target;
		let selectItem = target == document.querySelector(".select__item");
		if (target.classList.contains("js-borderColor")) {
			document.querySelectorAll(".js-borderColor").forEach((item) => {
				item.classList.remove("is-borderColorBlue");
			});
			target.classList.add("is-borderColorBlue");
		}
		if (
			target.closest(".js-borderColor") &&
			!target.closest(".select__item")
		) {
			document.querySelectorAll(".js-borderColor").forEach((item) => {
				item.classList.remove("is-borderColorBlue");
			});
			target
				.closest(".js-borderColor")
				.classList.add("is-borderColorBlue");
		} else {
			document.querySelectorAll(".js-borderColor").forEach((item) => {
				item.classList.remove("is-borderColorBlue");
			});
		}
	});

	let sum = document.querySelector(".js-sum"), // видимый инпут с суммой, с разбивкой на разряды
		// sumDouble - это будет скрытый инпут с суммой , который будет дублировать видимый, но без разбивки на разряды
		// (формула будет работать именно с этим инпутом, т.к разбивка на разряды нужна только для видимости)
		sumDouble = document.querySelector(".js-sumDouble"),
		period = document.querySelector(".js-period"),
		periodInput = document.querySelector(".js-periodInput"),
		percent = document.querySelector(".js-percent"),
		resultSum = document.querySelector(".js-resultSum"),
		periodValue = document.querySelector(".js-periodValue");

	// ~~~~~~~~~~~~~~~~ CUSTOM SELECT
	document.querySelectorAll(".select").forEach((select) => {
		let selectArr = select.querySelectorAll(".select"),
			selectHeader = select.querySelectorAll(".select__header"),
			selectItem = select.querySelectorAll(".select__item"),
			currentItem = select.querySelector(".select__current");
		selectHeader.forEach((item) => {
			item.addEventListener("click", selectToggle);
		})
		selectItem.forEach((item) => {
			item.addEventListener("click", selectChoose);
		})
		function selectToggle() {
			this.parentElement.classList.toggle("is-active");
		}
		function selectChoose() {
			let selectOption = this.innerText,
				thisSelect = this.closest(".select"),
				selectInput = select.querySelector(".select__input");
			currentItem.innerHTML = selectOption;
			selectInput.value = selectOption;
			thisSelect.classList.remove("is-active");

			// каждый раз при клике на значение select__item...
			// в элемент js-percent передаем значение из data-percent кликнутого элемента
			percent.innerHTML = this.dataset.percent;
			// скрытому инпуту устанавливаем атрибут data-max и передаем туда значение
			// из атрибута data-maxsum кликнутого элемента
			sumDouble.setAttribute("data-max", this.dataset.maxsum);
			// значение у видимого инпута сбрасываем до 1000000 с визуальной разбивкой на разряды
			sum.value = "1 000 000";
			// значение у скрытого инпута сбрасываем до 1000000 без разбивки по разрядам
			sumDouble.value = "1000000";
			// в элемент js-period передаем значение из data-period кликнутого элемента
			period.innerHTML = "1";
			// инпуту со сроком устанавливаем атрибут data-period
			periodInput.setAttribute("data-period", this.dataset.period);
			// значение срока кредита сбрасываем до 1 года
			periodInput.value = "1";
			// вызываем формулу
			formula();
			changePeriodValue();
		}
		document.addEventListener("click", (e) => {
			if (!select.contains(e.target)) {
				select.classList.remove("is-active");
			}
		})
	})

	// ~~~~~~~~~~~~~~~~ формула расчета аннуитетного платежа - https://yandex.ru/images/search?img_url=https%3A%2F%2Fwww.credytoff.ru%2Fwp-content%2Fuploads%2F2017%2F11%2FKak-rasschitat-annuitetnyj-platezh-po-ipoteke.jpg&lr=10758&pos=23&rpt=simage&source=serp&text=%D1%84%D0%BE%D1%80%D0%BC%D1%83%D0%BB%D0%B0%20%D0%B0%D1%83%D1%82%D0%B5%D0%BD%D1%82%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%B0
	function formula() {
		// процентная ставка по займу в мес
		let i = percent.value / (100 * 12)
		// кол-во месяцев
		let n = periodInput.value * 12
		// формула расчета аннуитетного платежа
		let k = (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
		// в значении Ежемесячный платеж выводим результат
		// Number(this.value.replace(/\D/g,'')).toLocaleString('ru') - разбивает число на разряды
		resultSum.innerHTML = Math.round(
			sumDouble.value.replace(/\D/g, "") * k
		).toLocaleString("ru")
	}
	formula();
	// ~~~~~~~~~~~~~~~ вызываем формулу при смене суммы или срока
	
	// для скрытого инпута с суммой ставим изначальный атрибут, который приходит с значения Тип кредитования
	sumDouble.setAttribute("data-max", "12000000")
	
	// у видимого инпута с суммой делаем разбивку на разряды
	sum.value = Number(sum.value.replace(/\D/g, "")).toLocaleString("ru")
	
	// меняем значение инпута - Сумма кредита
	sum.addEventListener("input", function () {
		// при изменении значения в инпуте, сохраняем ему разбивку на разряды
		this.value = Number(this.value.replace(/\D/g, "")).toLocaleString("ru");
		// теперь выведем значение инпута в переменную и уберем из него разбивку по разрядам
		let transform = this.value.replace(/\s+/g, "");
		transform = transform * 1;
		// в скрытый инпут передаем это значение, без разбивки по разрядам
		sumDouble.value = transform;
		// если значение скрытого инпута больше или равно значению атрибута data-max этого же инпута
		if (sumDouble.value >= Number(sumDouble.dataset.max)) {
			// тогда значение видимого инпута не может измениться выше предела, заданного в data-max скрытого инпута + разбивка на разряды
			this.value = Number(
				sumDouble.dataset.max.replace(/\D/g, "")
			).toLocaleString("ru");
			// значение скрытого инпута также не может превысить предел, заданный в data-max этого инпута
			sumDouble.value = sumDouble.dataset.max;
		}
		// если значение скрытыго инпута меньше миллиона
		if(sumDouble.value < 1000000){
            sumDouble.value = 0
            document.querySelector('.js-sumField').querySelector('.calculate__label').innerHTML = "😢 Выберите сумму больше миллиона"
            document.querySelector('.js-sumField').classList.add('is-borderError')
		} else if(sumDouble.value >= 1000000){
		    document.querySelector('.js-sumField').querySelector('.calculate__label').innerHTML = 'Сумма кредита'
            document.querySelector('.js-sumField').classList.remove('is-borderError')
		}
		formula();
	})
	
	// меняем значение год, года, лет
	function changePeriodValue() {
		switch (parseInt(periodInput.value)) {
			case 1:
				periodValue.innerHTML = " год";
				break;
			case 2:
				periodValue.innerHTML = " года";
				break;
			case 3:
				periodValue.innerHTML = " года";
				break;
			case 4:
				periodValue.innerHTML = " года";
				break;
			case 21:
				periodValue.innerHTML = " год";
				break;
			case 22:
				periodValue.innerHTML = " года";
				break;
			case 23:
				periodValue.innerHTML = " года";
				break;
			case 24:
				periodValue.innerHTML = " года";
				break;

			default:
				periodValue.innerHTML = " лет";
				break;
		}
	}

	// для инпута со сроком изначальный атрибут, который приходит с значения Тип кредитования - data-period
	periodInput.setAttribute("data-period", "30");
	
	// меняем значение инпута - Срок кредита
	periodInput.addEventListener("input", function () {
		// если значение в инпуте срока больше или равно значению атрибута data-period этого же инпута
		if (+this.value >= this.dataset.period) {
			// тогда значение этого инпута не может стать выше предела, заданного в data-period
			this.value = this.dataset.period;
		}
		// в значении js-period выводим значение из js-periodInput
		period.innerHTML = +periodInput.value;
		formula();
		changePeriodValue();
	});
	
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FAQ
const accordeons = (box, item, header, content, openedClass, closedClass) => {
	const accordeon = document.querySelector(box)

	const accItem = accordeon.querySelectorAll(item)

	accItem.forEach((item) => {
		// перебираем все блоки аккордеона
		const accContent = item.querySelector(content)
		accContent.style.cssText = `
		overflow: hidden;
		transition: all .3s;
	  `
		item.className = closedClass
		accContent.style.maxHeight = 0
		item.addEventListener("click", toggle)
	})

	accItem[0].className = openedClass;
	accItem[0].querySelector(content).style.maxHeight =
		accItem[0].querySelector(content).scrollHeight + "px"

	function toggle(e) {
		let target = e.target
		e.preventDefault()
		const thisClass = this.className
		const itsAccHeader =
			target == this.querySelector(header) ||
			this.querySelector(header).contains(target)
		const accHeader = this.querySelector(header)
		const accContent = this.querySelector(content)

		accItem.forEach((item) => {
			const accHeader = item.querySelector(header)
			const accContent = item.querySelector(content)
			if (itsAccHeader) {
				item.className = closedClass
				accContent.style.maxHeight = 0
			}
		})

		if (thisClass == closedClass) {
			this.className = openedClass
			this.querySelector(content).style.maxHeight =
				this.querySelector(content).scrollHeight + "px"
		}
	}
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GSAP
const animation = () => {
	function parallax($elem, $val, $trigger, $start, $end){
		gsap.to($elem, {
			y: $val,
			scrollTrigger: {
				trigger: $trigger,
				start: $start,
				end: $end,
				scrub: 2,
				// markers: {
				// 	fontSize: '20px',
				// 	startColor: 'green',
				// 	endColor: 'red'
				// }
			},
		})
	}
	parallax(".js-animate1",  500, '.home',    'top 100', '+=9500')
	parallax(".js-animate3", -500, '.home',    'top 100', '+=9500')
	parallax(".js-animate4",  500, '.consult', 'top 90%', '+=13500')
	parallax(".js-animate5", -500, '.consult', 'top 90%', '+=3500')
	parallax(".js-animate6",  200, '.consult2', 'top 90%', '+=3500')
	if(document.documentElement.clientWidth > 992){
		parallax(".director", 200, '.advantages', 'top 90%', '+=1500')
	}

	gsap.from('.home__content', {
		y: -500,
		opacity: 0,
	})
	gsap.from('.js-animate7', {
		y: -500,
		opacity: 0,
	})
	gsap.from('.calculate__box', {
		y: -500,
		opacity: 0,
		scrollTrigger: {
			trigger: '.calculate',
			start: '50% 90%',
			end: '50% 50%',
			scrub: false,
			toggleActions: 'play none none reverse',
			// markers: {
			// 	fontSize: '20px',
			// 	startColor: 'green',
			// 	endColor: 'red'
			// }
		},
	})
	gsap.from('.condition', {
		y: -500,
		opacity: 0,
		stagger: .2,
		scrollTrigger: {
			trigger: '.conditions',
			start: 'top 70%',
			end: 'top 70%',
			scrub: false,
			toggleActions: 'play none none reverse',
			// markers: {
			// 	fontSize: '20px',
			// 	startColor: 'green',
			// 	endColor: 'red'
			// }
		},
	})
	gsap.from('.step', {
		x: -500,
		opacity: 0,
		stagger: .2,
		scrollTrigger: {
			trigger: '.steps',
			start: 'top 70%',
			end: 'top 70%',
			scrub: false,
			toggleActions: 'play none none reverse',
			// markers: {
			// 	fontSize: '20px',
			// 	startColor: 'green',
			// 	endColor: 'red'
			// }
		},
	})
	gsap.from('.accordeon__item', {
		y: -500,
		opacity: 0,
		stagger: .2,
		scrollTrigger: {
			trigger: '.faq',
			start: 'top 70%',
			end: 'top 70%',
			scrub: false,
			toggleActions: 'play none none reverse',
			// markers: {
			// 	fontSize: '20px',
			// 	startColor: 'green',
			// 	endColor: 'red'
			// }
		},
	})
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ КАРТА, ОТЛОЖЕННАЯ ЗАГРУЗКА (ЧТОБЫ УЛУЧШИТЬ ПОКАЗАТЕЛИ - PageSpeed Insights)
const map = () => {
	setTimeout(function () {
		var headID = document.getElementsByTagName("body")[0];
		var newScript = document.createElement("script");
		newScript.type = "text/javascript";
		newScript.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
		headID.appendChild(newScript);
	}, 3000);
	setTimeout(function () {
		var myMap = new ymaps.Map(
			"map",
			{
				center: [55.917879, 37.806326],
				zoom: 13,
				controls: ["smallMapDefaultSet"],
			},
			{
				searchControlProvider: "yandex#search",
			}
		);

		myGeoObject = new ymaps.GeoObject({
			geometry: {
				type: "Point",
			},
		});
		myMap.geoObjects.add(myGeoObject).add(
			new ymaps.Placemark(
				[55.917879, 37.806326],
				{
					balloonContent: "<strong></strong>",
					iconCaption: "М.О., г. Королев, ул. Ленина 12",
				},
				{
					preset: "islands#blueCircleDotIconWithCaption",
					iconCaptionMaxWidth: "200",
				}
			)
		);

		myMap.setType("yandex#publicMap");

		myMap.behaviors.disable("scrollZoom");
		//на мобильных устройствах... (проверяем по userAgent браузера)
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		) {
			//... отключаем перетаскивание карты
			myMap.behaviors.disable("drag");
		}
	}, 4000);
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
scrollToSection()
inputMask()
sliders()
calculator()
accordeons(".accordeon", ".accordeon__item", ".accordeon__header", ".accordeon__content", "accordeon__item opened", "accordeon__item closed")
animation()
